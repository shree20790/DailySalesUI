import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import "react-perfect-scrollbar/dist/css/styles.css";
import IconPlus from "../../components/Icon/IconPlus";
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import debounce from 'lodash.debounce';
import apiService from "../../services/appClient";
import userRoleService from "../../services/UserRole/userRoleService";
import menuService from "../../services/Menu/menuService";
import menuRoleMappingService from "../../services/MenuRoleMapping/menuRoleMappingService";
import AlertService from "../../utils/AlertService";
import IconEdit from "../../components/Icon/IconEdit";
import Select from "react-select";
import IconTrashLines from "../../components/Icon/IconTrashLines";
import SelectStyles from '../../utils/SelectStyles';

const MenuRoleMappingListInfo = ({ apiUrl  }) => {  
    const [isShowTaskMenu, setIsShowTaskMenu] = useState(false);
    const [addTaskModal, setAddTaskModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newLead, setNewLead] = useState({
      label: "",
      roleId: "",
      read: false,
      delete: false,
      edit: false,
      view: false,
      approve: false,
      isActive: true,
      createdBy: "",
      createdDate: ""
    });
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [sortField, setSortField] = useState('Id');
    const [sortDirection, setSortDirection] = useState('desc');
    const [roles, setRoles] = useState([]);
    const [menu, setMenu]= useState([]);
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

    const selectedColumns = ["id","roleId","menuId","read", "delete","edit","view", "approve", "isActive", "createdBy", "createdDate" ];

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await menuRoleMappingService.getPaginatedMenuRoleMappings({
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
      const fetchRoles = async () => {
        try {
          const response = await userRoleService.getAllUserRoles(); // Call your roles API
          if (response.data?.isSuccess) {
            setRoles(response.data.output || []); // Ensure array format
          } else {
            console.error("Failed to fetch roles:", response.data);
          }
        } catch (error) {
          console.error("Error fetching roles:", error);
        }
      }; 
      fetchRoles();
    }, []);

    useEffect(() => {
      const fetchMenu = async () => {
        try {
          const response = await menuService.getAllMenus(); // Call your menu API
          if (response.data?.isSuccess) {
            setMenu(response.data.output || []); // Ensure array format
          } else {
            console.error("Failed to fetch menu:", response.data);
          }
        } catch (error) {
          console.error("Error fetching menu:", error);
        }
      }; 
      fetchMenu();
    }, []);

    const handleCreateLead = async () => {
      const leadData = {
        ...newLead,
        read: newLead.read ? 1 : 0,
        delete: newLead.delete ? 1 : 0,
        edit: newLead.edit ? 1 : 0,
        view: newLead.view ? 1 : 0,
        approve: newLead.approve ? 1 : 0,
      };

      try {
        const response = await menuRoleMappingService.createMenuRoleMapping(leadData);
        if (response.data?.isSuccess) {
          AlertService.success("MenuRole Mapping created successfully!");
          handleModalClose();
          setRefresh((prev) => !prev);
          fetchData();
        } else {
          AlertService.warning(response.data.failureReason); // Show only failure reason when isSuccess is false
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.failureReason) {
          AlertService.warning(error.response.data.failureReason); // Show API error reason if available
        }
      }
    };

    const handleUpdateLead = async () => {
      const leadData = {
        ...newLead,
        read: newLead.read ? 1 : 0,
        delete: newLead.delete ? 1 : 0,
        edit: newLead.edit ? 1 : 0,
        view: newLead.view ? 1 : 0,
        approve: newLead.approve ? 1 : 0,
      };

      try {
        const response = await menuRoleMappingService.updateMenuRoleMapping(leadData);
        if (response.status === 200) {
          AlertService.success("MenuRole Mapping updated successfully");
          setAddTaskModal(false);
          handleModalClose();
          setRefresh((prev) => !prev);
        } else {
          console.error("Update failed:", response);
        }
      } catch (error) {
        console.error("Error updating lead:", error);
      }
    };

    const handleDeleteClick = async (id) => {
      const confirmDelete = await AlertService.confirm({
        message: "Are you sure want to delete this menuRole Mapping?"
      });

      if (!confirmDelete.isConfirmed) return;

      try {
        const response = await menuRoleMappingService.deleteMenuRoleMapping(id);
        if (response.status === 200 || response.data.isSuccess) {
          AlertService.success("MenuRole Mapping deleted successfully!");
          setRefresh((prev) => !prev);
          fetchData();
        } else {
          console.error("Failed to delete menuRoleMapping:", response);
          AlertService.warning("Failed to delete menuRole Mapping. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting menuRoleMapping:", error);
        AlertService.warning("An error occurred while deleting the menuRoleMapping.");
      }
    };

    const handleEditClick = (lead) => {
      // Set the selected lead's data to the state
      setNewLead(lead);
      // Open the modal
      setAddTaskModal(true);
    };

    // Reset the modal state after closing
    const handleModalClose = () => {
      setNewLead({
        label: "",
        roleId: "",
        read: false,
        delete: false,
        edit: false,
        view: false,
        approve: false,
        isActive: true,
        createdBy: "",
        createdDate: ""
      });
      setAddTaskModal(false);
    };

    const handleInputChange = (e) => {
      const { name, type, checked, value } = e.target;
      let updatedValue = type === "checkbox" ? checked : value;
    
      if (name === "mobileNumber" || name === "product") {
        updatedValue = value.replace(/\D/g, ''); // Ensure only numbers
      }
    
      setNewLead((prev) => ({
        ...prev,
        [name]: type === "radio" || type === "checkbox" ? !prev[name] : value,
      }));
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      setIsSubmitting(true);
  
      try {
        if (newLead.id) {
          // Update existing lead
          await handleUpdateLead();
        } else {
          // Create a new lead
          await handleCreateLead();
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsSubmitting(false); // Reset submitting state
      }
    };

    return (
        <div className="flex gap-5 relative sm:h-[calc(100vh_-_150px)] h-full">
            <div className={`overlay bg-black/60 w-full h-full rounded-md absolute hidden ${isShowTaskMenu && '!block xl:!hidden'}`} onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}></div>
            <div className="bg-white dark:bg-[#121c2c] rounded-lg shadow w-full flex-grow">
              <div className="flex flex-wrap items-center justify-between p-4">
                <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">Menu Role Mapping List</h3>
                <div className="flex items-center space-x-4">
                  <div>
                    <button className="btn btn-primary w-full" type="button" onClick={() => setAddTaskModal(true)}>
                      <IconPlus className="ltr:mr-2 rtl:ml-2 shrink-0" />
                      Add New Menu Role Mapping
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
                          {col === "menuId" ? "menuName" : col === "roleId" ? "roleName" : col}
                        </th>
                      ))}
                      <th className="p-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={selectedColumns.length} className="text-center p-4">Loading...</td>
                      </tr>
                    ) : data.length > 0 ? (
                      data.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a202c] text-gray-900 dark:text-white">
                          {selectedColumns.map((col) => (
                            <td key={col} className="p-2 text-center">
                              {col === "roleId"
                                ? roles.find((role) => role.id === item.roleId)?.roleName || "N/A"
                                : col === "menuId"
                                ? menu.find((menu) => menu.id === item.menuId)?.label || "N/A"
                                : item[col] !== undefined && item[col] !== null
                                ? item[col].toString()
                                : "N/A"}
                            </td>                   
                          ))}
                          <td className="p-2 flex justify-center gap-3 items-center">
                            <button onClick={() => handleEditClick(item)}>
                              <IconEdit className="text-blue-500 cursor-pointer"/>
                            </button>
                            <button onClick={() => handleDeleteClick(item.id)}>
                              <IconTrashLines className="text-red-500 cursor-pointer" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={selectedColumns.length} className="text-center p-4">No Data Available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap items-center justify-between p-4 border-t">
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
                  <div className="flex items-center space-x-2">
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
                  <div className="flex min-h-screen items-center justify-center px-4 py-8">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg  text-black dark:text-white-dark">
                        <button
                          type="button"
                          onClick={handleModalClose}
                          className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                        >
                          ✖
                        </button>
                        <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                          {newLead.id ? 'Update Menu Role' : 'Add New Menu Role Mapping'}
                        </div>
                        <div className="p-5">
                          <form onSubmit={handleSubmit} className="p-6 bg-white rounded-md shadow-md">
                            <div className="flex justify-around gap-4 w-full mb-10">
                              {/* Role Select */}
                              <div className="flex flex-col w-full">
                                <label className="block font-medium mb-1">Role</label>
                                <Select
                                  name="roleId"
                                  styles={SelectStyles}
                                  value={roles.find((role) => role.id === newLead.roleId) 
                                    ? { value: newLead.roleId, label: roles.find((role) => role.id === newLead.roleId)?.roleName } 
                                    : null
                                  }
                                  onChange={(selectedOption) =>
                                    handleInputChange({
                                      target: { name: "roleId", value: selectedOption?.value },
                                    })
                                  }
                                  options={roles.map((role) => ({
                                    value: role.id,
                                    label: role.roleName || "Unnamed Role",
                                  }))}
                                  isSearchable
                                  placeholder="Select Role"
                                  className="w-full"
                                />
                              </div>
                              {/* Menu Select */}
                              <div className="flex flex-col w-full">
                                <label className="block font-medium mb-1">Menu</label>
                                <Select
                                  name="menuId"
                                  styles={SelectStyles}
                                  value={menu.find((m) => m.id === newLead.menuId) || null}
                                  onChange={(selectedOption) =>
                                    handleInputChange({
                                      target: { name: "menuId", value: selectedOption?.value },
                                    })
                                  }
                                  options={menu.map((m) => ({
                                    value: m.id,
                                    label: m.label || "Unnamed Menu",
                                  }))}
                                  isSearchable
                                  placeholder="Select Menu"
                                  className="w-full"
                                />
                              </div>
                            </div>
       <div className="flex justify-normal items-center gap-28 mb-8">
        {/* Read Section */}
       <div className="flex flex-col items-center">
            <label className="block font-medium mb-1">Read</label>
           <div className="flex items-center space-x-3">
           <input
              type="radio"
              name="read"
              checked={newLead.read}
              onClick={handleInputChange}
              className="form-radio"
            />
            <span className="text-gray-700">True</span>
           </div>
          </div>

  {/* Delete Section */}
  <div className="flex flex-col items-center">
    
    <label className="block font-medium mb-1">Delete</label>
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        name="delete"
        checked={newLead.delete}
        onClick={handleInputChange} // Use onClick for toggling
        className="form-radio"
      />
      <span className="text-gray-700">True</span>
    </div>
  </div>

  {/* Edit Section */}
  <div className="flex flex-col items-center">
    <label className="block font-medium mb-1">Edit</label>
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        name="edit"
        checked={newLead.edit}
        onClick={handleInputChange}
        className="form-radio"
      />
      <span className="text-gray-700">True</span>
    </div>
  </div>
</div>

        <div className="flex justify-start items-center gap-28 mb-20">
           {/* View Section */}
  <div className="flex flex-col items-center">
    <label className="block font-medium mb-1">View</label>
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        name="view"
        checked={newLead.view}
        onClick={handleInputChange}
        className="form-radio"
      />
      <span className="text-gray-700">True</span>
    </div>
  </div>
         <div className="flex  flex-col items-center">
            <label className="block font-medium mb-1">Approve</label>
            <div className="flex items-center space-x-2">
            <input
             type="radio"
             name="approve"
             checked={newLead.approve}
             onClick={handleInputChange}
             className="form-radio"
            />
            <span className="text-gray-700">True</span>
          </div>
          </div>
        </div>

        <div className="ltr:text-right rtl:text-left flex justify-end items-center mt-8">
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={handleModalClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary ltr:ml-4 rtl:mr-4"
                  >
                    {isSubmitting ? "Submitting..." : newLead.id ? 'Update' : 'Add'}
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

export default MenuRoleMappingListInfo;