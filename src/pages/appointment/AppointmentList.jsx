import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import debounce from "lodash.debounce";
import Select from 'react-select';
import staffService from "../../services/Staff/AppointmentService";
import AlertService from "../../utils/AlertService";
import IconPlus from "../../components/Icon/IconPlus";
import IconTrashLines from "../../components/Icon/IconTrashLines";
import IconEdit from "../../components/Icon/IconEdit";
import SelectStyles from "../../utils/SelectStyles";
import ClientList from "../client/ClientList";
import clientService from "../../services/Client/clientservice";

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
    return `${year}-${month}-${day}`;
};

const StaffList = () => {
    // State variables
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [sortField, setSortField] = useState('Id');
    const [sortDirection, setSortDirection] = useState('desc');
    const [staffs, setStaffs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [addTaskModal, setAddTaskModal] = useState(false);
    const [isShowTaskMenu, setIsShowTaskMenu] = useState(false);
    const paymentOptions = [
        { value: 'GPay', label: 'GPay' },
        { value: 'Card', label: 'Card' },
        { value: 'Cash', label: 'Cash' }
    ];
    const [editedStaff, setEditedStaff] = useState({

        customerId: 0,
        staffName: "",
        mobileNumber: "",
        todaysDate: formatDate(new Date()), // Set current date in dd/mm/yyyy format
        inTime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), // Set current time
        outTime: "",
        staffType: "",
        amount: 0,
        sttafTipAmount: 0,
        amountPayType: "",
        comment: "",
        isActive: true,
        createdBy: 0
    });
    const [refresh, setRefresh] = useState(false);
    const [staffNames, setStaffNames] = useState([]);
    const [suggestedMobileNumbers, setSuggestedMobileNumbers] = useState([]);


        
    const handleSearch = debounce((e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
      }, 500);
    
      const handlePageChange = (direction) => {
        if (direction === 'prev' && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        } else if (direction === 'next' && currentPage * rowsPerPage < totalRows) {
          setCurrentPage((prev) => prev + 1);
        }
      };
  
      const selectedColumns = ["id", "customerName", "customerMobileNumber", "todaysDate", "staffName", "mobileNumber", "inTime", "outTime", "isActive" ];
    // Fetch staff data
    useEffect(() => { 

        const fetchData = async () => {
          setLoading(true);
          try {
            const response = await staffService.getPaginatedStaffs({
              page: currentPage,
              pageSize: rowsPerPage,
              searchTerm,
              sortDirection,
              sortField,
            });
      
            if (response.data.isSuccess) {
      
              setData(response.data.output.result || []); // Ensure it's an array
              setTotalRows(response.data.output.rowCount || 0);
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
          setLoading(false);
        };
      
        fetchData();
      }, [currentPage, rowsPerPage, searchTerm, sortField, sortDirection, refresh]);

    // Fetch staff names for searchable select
    useEffect(() => {
        const fetchStaffNames = async () => {
  
            try {
                const response = await clientService.getAllClients();
                const data = await response.data;
                if (data.isSuccess == true) {
                    setStaffNames(data.output.map(staff => ({
                        id: staff.id,
                        customerName: staff.customerName,
                        mobileNumber: staff.mobileNumber
                    })));
                } else {
                    throw new Error("Failed to fetch staff names");
                }
            } catch (err) {
                console.error("Error fetching staff names:", err);
            }
        };

        fetchStaffNames();
    }, []);


    // Handle delete staff
    const handleDelete = async (id) => {
        const confirmDelete = await AlertService.confirm({
            message: "Are you sure you want to delete this Appointment?",
        });

        if (!confirmDelete.isConfirmed) return;
        try {
            await staffService.deleteStaff(id);
            AlertService.success("Staff deleted successfully!");
            setStaffs((prevStaffs) => prevStaffs.filter((staff) => staff.id !== id));
            setTotalRows((prevTotalRows) => prevTotalRows - 1);
            setRefresh((prev) => !prev);
        } catch (err) {
            AlertService.warning("Failed to delete staff");
        }
    };

    // Handle edit staff
    const handleEditClick = (staff) => {

        console.log(staff)
        // const selectedStaffName = staffNames.find(item => item.id === staff.id) || { id: staff.id, customerName: staff.customerName, mobileNumber: staff.mobileNumber };
        setEditedStaff({
            ...staff,
            todaysDate: formatDate(new Date()), // Ensure date is formatted
          });
       
        setAddTaskModal(true);
        setEditModalOpen(true);
    };

    const handleModalClose = () => {
        setEditModalOpen(false);
        setAddTaskModal(false);
        setEditedStaff({
            customerId: 0,
            staffName: "",
            mobileNumber: "",
            todaysDate: formatDate(new Date()), // Reset to current date
            inTime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), // Reset to current time
            outTime: "",
            staffType: "",
            amount: 0,
            sttafTipAmount: 0,
            amountPayType: "",
            comment: "",
            isActive: true,
            createdBy: 0
        });
    };

    const handleInputChange = (e) => {

       const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setEditedStaff({ ...editedStaff, [e.target.name]: value });
    
        if (e.target.name === "mobileNumber") {
            const inputValue = e.target.value;
            if (inputValue.length >= 2) {
                const suggestions = staffNames
                    .filter(staff => staff.mobileNumber.startsWith(inputValue))
                    .map(staff => staff.mobileNumber);
                setSuggestedMobileNumbers(suggestions);
            } else {
                setSuggestedMobileNumbers([]);
            }
        }
    };

    // Handle select change
    const handleSelectChange = (selectedOption, actionMeta) => {

        const selectedStaff = staffNames.find(staff => staff.id === selectedOption.value);
        setEditedStaff({ 
            ...editedStaff, 
            customerId: selectedOption.value,
            staffName: selectedOption,

        });
    };

    // Handle update staff
    const handleUpdate = async (e) => {
        e.preventDefault();

        // Perform basic validation
        if (
            !editedStaff.staffName ||
            !editedStaff.mobileNumber ||
            !editedStaff.todaysDate ||
            !editedStaff.inTime ||
            !editedStaff.outTime ||
          //  !editedStaff.staffType ||
            !editedStaff.amount ||
            !editedStaff.sttafTipAmount ||
            !editedStaff.amountPayType
        ) {
            AlertService.warning("Please fill in all required fields.");
            return;
        }

        try {
            const updatedStaffData = {
                customerId: editedStaff.customerId,
                staffName: editedStaff.staffName,  // Extract the label for display
                mobileNumber: editedStaff.mobileNumber,
                //todaysDate: formatDate(new Date(editedStaff.todaysDate)),
               todaysDate: toISODate(editedStaff.todaysDate),  // Convert to ISO format for backend
                inTime: editedStaff.inTime,
                outTime: editedStaff.outTime,
                staffType: editedStaff.staffType,
                amount: editedStaff.amount,
                sttafTipAmount: editedStaff.sttafTipAmount,
                amountPayType: editedStaff.amountPayType,
                comment: editedStaff.comment,
                isActive: editedStaff.isActive,
                modifiedBy: 0, // Assuming you want to set modifiedBy to 0
            };



            

            const response = await staffService.updateStaff(editedStaff.id, updatedStaffData);
            console.log("Response from updateStaff:", response);
            const status=response.status;
            console.log("status is"+status)
            if (status == 200) {
                setStaffs((prevStaffs) =>
                    prevStaffs.map((staff) =>
                        staff.id === editedStaff.id ? { ...editedStaff, staffName: editedStaff.staffName.label } : staff
                    )
                );

                AlertService.success("Staff updated successfully!");
                handleModalClose();
                setRefresh((prev) => !prev);
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (err) {
            console.log("inside error")
            //console.error("Failed to update staff:", err);
            AlertService.warning("Failed to update staff");
        }
    };

    // Handle create staff
    const handleCreateStaff = async (e) => {

        e.preventDefault();
        try {
            const response = await staffService.createStaff({
                ...editedStaff,
                //staffName: editedStaff.staffName.label, // Send the label to the backend
                todaysDate: toISODate(editedStaff.todaysDate) // Convert to ISO format for backend
            });

            setStaffs((prevStaffs) => [
                { ...response.data.output }, // Update with the label
                ...prevStaffs,
            ]);

            //setTotalRows((prevTotalRows) => prevTotalRows + 1);
            AlertService.success("Staff added successfully!");
            setRefresh((prev) => !prev);
            handleModalClose();
        } catch (err) {
            AlertService.warning("Failed to add staff");
        }
    };

    // Handle pagination


    // Sorting staff by ID
    const sortedStaffs = [...staffs].sort((a, b) => b.id - a.id);

    // Filtered and paginated data
    const filteredStaffs = sortedStaffs.filter((staff) =>
        staff && staff.staffName && staff.staffName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const displayedStaffs = filteredStaffs.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <div className="flex flex-col gap-5 relative sm:h-[calc(100vh_-_150px)] h-full">
                 <div
        className={`overlay bg-black/60 w-full h-full rounded-md absolute hidden ${
          isShowTaskMenu && "!block xl:!hidden"
        }`}
        onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}
      ></div>
      <div className="bg-white dark:bg-[#121c2c] rounded-lg shadow w-full flex-grow">
        <div className="flex flex-wrap items-center justify-between p-4">
          <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">Appointment List</h3>
          <div className="flex items-center space-x-4">
            <div>
              <button
                className="btn btn-primary w-full"
                type="button"
                onClick={() => setAddTaskModal(true)}
              >
                <IconPlus className="ltr:mr-2 rtl:ml-2 shrink-0" />
                Add New Appointment
              </button>
            </div>
            <div className="flex items-center border-gray-300 rounded bg-gray-100 dark:bg-[#1b2e4b] p-2 w-50">
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

        <div className="bg-white dark:bg-[#121c2c] rounded-lg shadow overflow-x-auto p-4 w-full">
          <table className="table-responsive mb-5 w-full border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-200 dark:bg-[#1b2e4b] text-gray-700 dark:text-white">
                {selectedColumns.map((col) => (
                  <th key={col} className="p-2 capitalize text-center">
                    {col}
                  </th>
                ))}
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={selectedColumns.length + 1}
                    className="text-center p-4"
                  >
                    Loading...
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a202c] text-gray-900 dark:text-white"
                  >
                    {selectedColumns.map((col) => (
                      <td key={col} className="p-2 text-center">
                        {col === "role"
                          ? roles.find((role) => role.id === item.role)
                              ?.roleName || "N/A"
                          : item[col] !== undefined && item[col] !== null
                          ? item[col].toString()
                          : "N/A"}
                      </td>
                    ))}
                    <td className="p-2 flex justify-center gap-3 items-center">
                      <button onClick={() => handleEditClick(item)}>
                        <IconEdit className="text-blue-500 cursor-pointer" />
                      </button>
                      <button onClick={() => handleDeleteClick(item.id)}>
                        <IconTrashLines className="text-red-500 cursor-pointer" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={selectedColumns.length + 1}
                    className="text-center p-4"
                  >
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>

            {/* Edit/Add Modal */}
            <Transition appear show={editModalOpen || addTaskModal} as={Fragment}>
                <Dialog
                    as="div"
                    open={editModalOpen || addTaskModal}
                    onClose={handleModalClose}
                    className="relative z-[51]"
                >
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
                                    <button
                                        type="button"
                                        onClick={handleModalClose}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        ✖
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr/[50px] rtl:pl/[50px]">
                                        {editModalOpen ? "Edit Appointment" : "Add Appointment"}
                                    </div>
                                    <div className="p-5">
                                    <form onSubmit={editModalOpen ? handleUpdate : handleCreateStaff}>
                                            <div className="grid grid-cols-3 gap-5 mb-6">
                                                <div>
                                                    <label htmlFor="customerId" className="block font-medium text-gray-700">
                                                        Customer Name
                                                    </label>
                                                    <Select
                                                      id="customerId"
                                                      name="customerId"
                                                      styles={SelectStyles}
                                                     // value={editedStaff.id}
                                                     value={{ label: editedStaff.customerName, value: editedStaff.customerId }}
                                                      onChange={handleSelectChange}
                                                      options={staffNames.map(staff => ({ value: staff.id, label: staff.customerName }))}
                                                      className="basic-single w-full"
                                                      classNamePrefix="select"
                                                      isClearable
                                                      isSearchable
                                                      required
                                                      menuPosition="fixed"
                                                     placeholder="Select"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="mobileNumber" className="block font-medium text-gray-700">
                                                        Mobile Number
                                                    </label>
                                                   <input
                                                     type="text"
                                                     id="mobileNumber"
                                                     name="mobileNumber"
                                                     styles={SelectStyles}
                                                     value={editedStaff.mobileNumber || ""}
                                                      onChange={(e) => {
                                                            const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                                                            if (value.length <= 10) {
                                                                handleInputChange({ target: { name: "mobileNumber", value } });
                                                            }
                                                        }}
                                                     className="form-input w-full"
                                                     required
                                                     placeholder="Search..."
                                                     maxLength="10"
                                                    />
                                                    {suggestedMobileNumbers.length > 0 && (
                                                      <ul className="mt-1 border border-gray-300 rounded bg-white">
                                                     {suggestedMobileNumbers.map((number, index) => (
                                                     <li
                                                      key={index}
                                                       className="p-2 hover:bg-gray-100 cursor-pointer"
                                                     onClick={() => {
                                                     setEditedStaff({ ...editedStaff, mobileNumber: number });
                                                     setSuggestedMobileNumbers([]);
                                                      }}
                                                     >
                                                     {number}
                                                    </li>
                                                    ))}
                                                    </ul>
                                                    )}
                                                </div>
                                                <div>
                                                    <label htmlFor="todaysDate" className="block font-medium text-gray-700">
                                                      Date
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="todaysDate"
                                                        name="todaysDate"
                                                        value={editedStaff.todaysDate || ""}
                                                        onChange={handleInputChange}
                                                        className="form-input w-full"
                                                        required
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-5 mb-6">
                                            <div>
                                               <label htmlFor="inTime" className="block font-medium text-gray-700">
                                                  In Time
                                                </label>
                                               <input
                                                 type="time"
                                                 id="inTime"
                                                 name="inTime"
                                                 value={editedStaff.inTime || ""}
                                                 onChange={handleInputChange}
                                                  className="form-input w-full"
                                                 required
                                                 disabled // Disable the input field
                                                />
                                            </div>
                                                <div>
                                                    <label htmlFor="outTime" className="block font-medium text-gray-700">
                                                        Out Time
                                                    </label>
                                                    <input
                                                        type="time"
                                                        id="outTime"
                                                        name="outTime"
                                                        value={editedStaff.outTime || ""}
                                                        onChange={handleInputChange}
                                                        className="form-input w-full"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="staffName" className="block font-medium text-gray-700">
                                                        Staff Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="staffName"
                                                        name="staffName"
                                                        value={editedStaff.staffName || ""}
                                                        onChange={handleInputChange}
                                                        className="form-input w-full"
                                                        required
                                                        placeholder="Staff Name"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-5 mb-6">
                                                <div>
                                                    <label htmlFor="amount" className="block font-medium text-gray-700">
                                                        Amount
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id="amount"
                                                        name="amount"
                                                        value={editedStaff.amount || ""}
                                                        onChange={handleInputChange}
                                                        className="form-input w-full"
                                                        required
                                                        placeholder="Amount"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="sttafTipAmount" className="block font-medium text-gray-700">
                                                        Tip Amount
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id="sttafTipAmount"
                                                        name="sttafTipAmount"
                                                        value={editedStaff.sttafTipAmount || ""}
                                                        onChange={handleInputChange}
                                                        className="form-input w-full"
                                                        required
                                                        placeholder="Tip Amount"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="amountPayType" className="block font-medium text-gray-700">
                                                       Pay Type
                                                    </label>
                                                  <Select
                                                      id="amountPayType"
                                                     name="amountPayType"
                                                     styles={SelectStyles}
                                                     value={paymentOptions.find(option => option.value === editedStaff.amountPayType)}
                                                     onChange={(selectedOption) => setEditedStaff({ ...editedStaff, amountPayType: selectedOption.value })}
                                                     options={paymentOptions}
                                                     className="basic-single w-full"
                                                     classNamePrefix="select"
                                                      isClearable
                                                     isSearchable
                                                     required
                                                     menuPosition="fixed"
                                                     placeholder="Select"
                                                   />
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <label htmlFor="comment" className="block font-medium text-gray-700">
                                                    Comment
                                                </label>
                                                <textarea
                                                    id="comment"
                                                    name="comment"
                                                    value={editedStaff.comment || ""}
                                                    onChange={handleInputChange}
                                                    className="form-input w-full"
                                                    placeholder="Comment"
                                                />
                                            </div>

                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={handleModalClose}
                                                    className="btn btn-outline-danger ltr:mr-2 rtl:ml-2"
                                                >
                                                    Cancel
                                                </button>
                                                <button type="submit" className="btn btn-primary">
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

export default StaffList;