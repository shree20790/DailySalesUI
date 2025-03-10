import apiService from "../appClient";

const loginService = {
  authenticate: (userName, password) =>
    apiService.post("User/authenticate", { userName, password }),

  logout: () => apiService.post("User/logout"),

  getUserProfile: () => apiService.get("User/profile"),
};

export default loginService;
