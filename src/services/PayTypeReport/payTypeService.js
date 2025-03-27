import apiService from "../appClient"; 
import axios from "axios"; 

const payTypeService = {
  getPayTypeHistory: (payType) =>
    apiService.get(
      `StaffInfo/getAmountByPayType?reportType=PayTypeHistory&amountPayType=${payType}`
    ),

  downloadPayTypeReport: (payType) =>
    axios.get(
      `https://dailysalesapi.skylynxclass.in/excelDownload?reportType=PayTypeHistory&StartDate=${payType}`,
      { responseType: "blob" }
    ),
};

export default payTypeService;
