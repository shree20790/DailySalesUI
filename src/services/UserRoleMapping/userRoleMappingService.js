import apiService from "../appClient";
const userRoleMappingService = {
  
  getAllUserRoleMappings: (includeInactive = true) => 
    apiService.get("UserRoleMapping/getAllUserRoleMappings", { includeInActive: includeInactive }),

  getUserRoleMappingById: (Id) => apiService.get(`UserRoleMapping/getUserRoleMappingById/${Id}`),

  createUserRoleMapping: (userData) => apiService.post("UserRoleMapping/addUserRoleMapping", userData),

  updateUserRoleMapping: (Id, userData) => apiService.put(`UserRoleMapping/updateUserRoleMapping`, userData),

  deleteUserRoleMapping: (Id) => apiService.delete(`UserRoleMapping/DeleteUserRoleMapping/${Id}`),

  uploadUserRoleMappingDocument: (Id, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiService.postFormData(`UserRoleMapping/upload/${Id}`, formData);
  },
};

export default userRoleMappingService;
