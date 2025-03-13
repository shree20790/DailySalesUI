import apiService from "../appClient";

const userRoleService = {
  getAllUserRoles: (includeInactive = true) => 
    apiService.get("UserRole/getAllUserRoles", { includeInActive: includeInactive }),

  getUserRoleById: (Id) => apiService.get(`UserRole/getUserRoleById/${Id}`),

  createUserRole: (roleData) => apiService.post("UserRole/addUserRole", roleData),

  updateUserRole: (Id, roleData) => apiService.put(`UserRole/updateUserRole`, roleData),

  deleteUserRole: (Id) => apiService.delete(`UserRole/DeleteUserRole/${Id}`),

  getPaginatedUserRoles: ({ page, pageSize, searchTerm, sortField, sortDirection }) => apiService.post("UserRole/getPaginateduserRoles",{ page, pageSize, searchTerm, sortField, sortDirection }),
};

export default userRoleService;