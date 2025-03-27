import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import "react-perfect-scrollbar/dist/css/styles.css";
import IconTrashLines from '../../components/Icon/IconTrashLines'
import IconPlus from '../../components/Icon/IconPlus'
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import debounce from 'lodash.debounce';
import Select from "react-select";
import SelectStyles from "../../utils/SelectStyles"
import apiService from '../../services/appClient';
import userService from "../../services/User/userService";
import AlertService from '../../utils/AlertService';
import IconEdit from "../../components/Icon/IconEdit";
import userRoleService from "../../services/UserRole/userRoleService"; 

const UserListinfo = ({ apiUrl  }) => {
    const [isShowTaskMenu, setIsShowTaskMenu] = useState(false);
    const [roles, setRoles] = useState([]);
    const [addTaskModal, setAddTaskModal] = useState(false);
    const [newUser, setNewUser] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobileNo: "",
        role:"",
        dateOfBirth: "",
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

    const selectedColumns = ["id", "firstName", "middleName", "lastName", "email", "mobileNo", "dateOfBirth", "role", "isActive" ];
    
    
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {

          
          const response = await apiService.post(`${config.BaseUrl}/User/getPaginatedUsers`, {
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

    const roleOptions = roles.map((role) => ({
      value: role.id,
      label: role.roleName || `Role ${role.id}`,
    }));

    const handleRoleChange = (selectedOption) => {
      setNewUser((prev) => ({ ...prev, role: selectedOption.value }));
    };
    
    useEffect(() => {
      const fetchRoles = async () => {
        try {
          const roleResponse = await userRoleService.getAllUserRoles();
          if (roleResponse.data?.isSuccess) {
            setRoles(roleResponse.data.output || []);
          }
        } catch (error) {
          console.error("Error fetching users or roles:", error);
        }
      };
    
      fetchRoles();
    }, []);


    const handleCreateUser = async () => {
      try {
        const response = await userService.createUser(newUser);
    
        if (response.data?.isSuccess) {
          AlertService.success("User created successfully!");
          handleModalClose();
          setRefresh((prev) => !prev);
          fetchData();
        }
      } catch (error) {
        console.error("Error creating user:", error);
    
        let errorMessage = "An unexpected error occurred. Please try again.";
    
        if (error.response) {
        
          errorMessage = typeof error.response.data === "string" ? error.response.data : errorMessage;
        }
    
        AlertService.warning(errorMessage); 
      }
    };
    
    
        
    const fetchData = async () => {
      try {
        const response = await userService.getAllUsers();
        setNewUser(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };


    const handleUpdateUser = async () => {
      try {
    
        const response = await userService.updateUser(newUser.id, newUser);
    
        if (response.status === 200) {
    
          AlertService.success("User updated successfully");
          
          setAddTaskModal(false);
          handleModalClose();
          setRefresh((prev) => !prev);
    
        } else {
          console.error("Update failed:", response);
        }
      } catch (error) {
        console.error("Error updating user:", error);
      }
    };
    

    const handleDeleteClick = async (id) => {
      const confirmDelete = await AlertService.confirm({
          message: "Are you sure you want to delete this user?"
      });
    
      if (!confirmDelete.isConfirmed) return;
    
      try {
          const response = await userService.deleteUser(id);
          if (response.status === 200 || response.data.isSuccess) {
              AlertService.success("User deleted successfully!");
              setRefresh((prev) => !prev);
              fetchData();
          } else {
              console.error("Failed to delete user:", response);
              AlertService.warning("Failed to delete user. Please try again.");
          }
      } catch (error) {
          console.error("Error deleting user:", error);
          AlertService.warning("An error occurred while deleting the user.");
      }
    };

 

    const handleEditClick = (user) => {
      setNewUser(user);
      setAddTaskModal(true);
    };


    // Reset the modal state after closing
    const handleModalClose = () => {
      setNewUser({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        mobileNo: "",
        dateOfBirth: ""
      });
      setAddTaskModal(false);
    };

    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      setNewUser((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };
    
    

    const handleSubmit = async (event) => {
      event.preventDefault(); // Prevent default form submission
  
      if (!newUser.id && newUser.password !== newUser.confirmPassword) {
          AlertService.warning("Passwords do not match!");
          return;
      }
  
      // Prepare user data for API call (exclude confirmPassword)
      const userData = {
          firstName: newUser.firstName,
          middleName: newUser.middleName,
          lastName: newUser.lastName,
          email: newUser.email,
          mobileNo: newUser.mobileNo,
          dateOfBirth: newUser.dateOfBirth,
          role: newUser.role,
          isActive: newUser.isActive,
          ...(newUser.password && { password: newUser.password }) // Only send password if present
      };
  
      if (newUser.id) {
          // Update existing user
          await handleUpdateUser(userData);
      } else {
          // Create a new user
          await handleCreateUser(userData);
      }
  };
  
  
    

    return (
        <div className="flex gap-5 relative sm:h-[calc(100vh_-_150px)] h-full">

            <div className={`overlay bg-black/60 w-full h-full rounded-md absolute hidden ${isShowTaskMenu && '!block xl:!hidden'}`} onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}></div>
              <div className="bg-white dark:bg-[#121c2c] rounded-lg shadow w-full flex-grow">
                <div className="flex flex-wrap items-center justify-between p-4">
                    <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">User List</h3>
             <div className="flex items-center space-x-4">
                <div>
                <button className="btn btn-primary w-full" type="button" onClick={() => setAddTaskModal(true)}>
                            <IconPlus className="ltr:mr-2 rtl:ml-2 shrink-0" />
                            Add New User
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
                     { col }
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
                          {col === "role"
                            ? roles.find((role) => role.id === item.role)?.roleName || "N/A"
                            : item[col] !== undefined && item[col] !== null
                            ? item[col].toString()
                            : "N/A"}
                        </td>
                      ))}
                      <td className="p-2 flex justify-center gap-3 items-center">
                        <button
                        onClick={() => handleEditClick(item)}>
                        <IconEdit className="text-blue-500 cursor-pointer"/>
                        </button>
                        <button
                        onClick={() => handleDeleteClick(item.id)}>
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
          <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
            <button
              type="button"
              onClick={handleModalClose}
              className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
            >
              ✖
            </button>
            <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
              {newUser.id ? 'Update User' : 'Add New User'}
            </div>
            <div className="p-5">
              <form onSubmit={handleSubmit}>
                {/* First Name, Middle Name, Last Name in a Single Row */}
                <div className="flex space-x-4 mb-5">
                  <div className="flex-1">
                    <label htmlFor="firstName" className="block">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={newUser.firstName || ""}
                      onChange={handleInputChange}
                      className="form-input w-full"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="middleName" className="block">Middle Name</label>
                    <input
                      id="middleName"
                      type="text"
                      name="middleName"
                      placeholder="Middle Name"
                      value={newUser.middleName || ""}
                      onChange={handleInputChange}
                      className="form-input w-full"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="lastName" className="block">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={newUser.lastName || ""}
                      onChange={handleInputChange}
                      className="form-input w-full"
                      required
                    />
                  </div>
                </div>
                
                {/* Email */}
                <div className="mb-5">
                  <label htmlFor="email" className="block">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={newUser.email || ""}
                    onChange={handleInputChange}
                    className="form-input w-full"
                    required
                  />
                </div>
                
                {/* Mobile Number */}
                <div className="mb-5">
                  <label htmlFor="mobileNo" className="block">Mobile Number</label>
                  <input
                    id="mobileNo"
                    type="text"
                    name="mobileNo"
                    placeholder="Mobile Number"
                    value={newUser.mobileNo || ""}
                    onChange={handleInputChange}
                    className="form-input w-full"
                    required
                  />
                </div>

                {/* Role Dropdown */}
                <div className="mb-5">
                    <label htmlFor="role" className="block">Role</label>
                    <Select
                      id="role"
                      name="role"
                      value={roleOptions.find((option) => option.value === newUser.role)}
                      onChange={handleRoleChange}
                      styles={SelectStyles}
                      options={roleOptions}
                      className="text-sm font-semibold"
                      placeholder="Select a Role"
                      isSearchable
                    />
                  </div>
                
                {/* Date of Birth */}
                <div className="mb-5">
                  <label htmlFor="dateOfBirth" className="block">Date of Birth</label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    name="dateOfBirth"
                    value={newUser.dateOfBirth || ""}
                    onChange={handleInputChange}
                    className="form-input w-full"
                  />
                </div>

                {/* Password and Confirm Password (Only for Adding a User) */}
                {!newUser.id && (
                  <>
                    <div className="mb-5">
                      <label htmlFor="password" className="block">Password</label>
                      <input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        value={newUser.password || ""}
                        onChange={handleInputChange}
                        className="form-input w-full"
                        required
                      />
                    </div>
                
                    <div className="mb-5">
                      <label htmlFor="confirmPassword" className="block">Confirm Password</label>
                      <input
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={newUser.confirmPassword || ""}
                        onChange={handleInputChange}
                        className="form-input w-full"
                        required
                      />
                    </div>
                  </>
                )}

                
                {newUser.id && (
                  <div className="mb-5">
                    <label htmlFor="isActive" className="block">Status</label>
                    <label className="inline-flex">
                      <input 
                        type="radio" 
                        name="default_radio" 
                        className="form-radio" 
                        checked={newUser.isActive === true} 
                        onChange={() => setNewUser({ ...newUser, isActive: true })}
                      />
                      <span>Active</span>
                    </label>
                    <label className="inline-flex ml-4">
                      <input 
                        type="radio" 
                        name="default_radio" 
                        className="form-radio" 
                        checked={newUser.isActive === false} 
                        onChange={() => setNewUser({ ...newUser, isActive: false })}
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
                    {newUser.id ? 'Update' : 'Add'}
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

export default UserListinfo;