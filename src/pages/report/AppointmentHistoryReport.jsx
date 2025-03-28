import React, { useState } from "react";
import appointmentHistoryService from "../../services/AppointmentReport/appointmentService";

const AppointmentHistoryReport = () => {
  const [data, setData] = useState([]);
  const [selectDates, setDates] = useState({
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState({
    startDate: "",
    endDate: "",
  });

  // Handle Date Change for both fields
  const handleDateChange = (e) => {
    debugger;
    const { name, value } = e.target;

    let updatedErrors = { ...errors };

    if (!value) {
      updatedErrors[name] = "This field is required";
    } else {
      updatedErrors[name] = "";
    }
    // Ensure Start Date is before End Date
    if (
      name === "startDate" &&
      selectDates.endDate &&
      value > selectDates.endDate
    ) {
      alert("Start Date cannot be after End Date");
      return;
    }
    if (
      name === "endDate" &&
      selectDates.startDate &&
      value < selectDates.startDate
    ) {
      alert("End Date cannot be before Start Date");
      return;
    }

    setDates({
      ...selectDates,
      [name]: value,
    });
  };

  const handleEndDateChange = async (e) => {
    try {
      const response =
        await appointmentHistoryService.getAppointmentHistoryByDate(
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
    
    if (!selectDates.startDate || !selectDates.endDate) {
        setErrors({
            startDate: selectDates.startDate ? "" : "Start Date is required",
            endDate: selectDates.endDate ? "" : "End Date is required"
        });
        return;
    }

    if (selectDates.startDate > selectDates.endDate) {
        alert("Please ensure the Start Date is before the End Date.");
        return;
    }

    //  Consol.log(`Form submitted successfully! \nStart Date: ${selectDates.startDate} \nEnd Date: ${selectDates.endDate}`);
  };

  const handleDownload = async () => {
    try {
      const response =
        await appointmentHistoryService.downloadAppointmentHistoryReport(
          selectDates.startDate,
          selectDates.endDate
        );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      const today = new Date().toISOString().split('T')[0];
      link.href = url;
      link.setAttribute(
        "download",
        `AppointmentHistoryReport_${today}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
    <div className="flex flex-col gap-5 sm:h-[calc(100vh_-_150px)] h-full">
      <div className="bg-white dark:bg-[#121c2c] rounded-lg shadow w-full flex-grow">
        <div className="flex flex-wrap items-center justify-between p-4">
          <h3 className="text-lg font-semibold">Appointment History Report</h3>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
            <div>
              <label
                htmlFor="startDate"
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
              {errors.endDate && (
                <p className="text-red-500 text-sm">{errors.startDate}</p>
              )}
            </div>
            <div>
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
              {errors.endDate && (
                <p className="text-red-500 text-sm">{errors.endDate}</p>
              )}
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
                  <th className="py-2 px-4 border-b">In Time</th>
                  <th className="py-2 px-4 border-b">Out Time</th>
                  <th className="py-2 px-4 border-b">Staff Type</th>
                  <th className="py-2 px-4 border-b">Amount</th>
                  <th className="py-2 px-4 border-b">Tip Amount</th>
                  <th className="py-2 px-4 border-b">Comment</th>
                  <th className="py-2 px-4 border-b">Created Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">{item.staffName}</td>
                    <td className="py-2 px-4 border-b">{item.mobileNumber}</td>
                    <td className="py-2 px-4 border-b">{item.inTime}</td>
                    <td className="py-2 px-4 border-b">{item.outTime}</td>
                    <td className="py-2 px-4 border-b">{item.staffType}</td>
                    <td className="py-2 px-4 border-b">{item.amount}</td>
                    <td className="py-2 px-4 border-b">
                      {item.sttafTipAmount}
                    </td>
                    <td className="py-2 px-4 border-b">{item.comment}</td>
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
    </form>
  );
};
//     const [createDate, setCreateDate] = useState("");
//     const [data, setData] = useState([]);

//     const handleDateChange = async (e) => {
//         const selectedDate = e.target.value;
//         setCreateDate(selectedDate);

//         try {
//             const response = await appointmentHistoryService.getAppointmentHistoryByDate(selectedDate);
//             if (response.data.isSuccess) {
//                 setData(response.data.output);
//             } else {
//                 console.error("Failed to fetch data:", response.data.failureReason);
//                 setData([]);
//             }
//         } catch (error) {
//             console.error("Failed to fetch data:", error);
//             setData([]);
//         }
//     };

//     const handleDownload = async () => {
//         try {
//             const response = await appointmentHistoryService.downloadAppointmentHistoryReport(createDate);
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement("a");
//             link.href = url;
//             link.setAttribute("download", `StaffInfoHistoryReport_${createDate}.xlsx`);
//             document.body.appendChild(link);
//             link.click();
//         } catch (error) {
//             console.error("Failed to download file:", error);
//         }
//     };

//     return (
//         <div className="flex flex-col gap-5 sm:h-[calc(100vh_-_150px)] h-full">
//             <div className="bg-white dark:bg-[#121c2c] rounded-lg shadow w-full flex-grow">
//                 <div className="flex flex-wrap items-center justify-between p-4">
//                     <h3 className="text-lg font-semibold">Appointment History Report</h3>
//                 </div>

//                 <div className="p-4">
//                     <div className="mb-4">
//                         <label htmlFor="createDate" className="block text-gray-700 dark:text-white mb-2">Select Date:</label>
//                         <input
//                             type="date"
//                             id="createDate"
//                             name="createDate"
//                             value={createDate}
//                             onChange={handleDateChange}
//                             className="form-input w-full sm:w-1/4"
//                             required
//                         />
//                     </div>

//                     {createDate && data.length > 0 && (
//                         <button
//                             className="btn btn-primary w-full sm:w-auto"
//                             onClick={handleDownload}
//                         >
//                             Download Report
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );

export default AppointmentHistoryReport;
