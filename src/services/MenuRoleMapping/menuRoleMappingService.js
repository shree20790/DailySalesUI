import apiService from "../appClient";

const menuRoleMappingService = {
  getAllMenuRoleMappings: (includeInactive = true) => 
    apiService.get("MenuRoleMapping/getAllMenuRoleMappings", { includeInActive: includeInactive }),

  getMenuRoleMappingById: (Id) => apiService.get(`MenuRoleMapping/getMenuRoleMappingById/${Id}`),

  createMenuRoleMapping: (menuData) => apiService.post("MenuRoleMapping/addMenuRoleMapping", menuData),

  updateMenuRoleMapping: (menuData) => apiService.put("MenuRoleMapping/updateMenuRoleMapping", menuData),

  deleteMenuRoleMapping: (Id) => apiService.delete(`MenuRoleMapping/DeleteMenuRoleMapping/${Id}`),

  getPaginatedMenuRoleMappings: ({ page, pageSize, searchTerm, sortField, sortDirection }) => 
    apiService.post("MenuRoleMapping/getPaginatedMenuRoleMappings", { page, pageSize, searchTerm, sortField, sortDirection }),
};

export default menuRoleMappingService;