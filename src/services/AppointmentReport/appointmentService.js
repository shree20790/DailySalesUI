import apiService from "../appClient";
import axios from "axios";

const appointmentHistoryService = {
  getAppointmentHistoryByDate: (date) =>
    apiService.get(
      `StaffInfo/getStaffInfoByDate?reportType=staffinfohistory&createDate=${date}`
    ),

  downloadAppointmentHistoryReport: (date) =>
    axios.get(
      `https://dailysales.skylynxtech.com:8082/excelDownload?reportType=StaffInfoHistory&createDate=${date}`,
      { responseType: "blob" }
    ),
};

export default appointmentHistoryService;
