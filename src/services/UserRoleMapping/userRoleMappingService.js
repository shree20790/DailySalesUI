import apiService from "../appClient";

const userRoleMappingService = {
  getAllUserRoleMappings: () => apiService.get("UserRoleMapping/getAllUserRoleMappings"),

  getUserRoleMappingById: (id) => apiService.get(`UserRoleMapping/getUserRoleMappingById/${id}`),

  addUserRoleMapping: (userRoleMappingData) => apiService.post("UserRoleMapping/addUserRoleMapping", userRoleMappingData),

  updateUserRoleMapping: (userRoleMappingData) => apiService.put("UserRoleMapping/updateUserRoleMapping", userRoleMappingData),

  deleteUserRoleMapping: (id) => apiService.delete(`UserRoleMapping/DeleteUserRoleMapping/${id}`),

  getPaginatedUserRoleMappings: (paginationParams) => 
    apiService.post("UserRoleMapping/getPaginatedUserRoleMappings", paginationParams),
};

export default userRoleMappingService;