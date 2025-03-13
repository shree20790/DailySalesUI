import apiService from "../appClient";

const menuService = {
  getAllMenus: (includeInactive = true) => 
    apiService.get("Menu/getAllMenus", { includeInActive: includeInactive }),

  getMenuById: (Id) => apiService.get(`Menu/getMenuById/${Id}`),

  createMenu: (menuData) => apiService.post("Menu/addMenu", menuData),

  updateMenu: (Id, menuData) => apiService.put(`Menu/updateMenu`, menuData),

  deleteMenu: (Id) => apiService.delete(`Menu/DeleteMenu/${Id}`),

  getPaginatedMenus: (page, size) => apiService.get("Menu/getPaginatedMenus", { page, size }),
};

export default menuService;