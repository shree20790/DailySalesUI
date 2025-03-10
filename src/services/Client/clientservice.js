import apiService from "../appClient";

const clientService = {

  getAllClients: (includeInactive = true) => 
    apiService.get("CustomerProfile/getAllCustomerProfiles", { includeInActive: includeInactive }),

  getClientById: (Id) => apiService.get(`CustomerProfile/getCustomerProfileById/${Id}`),

  createClient: (userData) => apiService.post("CustomerProfile/addCustomerProfile", userData),

  updateClient: (Id, userData) => apiService.put(`CustomerProfile/updateCustomerProfile`, { ...userData, id: Id }),

  deleteClient: (Id) => apiService.delete(`CustomerProfile/DeleteCustomerProfile/${Id}`),

}; 

export default clientService;