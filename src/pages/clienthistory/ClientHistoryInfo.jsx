import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import debounce from "lodash.debounce";
import Select from "react-select";
import ClientHistoryService from "../../services/ClientHistory/clientHistoryService";
import AlertService from "../../utils/AlertService";
import IconPlus from "../../components/Icon/IconPlus";
import IconTrashLines from "../../components/Icon/IconTrashLines";
import IconEdit from "../../components/Icon/IconEdit";
import SelectStyles from "../../utils/SelectStyles";
import clientService from "../../services/Client/clientservice"; // Import your clientService

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
    const [isShowTaskMenu, setIsShowTaskMenu] = useState(false);
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
  const [count, setCount] = useState(0);
  const [mobileNumberSuggestions, setMobileNumberSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('Id');
  const [sortDirection, setSortDirection] = useState('desc');
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const selectedColumns = ["id", "customerName", "mobileNumber", "packTaken", "remainingPack", "clientAttendBy",,"sereviceName", "isActive" ];

  const handleMobileSuggestionClick = (suggestion) => {
    setEditedClientHistory({
      ...editedClientHistory,
      mobileNumber: suggestion,
    });
    setMobileNumberSuggestions([]);
  };

    const handleSearch = debounce((e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    }, 500);
  

  useEffect(() => {
debugger;
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await ClientHistoryService.getPaginatedClientHistories({
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

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const response = await clientService.getAllClients(true);
        if (response.data.isSuccess && Array.isArray(response.data.output)) {
          const names = response.data.output.map((customer) => ({
            id: customer.id,
            customerName: customer.customerName,
            mobileNumber: customer.mobileNumber,
          }));
          setCustomerNames(names);
        } else {
          throw new Error("Failed to fetch customer names");
        }
      } catch (err) {
        console.error("Error fetching customer names:", err);
        setCustomerNames([]);
      }
    };

    fetchNames();
  }, []);



  const handleEditClick = (clientHistory) => {
debugger;
    setEditedClientHistory({
      ...clientHistory,
      //date: formatDate(new Date()), // Ensure date is formatted
    });
    // const selectedCustomer = customerNames.find(
    //   (item) => item.id === clientHistory.CustomerId
    // ) || {
    //   id: clientHistory.CustomerId,
    //   customerName: clientHistory.CustomerName,
    //   mobileNumber: clientHistory.MobileNumber,
    // };
    // setEditedClientHistory({
    //   id: clientHistory.Id,
    //   customerId: selectedCustomer.id,
    //   customerName: selectedCustomer.customerName,
    //   mobileNumber: selectedCustomer.mobileNumber,
    //   sereviceName: clientHistory.SereviceName,
    //   packTaken: clientHistory.PackTaken,
    //   remainingPack: clientHistory.RemainingPack,
    //   clientAttendBy: clientHistory.ClientAttendBy,
    // });
    setEditModalOpen(true);
  };

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

  const handleInputChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setEditedClientHistory({ ...editedClientHistory, [e.target.name]: value });

    if (e.target.name === "mobileNumber") {
      const inputMobile = e.target.value;
      if (inputMobile.length >= 2) {
        const suggestions = customerNames
          .filter((customer) => customer.mobileNumber.startsWith(inputMobile))
          .map((customer) => customer.mobileNumber);
        setMobileNumberSuggestions(suggestions);
      } else {
        setMobileNumberSuggestions([]);
      }
    }
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    const selectedCustomer = customerNames.find(
      (customer) => customer.id === selectedOption.value
    );
    setEditedClientHistory({
      ...editedClientHistory,
      customerId: selectedOption.value,
      customerName: selectedOption.label,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedClientHistory = {
        ...editedClientHistory,
      };
      await ClientHistoryService.updateClientHistory(updatedClientHistory);
      setClientHistories((prev) =>
        prev.map((client) =>
          client.id === editedClientHistory.id ? updatedClientHistory : client
        )
      );
      setDisplayHistory((prev) =>
        prev.map((client) =>
          client.id === editedClientHistory.id ? updatedClientHistory : client
        )
      );
      AlertService.success("Client history updated successfully!");
      handleModalClose();
      setCount((prev) => prev + 1);
    } catch (err) {
      AlertService.warning("Failed to update client history");
    }
  };

  const handleCreateClientHistory = async (e) => {
    e.preventDefault();
    try {
      const newClientHistory = {
        ...editedClientHistory,
      };
      const response = await ClientHistoryService.createClientHistory(
        newClientHistory
      );
      const createdClientHistory = response.data.output;
      setClientHistories((prev) => [createdClientHistory, ...prev]);
      setDisplayHistory((prev) => [createdClientHistory, ...prev]);
      setTotalRows((prev) => prev + 1);
      AlertService.success("Client history added successfully!");
      handleModalClose();
      setCount((prev) => prev + 1);
    } catch (err) {
      AlertService.warning("Failed to add client history");
    }
  };

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



  return (
    <div className="flex gap-5 relative sm:h-[calc(100vh_-_150px)] h-full">
 <div
        className={`overlay bg-black/60 w-full h-full rounded-md absolute hidden ${
          isShowTaskMenu && "!block xl:!hidden"
        }`}
        onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}
      ></div>
      <div className="bg-white dark:bg-[#121c2c] rounded-lg shadow w-full flex-grow">
        <div className="flex flex-wrap items-center justify-between p-4">
          <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">Client History List</h3>
          <div className="flex items-center space-x-4">
            <div>
              <button
                className="btn btn-primary w-full"
                type="button"
                onClick={() => setAddTaskModal(true)}
              >
                <IconPlus className="ltr:mr-2 rtl:ml-2 shrink-0" />
                Add New Client History
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

        <div className="flex flex-wrap items-center justify-between p-4">
          {/* Rows Per Page dropdown aligned to the left */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">Rows Per Page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-gray-500 cursor-pointer"
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Pagination controls aligned to the right */}
          <div className="flex items-center space-x-4">
            <span>
              {(currentPage - 1) * rowsPerPage + 1}-
              {Math.min(currentPage * rowsPerPage, totalRows)} of {totalRows}
            </span>

            <button
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1}
              className={`p-2 rounded ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700"
              }`}
            >
              <FaChevronLeft />
            </button>

            <button
              onClick={() => handlePageChange("next")}
              disabled={currentPage * rowsPerPage >= totalRows}
              className={`p-2 rounded ${
                currentPage * rowsPerPage >= totalRows
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700"
              }`}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit Client History */}
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
                  <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                    {editModalOpen
                      ? "Edit Client History"
                      : "Add Client History"}
                  </div>
                  <div className="p-5">
                    <form
                      onSubmit={
                        editModalOpen ? handleUpdate : handleCreateClientHistory
                      }
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="mb-6">
                          <label
                            htmlFor="customerName"
                            className="block font-medium text-gray-700"
                          >
                            Customer Name
                          </label>
                          <Select
                            id="customerName"
                            name="customerName"
                            styles={SelectStyles}
                            value={{
                              label: editedClientHistory.customerName,
                              value: editedClientHistory.customerId,
                            }}
                            onChange={handleSelectChange}
                            options={customerNames.map((customer) => ({
                              value: customer.id,
                              label: customer.customerName,
                            }))}
                            className="basic-single w-full"
                            classNamePrefix="select"
                            isClearable
                            isSearchable
                            required
                            menuPosition="fixed"
                          />
                        </div>
                        <div className="mb-6 relative">
                          <label
                            htmlFor="mobileNumber"
                            className="block font-medium text-gray-700"
                          >
                            Mobile Number
                          </label>
                          <input
                            type="text"
                            id="mobileNumber"
                            name="mobileNumber"
                            styles={SelectStyles}
                            value={editedClientHistory.mobileNumber || ""}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                              if (value.length <= 10) {
                                handleInputChange({
                                  target: { name: "mobileNumber", value },
                                });
                              }
                            }}
                            className="form-input w-full"
                            required
                            placeholder="Search..."
                          />
                          {mobileNumberSuggestions.length > 0 && (
                            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                              {mobileNumberSuggestions.map(
                                (suggestion, index) => (
                                  <li
                                    key={index}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() =>
                                      handleMobileSuggestionClick(suggestion)
                                    }
                                  >
                                    {suggestion}
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="mb-6">
                          <label
                            htmlFor="sereviceName"
                            className="block font-medium text-gray-700"
                          >
                            Service Name
                          </label>
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
                          <label
                            htmlFor="packTaken"
                            className="block font-medium text-gray-700"
                          >
                            Pack Taken
                          </label>
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
                          <label
                            htmlFor="remainingPack"
                            className="block font-medium text-gray-700"
                          >
                            Remaining Pack
                          </label>
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
                          <label
                            htmlFor="clientAttendBy"
                            className="block font-medium text-gray-700"
                          >
                            Client Attended By
                          </label>
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
                        <button
                          type="button"
                          onClick={handleModalClose}
                          className="btn btn-outline-danger"
                        >
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
