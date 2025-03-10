import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import debounce from "lodash.debounce";
import Select from 'react-select';
import ClientHistoryService from "../../services/ClientHistory/clientHistoryService";
import AlertService from "../../utils/AlertService";
import IconPlus from "../../components/Icon/IconPlus"; // Ensure this import is correct
import IconTrashLines from "../../components/Icon/IconTrashLines";
import IconEdit from "../../components/Icon/IconEdit";
import SelectStyles from "../../utils/SelectStyles";

// Utility function to fetch customer names
const fetchCustomerNames = async () => {
  try {
    const response = await fetch("https://dailysales.skylynxtech.com:8082/api/CustomerProfile/getAllCustomerProfiles?includeInActive=true");
    const data = await response.json();
    if (data.isSuccess && Array.isArray(data.output)) {
      return data.output.map(customer => ({
        id: customer.id,
        customerName: customer.customerName,
        mobileNumber: customer.mobileNumber
      }));
    } else {
      throw new Error("Failed to fetch customer names");
    }
  } catch (err) {
    console.error("Error fetching customer names:", err);
    return [];
  }
};

const ClientHistory = () => {
  const [clientHistories, setClientHistories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addTaskModal, setAddTaskModal] = useState(false);
  const [customerNames, setCustomerNames] = useState([]);
  const [editedClientHistory, setEditedClientHistory] = useState({
    id: "",
    customerId: "",
    customerName: "",
    mobileNumber: "",
    sereviceName: "",
    packTaken: "",
    remainingPack: "",
    clientAttendBy: "",
  });
  const [displayHistory, setDisplayHistory] = useState([]);
  const[count,setCount]=useState(0)
  console.log(displayHistory);

  // Fetch Client Histories
  useEffect(() => {
    const fetchClientHistories = async () => {
      setLoading(true);
      try {
        console.log("Fetching Client Histories...");
        const response = await ClientHistoryService.getPaginatedClientHistories(currentPage, rowsPerPage);
        let respData = await response.data;

        if (!respData || !Array.isArray(respData.output.result)) {
          throw new Error("Invalid data format: Expected an array.");
        }
        setClientHistories(respData.output.result);
        setTotalRows(respData.output.rowCount);

        setDisplayHistory(respData.output.result);
      } catch (err) {
        setError(err.message || "Error loading client histories");
      } finally {
        setLoading(false);
      }
    };

    fetchClientHistories();
  }, [currentPage, rowsPerPage, searchQuery,count]);

  // Fetch Customer Names
  useEffect(() => {
    const fetchNames = async () => {
      const names = await fetchCustomerNames();
      setCustomerNames(names);
    };

    fetchNames();
  }, []);

  // Handle Search
  const handleSearch = debounce((e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, 500);

  // Handle Edit
  const handleEdit = (clientHistory) => {
    const selectedCustomer = customerNames.find(item => item.id === clientHistory.CustomerId) || { id: clientHistory.CustomerId, customerName: clientHistory.CustomerName, mobileNumber: clientHistory.MobileNumber };
    setEditedClientHistory({
      id: clientHistory.Id,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.customerName,
      mobileNumber: selectedCustomer.mobileNumber,
      sereviceName: clientHistory.SereviceName,
      packTaken: clientHistory.PackTaken,
      remainingPack: clientHistory.RemainingPack,
      clientAttendBy: clientHistory.ClientAttendBy,
    });
    setEditModalOpen(true);
  };

  // Handle Modal Close
  const handleModalClose = () => {
    setEditModalOpen(false);
    setAddTaskModal(false);
    setEditedClientHistory({
      id: "",
      customerId: "",
      customerName: "",
      mobileNumber: "",
      sereviceName: "",
      packTaken: "",
      remainingPack: "",
      clientAttendBy: "",
    });
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setEditedClientHistory({ ...editedClientHistory, [e.target.name]: value });
  };

  // Handle Select Change
  const handleSelectChange = (selectedOption, actionMeta) => {
    const selectedCustomer = customerNames.find(customer => customer.id === selectedOption.value);
    setEditedClientHistory({ 
      ...editedClientHistory, 
      customerId: selectedOption.value, 
      customerName: selectedOption.label,
      mobileNumber: selectedCustomer ? selectedCustomer.mobileNumber : ""
    });
  };

  // Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log("Updating Client History:", editedClientHistory); // Add this line
    try {
      const updatedClientHistory = {
        ...editedClientHistory,
      };
      const response = await ClientHistoryService.updateClientHistory(updatedClientHistory);
      setClientHistories((prev) =>
        prev.map((client) => (client.id === editedClientHistory.id ? updatedClientHistory : client))
      );
      setDisplayHistory((prev) =>
        prev.map((client) => (client.id === editedClientHistory.id ? updatedClientHistory : client))
      );
      AlertService.success("Client history updated successfully!");
      handleModalClose();
      setCount((prev)=>prev+1)
    } catch (err) {
      AlertService.warning("Failed to update client history");
    }
  };

  // Handle Create
  const handleCreateClientHistory = async (e) => {
    e.preventDefault();
    console.log("Creating Client History:", editedClientHistory); // Add this line
    try {
      const newClientHistory = {
        ...editedClientHistory,
      };
      const response = await ClientHistoryService.createClientHistory(newClientHistory);
      const createdClientHistory = response.data.output;
      setClientHistories((prev) => [createdClientHistory, ...prev]);
      setDisplayHistory((prev) => [createdClientHistory, ...prev]);
      setTotalRows((prev) => prev + 1);
      AlertService.success("Client history added successfully!");
      handleModalClose();
      setCount((prev)=>prev+1);
    } catch (err) {
      AlertService.warning("Failed to add client history");
    }
  };
  
  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await ClientHistoryService.deleteClientHistory(id);
      setClientHistories((prev) => prev.filter((client) => client.id !== id));
      setDisplayHistory((prev) => prev.filter((client) => client.id !== id));
      setTotalRows((prev) => prev - 1);
      AlertService.success("Client history deleted successfully!");
    } catch (err) {
      AlertService.warning("Failed to delete client history");
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

  const filteredClientHistories = clientHistories.filter((client) => {
    if (client && typeof client === 'object' && client.hasOwnProperty('SereviceName') && typeof client.SereviceName === 'string') {
      return client.SereviceName.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return false; // Exclude items that don't meet the criteria
  });
  //console.log(filteredClientHistories +" prn")
  const displayedClientHistories = filteredClientHistories.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="flex gap-5 relative sm:h-[calc(100vh_-_150px)] h-full">
      <div className="bg-white dark:bg-[#121c2c] rounded-lg shadow w-full flex-grow">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between p-4">
          <h3 className="text-lg font-semibold">Client History List</h3>
          <div className="flex items-center space-x-4">
            <button
              className="btn btn-primary w-full"
              type="button"
              onClick={() => setAddTaskModal(true)}
            >
              <IconPlus className="ltr:mr-2 rtl:ml-2 shrink-0" />
              Add New Client History
            </button>
            <div className="flex items-center border-gray-300 rounded bg-gray-100 dark:bg-[#1b2e4b] p-2 w-50">
              <FaSearch className="text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search by service name..."
                className="bg-transparent border-none focus:outline-none ml-2 w-full text-gray-700"
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#121c2c] rounded-lg shadow overflow-x-auto p-4">
          <table className="table-responsive w-full border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-200 dark:bg-[#1b2e4b] text-gray-700 dark:text-white">
                <th className="p-2 text-center">ID</th>
                <th className="p-2 text-center">Customer Name</th>
                <th className="p-2 text-center">Mobile Number</th>
                <th className="p-2 text-center">Service Name</th>
                <th className="p-2 text-center">Pack Taken</th>
                <th className="p-2 text-center">Remaining Pack</th>
                <th className="p-2 text-center">Client Attended By</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center p-4">Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" className="text-center p-4 text-red-500">{error}</td>
                </tr>
              ) : displayHistory.length > 0 ? (
                displayedClientHistories.map((client) => (
                  <tr key={client.Id} className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a202c] text-gray-900 dark:text-white">
                    <td className="p-2 text-center">{client.Id}</td>
                    <td className="p-2 text-center">{client.CustomerName}</td>
                    <td className="p-2 text-center">{client.MobileNumber}</td>
                    <td className="p-2 text-center">{client.SereviceName}</td>
                    <td className="p-2 text-center">{client.PackTaken}</td>
                    <td className="p-2 text-center">{client.RemainingPack}</td>
                    <td className="p-2 text-center">{client.ClientAttendBy}</td>
                    <td className="p-2 flex justify-center gap-3">
                      <button
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleEdit(client)}
                      >
                        <IconEdit />
                      </button>
                      <button
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDelete(client.Id)}
                      >
                        <IconTrashLines />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-4">No client histories available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">Rows Per Page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-gray-500 cursor-pointer"
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <span>
              {(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, totalRows)} of {totalRows}
            </span>
            <button onClick={() => handlePageChange("prev")} disabled={currentPage === 1} className="p-2 rounded text-gray-700">
              <FaChevronLeft />
            </button>
            <button onClick={() => handlePageChange("next")} disabled={currentPage * rowsPerPage >= totalRows} className="p-2 rounded text-gray-700">
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit Client History */}
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
                  <button type="button" onClick={handleModalClose} className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none">
                    ✖
                  </button>
                  <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                    {editModalOpen ? "Edit Client History" : "Add Client History"}
                  </div>
                  <div className="p-5">
                    <form onSubmit={editModalOpen ? handleUpdate : handleCreateClientHistory}>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="mb-6">
                          <label htmlFor="customerName" className="block font-medium text-gray-700">Customer Name</label>
                          <Select
                            id="customerName"
                            name="customerName"
                            styles={SelectStyles}
                            value={{ label: editedClientHistory.customerName, value: editedClientHistory.customerId }}
                            onChange={handleSelectChange}
                            options={customerNames.map(customer => ({ value: customer.id, label: customer.customerName }))}
                            className="basic-single w-full"
                            classNamePrefix="select"
                            isClearable
                            isSearchable
                            required
                            menuPosition="fixed"
                            placeholder="Select"
                          />
                        </div>
                        <div className="mb-6">
                          <label htmlFor="mobileNumber" className="block font-medium text-gray-700">Mobile Number</label>
                          <input
                            type="text"
                            id="mobileNumber"
                            name="mobileNumber"
                            value={editedClientHistory.mobileNumber || ""}
                            onChange={handleInputChange}
                            className="form-input w-full"
                            required
                            placeholder="Mobile Number"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="mb-6">
                          <label htmlFor="sereviceName" className="block font-medium text-gray-700">Service Name</label>
                          <input
                            type="text"
                            id="sereviceName"
                            name="sereviceName"
                            value={editedClientHistory.sereviceName || ""}
                            onChange={handleInputChange}
                            className="form-input w-full"
                            required
                            placeholder="Service Name"
                          />
                        </div>
                        <div className="mb-6">
                          <label htmlFor="packTaken" className="block font-medium text-gray-700">Pack Taken</label>
                          <input
                            type="text"
                            id="packTaken"
                            name="packTaken"
                            value={editedClientHistory.packTaken || ""}
                            onChange={handleInputChange}
                            className="form-input w-full"
                            required
                            placeholder="Pack Taken"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="mb-6">
                          <label htmlFor="remainingPack" className="block font-medium text-gray-700">Remaining Pack</label>
                          <input
                            type="text"
                            id="remainingPack"
                            name="remainingPack"
                            value={editedClientHistory.remainingPack || ""}
                            onChange={handleInputChange}
                            className="form-input w-full"
                            required
                            placeholder="Remaining Pack"
                          />
                        </div>
                        <div className="mb-6">
                          <label htmlFor="clientAttendBy" className="block font-medium text-gray-700">Client Attended By</label>
                          <input
                            type="text"
                            id="clientAttendBy"
                            name="clientAttendBy"
                            value={editedClientHistory.clientAttendBy || ""}
                            onChange={handleInputChange}
                            className="form-input w-full"
                            required
                            placeholder="Client Attended By"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end items-center mt-8">
                        <button type="button" onClick={handleModalClose} className="btn btn-outline-danger">
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary ml-4">
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

export default ClientHistory;
