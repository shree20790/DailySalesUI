import apiService from "../appClient";

const ClientHistoryService = {
  getAllClientHistories: (includeInactive = true) =>
    apiService.get("/CustomerHistory/getAllCustomerHistorys", { params: { includeInActive: includeInactive } }),

  getClientHistoryById: (id) =>
    apiService.get(`/CustomerHistory/getCustomerHistoryById/${id}`),

  createClientHistory: (userData) =>
    apiService.post("/CustomerHistory/addCustomerHistory", userData),

  updateClientHistory: (userData) =>
    apiService.put("/CustomerHistory/updateCustomerHistory", userData),

  deleteClientHistory: (id) =>
    apiService.delete(`/CustomerHistory/DeleteCustomerHistory/${id}`),

  getPaginatedClientHistories: (userData) => 
    apiService.post("/CustomerHistory/getPaginatedCustomerHistorys", userData),

};

export default ClientHistoryService;