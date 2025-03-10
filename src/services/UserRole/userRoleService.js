import apiService from "../appClient";
const userRoleService = {
  
  getAllUserRoles: (includeInactive = true) => 
    apiService.get("UserRole/getAllUserRoles", { includeInActive: includeInactive }),

  getUserRoleById: (Id) => apiService.get(`UserRole/getUserRoleById/${Id}`),

  createUserRole: (userData) => apiService.post("UserRole/addUserRole", userData),

  updateUserRole: (Id, userData) => apiService.put(`UserRole/updateUserRole`, userData),

  deleteUserRole: (Id) => apiService.delete(`UserRole/DeleteUserRole/${Id}`),

  uploadUserRoleDocument: (Id, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiService.postFormData(`UserRole/upload/${Id}`, formData);
  },
};

export default userRoleService;
