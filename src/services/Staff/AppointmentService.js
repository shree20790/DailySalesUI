import apiService from "../appClient";

const staffService = {
  getAllStaffs: (includeInactive = true) =>
    apiService.get("StaffInfo/getAllStaffInfos", { includeInActive: includeInactive }),

  getStaffById: (Id) => apiService.get(`StaffInfo/getStaffInfoById/${Id}`),

  createStaff: (userData) => apiService.post("StaffInfo/addStaffInfo", userData),

  updateStaff: (id, userData) => 
     apiService.put(`StaffInfo/updateStaffInfo`, {id,...userData}),

  deleteStaff: (Id) => apiService.delete(`StaffInfo/DeleteStaffInfo/${Id}`),

  getPaginatedStaffs: (userData) =>
    apiService.post("StaffInfo/getPaginatedStaffInfos",userData),
};

export default staffService;
