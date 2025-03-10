import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import SelectStyles from "../../utils/SelectStyles";

const paymentOptions = [
    { value: "Gpay", label: "Gpay" },
    { value: "Cash", label: "Cash" },
    { value: "Card", label: "Card" },
];



const PayTypeHistory = () => {
    const [payType, setPayType] = useState(null);
    const [data, setData] = useState([]);
    const [downloadUrl, setDownloadUrl] = useState("");

    const handlePayTypeChange = async (selectedOption) => {
        if (!selectedOption) {
            setPayType(null);
            setData([]);
            return;
        }

        const selectedPayType = selectedOption.value;
        setPayType(selectedPayType);
        setDownloadUrl(`https://dailysales.skylynxtech.com:8082/excelDownload?reportType=PayTypeHistory&createDate=${selectedPayType}`);

        try {
            const response = await axios.get(`https://dailysales.skylynxtech.com:8082/api/StaffInfo/getAmountByPayType?reportType=PayTypeHistory&amountPayType=${selectedPayType}`);
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
            link.setAttribute('download', `PayTypeHistoryReport_${payType}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to download file:", error);
        }
    };

    return (
        <div className="flex flex-col gap-5 sm:h-[calc(100vh_-_150px)] h-full">
            <div className="bg-white dark:bg-[#121c2c] rounded-lg shadow w-full flex-grow">
                <div className="flex flex-wrap items-center justify-between p-4">
                    <h3 className="text-lg font-semibold">Pay Type History Report</h3>
                </div>

                <div className="p-4">
                    <div className="mb-4">
                        <label htmlFor="payType" className="block text-gray-700 dark:text-white mb-2">Select Pay Type:</label>
                        <Select
                            id="payType"
                            name="payType"
                            styles={SelectStyles}
                            value={paymentOptions.find(option => option.value === payType)}
                            onChange={handlePayTypeChange}
                            options={paymentOptions}
                            className="basic-single w-full sm:w-1/4"
                            classNamePrefix="select"
                            isClearable
                            isSearchable
                            menuPosition="fixed"
                            placeholder="Select"
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
                                        <th className="py-2 px-4 border-b">Staff Tip Amount</th>
                                        <th className="py-2 px-4 border-b">Amount Pay Type</th>
                                        <th className="py-2 px-4 border-b">Comment</th>
                                        <th className="py-2 px-4 border-b">Created Date</th>
                                        <th className="py-2 px-4 border-b">Total Amount</th>
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
                                            <td className="py-2 px-4 border-b">{item.amountPayType}</td>
                                            <td className="py-2 px-4 border-b">{item.comment}</td>
                                            <td className="py-2 px-4 border-b">{new Date(item.createdDate).toLocaleString()}</td>
                                            <td className="py-2 px-4 border-b">{item.totalAmount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {payType && data.length > 0 && (
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

export default PayTypeHistory;
