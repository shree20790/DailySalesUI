import apiService from "../appClient";
import axios from "axios";

const appointmentHistoryService = {
  getAppointmentHistoryByDate: (date) =>
    apiService.get(
      `StaffInfo/getStaffInfoByDate?reportType=staffinfohistory&createDate=${date}`
    ),

  downloadAppointmentHistoryReport: (date) =>
    axios.get(
      `https://dailysalesapi.skylynxclass.in/excelDownload?reportType=StaffInfoHistory&createDate=${date}`,
      { responseType: "blob" }
    ),
};

export default appointmentHistoryService;
