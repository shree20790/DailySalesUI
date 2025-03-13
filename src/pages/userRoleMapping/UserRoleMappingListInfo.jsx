import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import "react-perfect-scrollbar/dist/css/styles.css";
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconEdit from '../../components/Icon/IconEdit';
import IconPlus from '../../components/Icon/IconPlus';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import debounce from 'lodash.debounce';
import userRoleMappingService from '../../services/UserRoleMapping/userRoleMappingService';
import AlertService from '../../utils/AlertService';
import Select from "react-select";
import userService from "../../services/User/userService";
import SelectStyles from "../../utils/SelectStyles";
import userRoleService from "../../services/UserRole/userRoleService";

const UserRoleMappingListinfo = ({ apiUrl }) => {

    const [isShowTaskMenu, setIsShowTaskMenu] = useState(false);
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [addTaskModal, setAddTaskModal] = useState(false);
    const [newUserRoleMapping, setNewUserRoleMapping] = useState({
        userId: "",
        roleId: "",
        isActive: true,
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

    const selectedColumns = ["id", "userId", "roleId", "isActive"];

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await userRoleMappingService.getPaginatedUserRoleMappings({
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

    const handleCreateUserRoleMapping = async () => {
      try {
        const response = await userRoleMappingService.addUserRoleMapping(newUserRoleMapping);

        if (response.data?.isSuccess) {
          AlertService.success("User Role Mapping created successfully!");

          handleModalClose();
          setRefresh((prev) => !prev);
        } else {
          AlertService.warning(response.data.failureReason); // Show only failure reason when isSuccess is false
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.failureReason) {
          AlertService.warning(error.response.data.failureReason); // Show API error reason if available
        }
      }
    };

    const fetchData = async () => {
      try {
        const response = await userRoleMappingService.getAllUserRoleMappings();
        setData(response.data);
      } catch (error) {
        console.error("Error fetching usersRole Mapping:", error);
      }
    };

    const userOptions = users.map((user) => ({
      value: user.id,
      label: `${user.firstName || ''} ${user.middleName || ''} ${user.lastName || ''}`.trim() || `User ${user.id}`,
    }));

    const roleOptions = roles.map((role) => ({
      value: role.id,
      label: role.roleName || `Role ${role.id}`,
    }));

    useEffect(() => {
      const fetchUsersAndRoles = async () => {
        try {
          // Fetch Users
          const userResponse = await userService.getAllUsers();
          if (userResponse.data?.isSuccess) {
            setUsers(userResponse.data.output || []);
          }

          // Fetch Roles
          const roleResponse = await userRoleService.getAllUserRoles();
          if (roleResponse.data?.isSuccess) {
            setRoles(roleResponse.data.output || []);
          }
        } catch (error) {
          console.error("Error fetching users or roles:", error);
        }
      };

      fetchUsersAndRoles();
    }, []);

    const handleUserChange = (selectedOption) => {
      setNewUserRoleMapping((prev) => ({ ...prev, userId: selectedOption.value }));
    };

    const handleRoleChange = (selectedOption) => {
      setNewUserRoleMapping((prev) => ({ ...prev, roleId: selectedOption.value }));
    };

    const handleUpdateUserRoleMapping = async () => {
      try {
        const response = await userRoleMappingService.updateUserRoleMapping(newUserRoleMapping);

        if (response.status === 200) {
          AlertService.success("User Role Mapping updated successfully");

          setAddTaskModal(false);
          handleModalClose();
          setRefresh((prev) => !prev);
        } else {
          console.error("Update failed:", response);
        }
      } catch (error) {
        console.error("Error updating userRoleMapping:", error);
      }
    };

    const handleDeleteClick = async (id) => {
      const confirmDelete = await AlertService.confirm({
        message: "Are you sure you want to delete this userRole Mapping?"
      });

      if (!confirmDelete.isConfirmed) return;

      try {
        const response = await userRoleMappingService.deleteUserRoleMapping(id);
        if (response.status === 200 || response.data.isSuccess) {
          AlertService.success("User Role Mapping deleted successfully!");

          setRefresh((prev) => !prev);
        } else {
          console.error("Failed to delete userRoleMapping:", response);
          AlertService.warning("Failed to delete userRoleMapping. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting userRoleMapping:", error);
        AlertService.warning("An error occurred while deleting the userRoleMapping.");
      }
    };

    const handleEditClick = (userRoleMapping) => {
      setNewUserRoleMapping(userRoleMapping);
      setAddTaskModal(true);
    };

    // Reset the modal state after closing
    const handleModalClose = () => {
      setNewUserRoleMapping({
        userId: "",
        roleId: "",
        isActive: true,
      });
      setAddTaskModal(false);
    };

    const handleSubmit = async (event) => {
      event.preventDefault(); // Prevent default form submission

      if (newUserRoleMapping.id) {
        // Update existing userRoleMapping
        await handleUpdateUserRoleMapping();
      } else {
        // Create a new userRole
        await handleCreateUserRoleMapping();
      }
    };

    return (
      <div className="flex gap-5 relative sm:h-[calc(100vh_-_150px)] h-full">
        <div className={`overlay bg-black/60 w-full h-full rounded-md absolute hidden ${isShowTaskMenu && '!block xl:!hidden'}`} onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}></div>
        <div className="bg-white dark:bg-[#121c2c] rounded-lg shadow w-full flex-grow">
          <div className="flex flex-wrap items-center justify-between p-4">
            <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">User Role Mapping List</h3>
            <div className="flex items-center space-x-4">
              <div>
                <button className="btn btn-primary w-full" type="button" onClick={() => setAddTaskModal(true)}>
                  <IconPlus className="ltr:mr-2 rtl:ml-2 shrink-0" />
                  Add New User Role Mapping
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
                      {col === "userId" ? "userName" : col === "roleId" ? "roleName" : col}
                    </th>
                  ))}
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={selectedColumns.length + 1} className="text-center p-4">
                      Loading...
                    </td>
                  </tr>
                ) : data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a202c] text-gray-900 dark:text-white">
                      <td className="p-2 text-center">{item.id}</td>
                      <td className="p-2 text-center">
                        {users
                          .filter((user) => user.id === item.userId)
                          .map((user) =>
                            `${user.firstName?.trim() || ""} ${user.middleName?.trim() || ""} ${user.lastName?.trim() || ""}`
                              .replace(/\s+/g, " ") // Remove extra spaces
                              .trim()
                          )}
                      </td>
                      <td className="p-2 text-center">
                        {roles.find((role) => role.id === item.roleId)?.roleName || "N/A"}
                      </td>
                      <td className="p-2 text-center">{item.isActive ? "true" : "false"}</td>
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
                    <td colSpan={selectedColumns.length + 1} className="text-center p-4">
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
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Pagination controls aligned to the right */}
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
                  <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-visible w-full max-w-lg max-h-[90vh] text-black dark:text-white-dark">
                    <button
                      type="button"
                      onClick={handleModalClose}
                      className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                    >
                      ✖
                    </button>
                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                      {newUserRoleMapping.id ? 'Update User Role Mapping' : 'Add New User Role Mapping'}
                    </div>
                    <div className="p-5">
                      <form onSubmit={handleSubmit}>
                        <div className="flex space-x-4 mb-5">
                          <div className="flex-1">
                            <label htmlFor="userId" className="block">User Name</label>
                            <Select
                              id="userId"
                              name="userId"
                              value={userOptions.find((option) => option.value === newUserRoleMapping.userId)}
                              onChange={handleUserChange}
                              options={userOptions}
                              styles={SelectStyles}
                              className="text-sm font-semibold"
                              placeholder="Select a User"
                              isSearchable
                            />
                          </div>

                          {/* Role Dropdown */}
                          <div className="flex-1">
                            <label htmlFor="roleId" className="block">Role</label>
                            <Select
                              id="roleId"
                              name="roleId"
                              value={roleOptions.find((option) => option.value === newUserRoleMapping.roleId)}
                              onChange={handleRoleChange}
                              styles={SelectStyles}
                              options={roleOptions}
                              className="text-sm font-semibold"
                              placeholder="Select a Role"
                              isSearchable
                            />
                          </div>
                        </div>

                        {newUserRoleMapping.id && (
                          <div className="mb-5">
                            <label htmlFor="isActive" className="block">Status</label>
                            <label className="inline-flex">
                              <input
                                type="radio"
                                name="default_radio"
                                className="form-radio"
                                checked={newUserRoleMapping.isActive === true}
                                onChange={() => setNewUserRoleMapping({ ...newUserRoleMapping, isActive: true })}
                              />
                              <span>Active</span>
                            </label>
                            <label className="inline-flex ml-4">
                              <input
                                type="radio"
                                name="default_radio"
                                className="form-radio"
                                checked={newUserRoleMapping.isActive === false}
                                onChange={() => setNewUserRoleMapping({ ...newUserRoleMapping, isActive: false })}
                              />
                              <span>Inactive</span>
                            </label>
                          </div>
                        )}

              {/* Action Buttons */}
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
                  {newUserRoleMapping.id ? 'Update' : 'Add'}
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

export default UserRoleMappingListinfo;