import apiService from "../appClient";
import axios from "axios";

const customerHistoryService = {
  getCustomerHistoryByDate: (createDate) =>
    apiService.get(
      `CustomerHistory/getCustomerHistoryByDate?reportType=customerHistory&createDate=${createDate}`
    ),

  downloadCustomerHistoryReport: (createDate) =>
    axios.get(
      `https://dailysales.skylynxtech.com:8082/excelDownload?reportType=CustomerHistory&createDate=${createDate}`,
      { responseType: "blob" }
    ),
};

export default customerHistoryService;
