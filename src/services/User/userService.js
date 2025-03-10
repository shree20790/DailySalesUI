import apiService from "../appClient";
const userService = {
  
  getAllUsers: (includeInactive = true) => 
    apiService.get("User/getAllUsers", { includeInActive: includeInactive }),

  getUserById: (Id) => apiService.get(`User/getUserById/${Id}`),

  createUser: (userData) => apiService.post("User/addUser", userData),

  updateUser: (Id, userData) => apiService.put(`User/updateUser`, userData),

  deleteUser: (Id) => apiService.delete(`User/deleteUser/${Id}`),

  uploadUserDocument: (Id, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiService.postFormData(`User/upload/${Id}`, formData);
  },
};

export default userService;
