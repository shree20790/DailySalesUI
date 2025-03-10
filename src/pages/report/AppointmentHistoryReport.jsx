import React, { useState } from "react";
import axios from "axios";

const AppointmentHistoryReport = () => {
    const [createDate, setCreateDate] = useState("");
    const [data, setData] = useState([]);
    const [downloadUrl, setDownloadUrl] = useState("");

    const handleDateChange = async (e) => {
        const selectedDate = e.target.value;
        setCreateDate(selectedDate);
        setDownloadUrl(`https://dailysales.skylynxtech.com:8082/excelDownload?reportType=StaffInfoHistory&createDate=${selectedDate}`);

        try {
            const response = await axios.get(`https://dailysales.skylynxtech.com:8082/api/StaffInfo/getStaffInfoByDate?reportType=staffinfohistory&createDate=${selectedDate}`);
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

    const handleDownload = async () => {
        try {
            const response = await axios.get(downloadUrl, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `StaffInfoHistoryReport_${createDate}.xlsx`);
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
                    <h3 className="text-lg font-semibold">Appointment History Report</h3>
                </div>

                <div className="p-4">
                    <div className="mb-4">
                        <label htmlFor="createDate" className="block text-gray-700 dark:text-white mb-2">Select Date:</label>
                        <input
                            type="date"
                            id="createDate"
                            name="createDate"
                            value={createDate}
                            onChange={handleDateChange}
                            className="form-input w-full sm:w-1/4"
                            required
                        />
                    </div>

                    {data.length > 0 && (
                        <div className="mb-4 overflow-x-auto">
                            <table className="min-w-full bg-white dark:bg-[#121c2c]">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b">Staff Name</th>
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
                                            <td className="py-2 px-4 border-b">{item.sttafTipAmount}</td>
                                            <td className="py-2 px-4 border-b">{item.comment}</td>
                                            <td className="py-2 px-4 border-b">{new Date(item.createdDate).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {createDate && data.length > 0 && (
                        <button
                            className="btn btn-primary w-full sm:w-auto"
                            onClick={handleDownload}
                        >
                            Download Report
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentHistoryReport;