import apiService from "../appClient"; 
import axios from "axios"; 

const payTypeService = {
  getPayTypeHistory: (payType) =>
    apiService.get(
      `StaffInfo/getAmountByPayType?reportType=PayTypeHistory&amountPayType=${payType}`
    ),

  downloadPayTypeReport: (payType) =>
    axios.get(
      `https://dailysales.skylynxtech.com:8082/excelDownload?reportType=PayTypeHistory&createDate=${payType}`,
      { responseType: "blob" }
    ),
};

export default payTypeService;
