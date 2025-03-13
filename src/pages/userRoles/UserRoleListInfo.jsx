import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import "react-perfect-scrollbar/dist/css/styles.css";
import IconTrashLines from '../../components/Icon/IconTrashLines'
import IconEdit from '../../components/Icon/IconEdit';
import IconPlus from '../../components/Icon/IconPlus'
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import debounce from 'lodash.debounce';
import userRoleService from '../../services/UserRole/userRoleService'
import AlertService from '../../utils/AlertService';

const UserRoleListinfo = ({ apiUrl }) => {

    const [isShowTaskMenu, setIsShowTaskMenu] = useState(false);

    const [addTaskModal, setAddTaskModal] = useState(false);
    const [newUserRole, setNewUserRole] = useState({
        "roleName": "",
        "description": "",
        "isActive": true,
    });

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [sortField, setSortField] = useState('Id');
    const [sortDirection, setSortDirection] = useState('desc');
    const [refresh, setRefresh] = useState(false);
    
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

    const selectedColumns = ["id", "roleName", "description", "isActive", "createdBy" ];
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await userRoleService .getPaginatedUserRoles({
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
    
    useEffect(() => {
      fetchData();
    }, [currentPage, rowsPerPage, searchTerm, sortField, sortDirection, refresh]);

    const handleCreateUserRole = async () => {
      try {
        const response = await userRoleService.createUserRole(newUserRole);
        if (response.data?.isSuccess) {
          AlertService.success("User Role created successfully!");
          handleModalClose();
          setRefresh((prev) => !prev);
        } else {
          console.error("Failed to create userRole. API Response:", response.data);
          AlertService.warning(`Failed to create userRole: ${response.data?.message || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error creating userRole:", error);
        AlertService.warning(`Error creating userRole: ${error.response?.data?.message || error.message}`);
      }
    };

    const handleUpdateUserRole = async () => {
      try {
        const response = await userRoleService.updateUserRole(newUserRole.id, newUserRole);
        if (response.status === 200) {
          AlertService.success("User Role updated successfully");
          setAddTaskModal(false);
          handleModalClose();
          setRefresh((prev) => !prev);
        } else {
          console.error("Update failed:", response);
        }
      } catch (error) {
        console.error("Error updating userRole:", error);
      }
    };

    const handleDeleteClick = async (id) => {
      const confirmDelete = await AlertService.confirm({
        message: "Are you sure you want to delete this userRole?"
      });
    
      if (!confirmDelete.isConfirmed) return;
    
      try {
        const response = await userRoleService.deleteUserRole(id);
        if (response.status === 200 || response.data.isSuccess) {
          AlertService.success("User Role deleted successfully!");
          setRefresh((prev) => !prev);
        } else {
          console.error("Failed to delete userRole:", response);
          AlertService.warning("Failed to delete userRole. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting userRole:", error);
        AlertService.warning("An error occurred while deleting the userRole.");
      }
    };

    const handleEditClick = (userRole) => {
      setNewUserRole(userRole);
      setAddTaskModal(true);
    };

    const handleModalClose = () => {
      setNewUserRole({
        roleName: "",
        description: "",
      });
      setAddTaskModal(false);
    };

    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      setNewUserRole((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };

    const handleSubmit = async (event) => {
      event.preventDefault(); // Prevent default form submission
      if (newUserRole.id) {
          await handleUpdateUserRole();
      } else {
          await handleCreateUserRole();
      }
    };

    return (
        <div className="flex gap-5 relative sm:h-[calc(100vh_-_150px)] h-full">
            <div className={`overlay bg-black/60 w-full h-full rounded-md absolute hidden ${isShowTaskMenu && '!block xl:!hidden'}`} onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}></div>
            <div className="bg-white dark:bg-[#121c2c] rounded-lg shadow w-full flex-grow">
                <div className="flex flex-wrap items-center justify-between p-4">
                    <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">User Role List</h3>
                    <div className="flex items-center space-x-4">
                        <div>
                            <button className="btn btn-primary w-full" type="button" onClick={() => setAddTaskModal(true)}>
                                <IconPlus className="ltr:mr-2 rtl:ml-2 shrink-0" />
                                Add New User Role
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
                                    <td colSpan={selectedColumns.length + 1} className="text-center p-4">Loading...</td>
                                </tr>
                            ) : data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a202c] text-gray-900 dark:text-white">
                                        {selectedColumns.map((col) => (
                                            <td key={col} className="p-2 text-center">
                                                {item[col] !== undefined && item[col] !== null ? item[col].toString() : "N/A"}
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
                                    <td colSpan={selectedColumns.length + 1} className="text-center p-4">No Data Available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700 font-medium">Rows Per Page</span>
                        <select
                            value={rowsPerPage}
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
                        <button
                            onClick={() => handlePageChange('prev')}
                            disabled={currentPage === 1}
                            className={`p-2 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}`}
                        >
                            <FaChevronLeft />
                        </button>
                        <button
                            onClick={() => handlePageChange('next')}
                            disabled={currentPage * rowsPerPage >= totalRows}
                            className={`p-2 rounded ${currentPage * rowsPerPage >= totalRows ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}`}
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </div>
            </div>
            <Transition appear show={addTaskModal} as={Fragment}>
                <Dialog as="div" open={addTaskModal} onClose={handleModalClose} className="relative z-[51]">
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
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={handleModalClose}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        ✖
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        {newUserRole.id ? 'Update User Role' : 'Add New User Role'}
                                    </div>
                                    <div className="p-5">
                                        <form onSubmit={handleSubmit}>
                                            <div className="flex space-x-4 mb-5">
                                                <div className="flex-1">
                                                    <label htmlFor="roleName" className="block">Role Name</label>
                                                    <input
                                                        id="roleName"
                                                        type="text"
                                                        name="roleName"
                                                        placeholder="Role Name"
                                                        value={newUserRole.roleName || ""}
                                                        onChange={handleInputChange}
                                                        className="form-input w-full"
                                                        required
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label htmlFor="description" className="block">Description</label>
                                                    <input
                                                        id="description"
                                                        type="text"
                                                        name="description"
                                                        placeholder="Description"
                                                        value={newUserRole.description || ""}
                                                        onChange={handleInputChange}
                                                        className="form-input w-full"
                                                    />
                                                </div>
                                            </div>
                                            {newUserRole.id && (
                                                <div className="mb-5">
                                                    <label htmlFor="isActive" className="block">Status</label>
                                                    <label className="inline-flex">
                                                        <input 
                                                            type="radio" 
                                                            name="default_radio" 
                                                            className="form-radio" 
                                                            checked={newUserRole.isActive === true} 
                                                            onChange={() => setNewUserRole({ ...newUserRole, isActive: true })}
                                                        />
                                                        <span>Active</span>
                                                    </label>
                                                    <label className="inline-flex ml-4">
                                                        <input 
                                                            type="radio" 
                                                            name="default_radio" 
                                                            className="form-radio" 
                                                            checked={newUserRole.isActive === false} 
                                                            onChange={() => setNewUserRole({ ...newUserRole, isActive: false })}
                                                        />
                                                        <span>Inactive</span>
                                                    </label>
                                                </div>
                                            )}
                                            <div className="flex justify-end items-center mt-8">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger"
                                                    onClick={handleModalClose}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary ml-4"
                                                >
                                                    {newUserRole.id ? 'Update' : 'Add'}
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

export default UserRoleListinfo;