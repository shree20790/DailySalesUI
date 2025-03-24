import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import debounce from "lodash.debounce";
import AlertService from "../../utils/AlertService";
import IconPlus from "../../components/Icon/IconPlus";
import IconTrashLines from "../../components/Icon/IconTrashLines";
import IconEdit from "../../components/Icon/IconEdit";
import clientService from "../../services/Client/clientservice";
import axios from "axios";

// Utility function to format date to dd/mm/yyyy
const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

// Utility function to convert date to ISO format for backend
const toISODate = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}T00:00:00`;
};

// Function to upload the photo
const uploadPhoto = async (file) => {
    const formData = new FormData();
    formData.append('Files', file);
    formData.append('FolderName', 'Profile');
    formData.append('FileName', file.name);

    try {
        const response = await axios.post('https://dailysalesapi.skylynxclass.in/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data.success) {
            // Replace backslashes with forward slashes in the file path
            const filePath = response.data.files[0].replace(/\\/g, '/');
            const relativePath = `Profile\\${filePath.split('/').pop()}`;
            console.log('Photo uploaded successfully:', relativePath);
            return relativePath;
        } else {
            throw new Error('Photo upload failed');
        }
    } catch (error) {
        throw new Error('Photo upload failed');
    }
};

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editedClient, setEditedClient] = useState({
        customerName: "",
        mobileNumber: "",
        address: "",
        refOfFriends: "",
        comment: "",
        date: formatDate(new Date()), // Set default value to current date in dd/mm/yyyy format
        photo: null,
    });
    const [photoPreview, setPhotoPreview] = useState(null);
    const [addTaskModal, setAddTaskModal] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            setLoading(true);
            try {
                const response = await clientService.getAllClients();
                if (!response.data || !Array.isArray(response.data.output)) {
                    throw new Error("Invalid data format: Expected an array.");
                }
                setClients(response.data.output.map(client => ({
                    ...client,
                    date: client.date ? formatDate(new Date(client.date)) : formatDate(new Date()) // Ensure date is formatted
                })));
                setTotalRows(response.data.output.length);
            } catch (err) {
                setError(err.message || "Error loading clients");
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, [currentPage, rowsPerPage, searchQuery, refresh]);

    // Handle Search
    const handleSearch = debounce((e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    }, 500);

    // Handle Delete
    const handleDelete = async (id) => {
        const confirmDelete = await AlertService.confirm({
            message: "Are you sure you want to delete this client?"
        });

        if (!confirmDelete.isConfirmed) return;
        try {
            await clientService.deleteClient(id);
            AlertService.success("Client deleted successfully!");
            setClients((prevClients) => prevClients.filter((client) => client.id !== id));
            setTotalRows((prevTotalRows) => prevTotalRows - 1);
            setRefresh((prev) => !prev);
        } catch (err) {
            AlertService.warning("Failed to delete client");
        }
    };

    
  // Handle Edit
const handleEdit = (client) => {
    setEditedClient({
        ...client,
        date: client.date ? client.date : formatDate(new Date()) // Ensure date is formatted
    });
    //console.log(client.photo.replace(/profile\\/g, ""))
    console.log(client.photo)
    const str=client.photo.slice(8)
    
    client.photo = `https://dailysalesapi.skylynxclass.in/api/upload/download?folderName=Profile&fileName=${str}`;
    console.log(client.photo)

    //let abc=`aprofile\\`
    //console.log(client.photo)
    //abc=abc.replace(/profile\\/g, "")
    //console.log(abc)
    //console.log(client.photo)
    setPhotoPreview(client.photo); // Directly set the photo URL
    
    
    setEditModalOpen(true);
};


    // Handle Modal Close
    const handleModalClose = () => {
        setEditModalOpen(false);
        setEditedClient({
            customerName: "",
            mobileNumber: "",
            address: "",
            refOfFriends: "",
            comment: "",
            date: formatDate(new Date()), // Reset to current date in dd/mm/yyyy format
            photo: null,
        });
        setPhotoPreview(null);
        setAddTaskModal(false);
    };

    // Handle Input Change
    const handleInputChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        const updatedClient = { ...editedClient, [e.target.name]: value };
        if (e.target.name === 'date') {
            updatedClient[e.target.name] = value;
        }
        setEditedClient(updatedClient);
    };

    // Handle Photo Change
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setEditedClient({ ...editedClient, photo: file });
        setPhotoPreview(URL.createObjectURL(file));
        console.log('Photo selected:', file);
    };

    // Handle Update
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            let photoPath = editedClient.photo;
            if (photoPath instanceof File) {
                photoPath = await uploadPhoto(photoPath);
            }

            const clientData = {
                ...editedClient,
                date: toISODate(editedClient.date),
                photo: photoPath,
            };
            await clientService.updateClient(editedClient.id, clientData);
            setClients((prevClients) =>
                prevClients.map((client) =>
                    client.id === editedClient.id ? { ...editedClient, date: formatDate(new Date(editedClient.date)), photo: photoPath } : client
                )
            );
            AlertService.success("Client updated successfully!");
            handleModalClose();
            setRefresh((prev) => !prev);
        } catch (err) {
            AlertService.warning("Failed to update client");
        }
    };

    // Handle Create
    const handleCreateClient = async (e) => {
        e.preventDefault();
        try {
            let photoPath = editedClient.photo;
            if (photoPath instanceof File) {
                photoPath = await uploadPhoto(photoPath);
            }

            const clientData = {
                ...editedClient,
                date: toISODate(editedClient?.date),
                photo: photoPath,
            };
            const response = await clientService.createClient(clientData);
            setClients((prevClients) => [{ ...response.data.output, date: formatDate(new Date(response?.data?.output?.date)), photo: photoPath }, ...prevClients]);
            setTotalRows((prevTotalRows) => prevTotalRows + 1);
            AlertService.success("Client added successfully!");
            setRefresh((prev) => !prev);
            handleModalClose();
        } catch (err) {
            AlertService.warning("Failed to add client");
        }
    };

    // Pagination Handler
    const handlePageChange = (direction) => {
        if (direction === "prev" && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        } else if (direction === "next" && currentPage * rowsPerPage < totalRows) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    // Sorting
    const sortedClients = [...clients].sort((a, b) => b.id - a.id);

    // Filtered and Paginated Data
    const filteredClients = sortedClients.filter((client) =>
        client && client.customerName && client.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const displayedClients = filteredClients.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <div className="flex flex-col gap-5 relative sm:h-[calc(100vh_-_150px)] h-full">
            <div
                className={`overlay bg-black/60 w-full h-full rounded-md absolute ${addTaskModal ? 'block' : 'hidden'}`}
                onClick={() => setAddTaskModal(!addTaskModal)}
            ></div>
            <div className="bg-white dark:bg-[#121c2c] rounded-lg shadow w-full flex-grow">
                <div className="flex flex-wrap items-center justify-between p-4">
                    <h3 className="text-lg font-semibold">Client List</h3>
                    <div className="flex items-center space-x-4">
                        <button className="btn btn-primary w-full" type="button" onClick={() => setAddTaskModal(true)}>
                            <IconPlus className="ltr:mr-2 rtl:ml-2 shrink-0" />
                            Add New Client
                        </button>
                        <div className="flex items-center border-gray-300 rounded bg-gray-100 dark:bg-[#1b2e4b] p-2 w-full sm:w-50">
                            <FaSearch className="text-gray-400 text-lg" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent border-none focus:outline-none ml-2 w-full text-gray-700"
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#121c2c] rounded-lg shadow overflow-x-auto p-4">
                    <table className="table-responsive w-full border border-gray-200 dark:border-gray-700">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-[#1b2e4b] text-gray-700 dark:text-white">
                                <th className="p-2 text-center">ID</th>
                                <th className="p-2 text-center">Customer Name</th>
                                <th className="p-2 text-center">Mobile Number</th>
                                <th className="p-2 text-center">Address</th>
                                <th className="p-2 text-center">Ref Of Friends</th>
                                <th className="p-2 text-center">Comment</th>
                                <th className="p-2 text-center">Date</th>
                                <th className="p-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="8" className="text-center p-4">Loading...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="8" className="text-center p-4 text-red-500">{error}</td></tr>
                            ) : displayedClients.length > 0 ? (
                                displayedClients.map((client) => (
                                    <tr key={client.id} className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a202c] text-gray-900 dark:text-white">
                                        <td className="p-2 text-center">{client.id}</td>
                                        <td className="p-2 text-center">{client.customerName}</td>
                                        <td className="p-2 text-center">{client.mobileNumber}</td>
                                        <td className="p-2 text-center">{client.address}</td>
                                        <td className="p-2 text-center">{client.refOfFriends}</td>
                                        <td className="p-2 text-center">{client.comment}</td>
                                        <td className="p-2 text-center">{client.date}</td>
                                        <td className="p-2 flex justify-center gap-3">
                                            <button className="text-blue-500 cursor-pointer" onClick={() => handleEdit(client)}>
                                                <IconEdit />
                                            </button>
                                            <button className="text-red-500 cursor-pointer" onClick={() => handleDelete(client.id)}>
                                                <IconTrashLines />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="8" className="text-center p-4">No clients available.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700 font-medium">Rows Per Page</span>
                        <select value={rowsPerPage}
                            onChange={(e) => setRowsPerPage(Number(e.target.value))}
                            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-gray-500 cursor-pointer"
                        >
                            {[10, 20, 50, 100].map((size) => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span>{(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, totalRows)} of {totalRows}</span>
                        <button onClick={() => handlePageChange('prev')}
                            disabled={currentPage === 1}
                            className={`p-2 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}`}
                        >
                            <FaChevronLeft />
                        </button>

                        <button onClick={() => handlePageChange('next')}
                            disabled={currentPage * rowsPerPage >= totalRows}
                            className={`p-2 rounded ${currentPage * rowsPerPage >= totalRows ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}`}
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </div>
            </div>

            <Transition appear show={editModalOpen || addTaskModal} as={Fragment}>
                <Dialog as="div" open={editModalOpen || addTaskModal} onClose={handleModalClose} className="relative z-[51]">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-xl text-black dark:text-white-dark">
                                    <button type="button"
                                        onClick={handleModalClose}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        ✖
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr/[50px] rtl:pl/[50px]">
                                        {editModalOpen ? "Edit Client" : "Add Client"}
                                    </div>
                                    <div className="p-5">
                                        <form onSubmit={editModalOpen ? handleUpdate : handleCreateClient}>
                                            {photoPreview && (
                                                <div className="mb-6 flex justify-center">
                                                    <img src={photoPreview} alt="Preview" className="w-24 h-24 rounded-full object-cover" />
                                                </div>
                                            )}

                                            <div className="mb-6">
                                                <label htmlFor="photo" className="block font-medium text-gray-700">Photo</label>
                                                <input
                                                    type="file"
                                                    id="photo"
                                                    name="photo"
                                                    onChange={handlePhotoChange}
                                                    className="form-input w/full"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                                                <div className="w/full">
                                                    <label htmlFor="customerName" className="block font-medium text-gray-700">Customer Name</label>
                                                    <input
                                                        type="text"
                                                        id="customerName"
                                                        name="customerName"
                                                        value={editedClient.customerName || ""}
                                                        onChange={handleInputChange}
                                                        className="form-input w/full"
                                                        required
                                                        placeholder="Customer Name"
                                                    />
                                                </div>

                                                <div className="w/full">
                                                    <label htmlFor="mobileNumber" className="block font-medium text-gray-700">Mobile Number</label>
                                                    <input
                                                        type="text"
                                                        id="mobileNumber"
                                                        name="mobileNumber"
                                                        value={editedClient.mobileNumber || ""}
                                                        onChange={(e) => {
                                                            const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                                                            if (value.length <= 10) {
                                                                handleInputChange({ target: { name: "mobileNumber", value } });
                                                            }
                                                        }}
                                                        className="form-input w/full"
                                                        required
                                                        placeholder="Mobile Number"
                                                        maxLength="10" // Limit the input to 10 characters
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                                                <div className="w/full">
                                                    <label htmlFor="address" className="block font-medium text-gray-700">Address</label>
                                                    <input
                                                        type="text"
                                                        id="address"
                                                        name="address"
                                                        value={editedClient.address || ""}
                                                        onChange={handleInputChange}
                                                        className="form-input w/full"
                                                        required
                                                        placeholder="Address"
                                                    />
                                                </div>

                                                <div className="w/full">
                                                    <label htmlFor="date" className="block font-medium text-gray-700">Date</label>
                                                    <input
                                                        type="text"
                                                        id="date"
                                                        name="date"
                                                        value={editedClient.date ? editedClient.date : ""}
                                                        onChange={handleInputChange}
                                                        className="form-input w/full"
                                                        required
                                                        placeholder="dd/mm/yyyy"
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                                                <div className="w/full">
                                                    <label htmlFor="comment" className="block font-medium text-gray-700">Comment</label>
                                                    <input
                                                        type="text"
                                                        id="comment"
                                                        name="comment"
                                                        value={editedClient.comment || ""}
                                                        onChange={handleInputChange}
                                                        className="form-input w/full"
                                                        placeholder="Comment"
                                                    />
                                                </div>

                                                <div className="w/full">
                                                    <label htmlFor="refOfFriends" className="block font-medium text-gray-700">Ref Of Friends</label>
                                                    <input
                                                        type="text"
                                                        id="refOfFriends"
                                                        name="refOfFriends"
                                                        value={editedClient.refOfFriends || ""}
                                                        onChange={handleInputChange}
                                                        className="form-input w/full"
                                                        required
                                                        placeholder="Ref Of Friends"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-end items-center mt-8">
                                                <button type="button"
                                                    className="btn btn-outline-danger"
                                                    onClick={handleModalClose}
                                                >
                                                    Cancel
                                                </button>
                                                <button type="submit"
                                                    className="btn btn-primary ml-4"
                                                >
                                                    {editModalOpen ? "Update" : "Add"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default ClientList;