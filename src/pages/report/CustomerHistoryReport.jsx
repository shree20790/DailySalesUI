import React, { useState } from "react";
import customerHistoryService from "../../services/CustomerReport/customerService";

const CustomerHistoryReport = () => {
  const [data, setData] = useState([]);
  const [selectDates, setDates] = useState({
    startDate: "",
    endDate: ""
});

const [errors, setErrors] = useState({
    startDate: "",
    endDate: ""
});

    


    // Handle Date Change for both fields
    const handleDateChange = (e) => {
        debugger
        const { name, value } = e.target;

        let updatedErrors = { ...errors };

        
        if (!value) {
            updatedErrors[name] = "This field is required";
        } else {
            updatedErrors[name] = "";
        }
        // Ensure Start Date is before End Date
        if (name === "startDate" && selectDates.endDate && value > selectDates.endDate) {
            alert("Start Date cannot be after End Date");
            return;
        }
        if (name === "endDate" && selectDates.startDate && value < selectDates.startDate) {
            alert("End Date cannot be before Start Date");
            return;
        }

        setDates({
            ...selectDates,
            [name]: value
        });
    };

  const handleEndDateChange = async (e) => {
  


    try {
      const response = await customerHistoryService.getCustomerHistoryByDate(
        selectDates.startDate,
        selectDates.endDate
      );
      if (response.data.isSuccess) {
        setData(response.data.output);
      } else {
        console.error("Failed to fetch data:", response.data.failureReason);
        setData([]);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setData([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();


  //  Consol.log(`Form submitted successfully! \nStart Date: ${selectDates.startDate} \nEnd Date: ${selectDates.endDate}`);
};

  const handleDownload = async () => {
    try {
      const response =
        await customerHistoryService.downloadCustomerHistoryReport(
            selectDates.startDate,
            selectDates.endDate
        );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `CustomerHistoryReport_${selectedEndDate}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  return (
    <div className="flex flex-col gap-5 sm:h-[calc(100vh_-_150px)] h-full">
      <div className="bg-white dark:bg-[#121c2c] rounded-lg shadow w-full flex-grow">
        <div className="flex flex-wrap items-center justify-between p-4">
          <h3 className="text-lg font-semibold">Customer History Report</h3>
        </div>

        <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
            <div >
              <label
                htmlFor="createDate"
                className="block text-gray-700 dark:text-white mb-2"
              >
                Select Start Date:
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={selectDates.startDate}
               onChange={handleDateChange}
                className="form-input w-full"
                required
              />
               {errors.endDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
            </div>
            <div >
              <label
                htmlFor="endDate"
                className="block text-gray-700 dark:text-white mb-2"
              >
                Select End Date:
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={selectDates.endDate}
                onChange={handleDateChange}
                className="form-input w-full "
                required
              />
               {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
            </div>

            <button
              className="btn btn-primary w-full sm:w-auto sm:h-10 mt-7"
              onClick={handleEndDateChange}
            >
              Show Report
            </button>
          </div>
          </div>
          {data.length > 0 && (
            <div className="p-4 mb-4 overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-[#121c2c]">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Customer Name</th>
                    <th className="py-2 px-4 border-b">Mobile Number</th>
                    <th className="py-2 px-4 border-b">Service Name</th>
                    <th className="py-2 px-4 border-b">Pack Taken</th>
                    <th className="py-2 px-4 border-b">Remaining Pack</th>
                    <th className="py-2 px-4 border-b">Created Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">
                        {item.customerName}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {item.mobileNumber}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {item.sereviceName}
                      </td>
                      <td className="py-2 px-4 border-b">{item.packTaken}</td>
                      <td className="py-2 px-4 border-b">
                        {item.remainingPack}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {new Date(item.createdDate).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data.length > 0 && (
            <button
              className="btn btn-primary w-full sm:w-auto"
              onClick={handleDownload}
            >
              Download Report
            </button>
          )}
        </div>
      </div>

  );
};

export default CustomerHistoryReport;
