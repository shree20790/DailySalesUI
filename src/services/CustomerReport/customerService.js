import apiService from "../appClient";
import axios from "axios";

const customerHistoryService = {
  getCustomerHistoryByDate: (startDate,endDate) =>
    apiService.get(
     // `CustomerHistory/getCustomerHistoryByDate?reportType=customerHistory&createDate=${StartDate}`
      `CustomerHistory/getCustomerHistoryByDate?reportType=CustomerHistory&StartDate=${startDate}&EndDate=${endDate}`
    ),

  downloadCustomerHistoryReport: (startDate,endDate) =>
    axios.get(
     `https://dailysalesapi.skylynxclass.in/excelDownload?reportType=CustomerHistory&StartDate=${startDate}&EndDate=${endDate}`,
     { responseType: "blob" }
    ),
};

export default customerHistoryService;
