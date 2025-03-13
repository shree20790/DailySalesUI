import apiService from "../appClient";

const userService = {
  getAllUsers: () => apiService.get("User/getAllUsers"),

  getUserById: (id) => apiService.get(`User/getUserById/${id}`),

  createUser: (userData) => apiService.post("User/addUser", userData),

  updateUser: (userData) => apiService.put("User/updateUser", userData),

  deleteUser: (id) => apiService.delete(`User/deleteUser/${id}`),

  getPaginatedUsers: (paginationParams) => 
    apiService.post("User/getPaginatedUsers", paginationParams),
};

export default userService;