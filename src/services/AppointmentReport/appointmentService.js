import apiService from "../appClient";
import axios from "axios";

const appointmentHistoryService = {
  getAppointmentHistoryByDate: (startDate,endDate) =>
    apiService.get(
      `StaffInfo/getStaffInfoByDate?reportType=staffinfohistory&StartDate=${startDate}&EndDate=${endDate}`

    ),

  downloadAppointmentHistoryReport: (startDate,endDate) =>
    axios.get(
      `https://dailysalesapi.skylynxclass.in/excelDownload?reportType=StaffInfoHistory&StartDate=${startDate}&EndDate=${endDate}`,
      { responseType: "blob" }
    ),
};

export default appointmentHistoryService;
