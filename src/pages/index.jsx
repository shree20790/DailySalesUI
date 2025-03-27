import React, { useState, useEffect } from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import rupee from "../assets/rupee.png";
import gpay from "../assets/gpay.png";
import money from "../assets/money.png";
import customerReview from "../assets/customer-review.png";
import card from "../assets/card.png";
import appointment from "../assets/appointment.png";
import { FaSearch, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { getUserData } from "../utils/userData";
import axios from "axios";
import { config } from "../config";

const Index = ({ apiUrl }) => {
  const [selected, setSelected] = useState("Dashboard");
  const [isAdmin, setIsAdmin] = useState(false);

  // Payment Summary State (from MasterForm)
  const [paymentData, setPaymentData] = useState({
    gpayAmount: 0,
    cashAmount: 0,
    cardAmount: 0,
  });

  // Payment History State (from MasterForm)
  const [staffInfo, setStaffInfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // State for total appointments and total clients
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [totalClients, setTotalClients] = useState(0);

  // Fetch Payment Data (from MasterForm)
  const fetchPaymentData = async () => {
    try {
    
      const response = await axios.get(config.BaseUrl + "StaffInfo/getAllStaffInfos?includeInActive=true");
      debugger;
      const staffData = response.data.output || [];

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split("T")[0];

      // Calculate payment totals for today's payments
      const todaysPayments = staffData.filter(staff => {
        return staff.todaysDate && staff.todaysDate.startsWith(today);
      });

      const gpayAmount = todaysPayments
        .filter(staff => staff.amountPayType === "GPay")
        .reduce((acc, curr) => acc + curr.amount, 0);

      const cashAmount = todaysPayments
        .filter(staff => staff.amountPayType === "Cash")
        .reduce((acc, curr) => acc + curr.amount, 0);

      const cardAmount = todaysPayments
        .filter(staff => staff.amountPayType === "Card")
        .reduce((acc, curr) => acc + curr.amount, 0);

      setPaymentData({ gpayAmount, cashAmount, cardAmount });
      setStaffInfo(todaysPayments); // Show only today's payments in the table
      setFilteredData(todaysPayments); // Initialize filtered data with today's payments

      console.log("Payment Data:", { gpayAmount, cashAmount, cardAmount });
    } catch (error) {
      console.error("Error fetching payment data:", error);
    }
  };

  // Fetch Total Appointments
  const fetchTotalAppointments = async () => {
    try {
      console.log(config.BaseUrl);
      const response = await axios.get(config.BaseUrl + "StaffInfo/getAllStaffInfos?includeInActive=true");

      const staffData = response.data.output || [];

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split("T")[0];

      // Count today's appointments
      const todaysAppointments = staffData.filter(staff => {
        return staff.todaysDate && staff.todaysDate.startsWith(today);
      }).length;

      setTotalAppointments(todaysAppointments);
      console.log("Total Appointments Today:", todaysAppointments);
    } catch (error) {
      console.error("Error fetching total appointments:", error);
    }
  };

  // Fetch Total Clients
  const fetchTotalClients = async () => {
    try {
      const response = await axios.get(config.BaseUrl + "CustomerProfile/getAllCustomerProfiles?includeInActive=true");

      const clientData = response.data.output || [];

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split("T")[0];

      // Count today's clients
      const todaysClients = clientData.filter(client => {
        return client.date && client.date.startsWith(today);
      }).length;

      setTotalClients(todaysClients);
      console.log("Total Clients Today:", todaysClients);
    } catch (error) {
      console.error("Error fetching total clients:", error);
    }
  };

  useEffect(() => {
    fetchPaymentData(); // Fetch payment data on component mount
    fetchTotalAppointments(); // Fetch total appointments on component mount
    fetchTotalClients(); // Fetch total clients on component mount
  }, []);

  useEffect(() => {
    const user = getUserData();
    console.log("User Data:", user); // Log the user data
    if (user != null) {
      setIsAdmin(true);
      console.log("User Role:", user.roleIds); // Log the user role
      // Assuming 1 represents ADMIN role
          
    } else {
      setIsAdmin(false);
      console.log("User data is not defined");
    }
  }, []);

  // Search and Filter Logic (from MasterForm)
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      const filtered = staffInfo.filter(
        (item) =>
          item.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.mobileNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.todaysDate && new Date(item.todaysDate).toLocaleDateString().includes(searchQuery))
      );
      setFilteredData(filtered);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(delaySearch);
  }, [searchQuery, staffInfo]);

  // Pagination Logic (from MasterForm)
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredData.length / recordsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <div className="bg-white dark:bg-[#121c2c] rounded-lg shadow w-full flex-grow">
        {isAdmin && (
          <div className="w-full p-6">
            {/* Payment Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Total GPay */}
              <div className="bg-gradient-to-r from-primary to-red-400 p-4 rounded-lg shadow">
                <h2 className="text-sm text-white dark:text-white-dark">Total GPay</h2>
                <div className="flex justify-between mt-3 items-center">
                  <p className="text-3xl font-semibold text-white">₹{paymentData.gpayAmount}</p>
                  <img src={gpay} alt="GPay Icon" className="w-10 h-10 ml-auto" />
                </div>
              </div>

              {/* Total Cash */}
              <div className="bg-gradient-to-r from-gray-600 to-gray-400 p-4 rounded-lg shadow">
                <h2 className="text-sm text-white dark:text-white-dark">Total Cash</h2>
                <div className="flex justify-between mt-3 items-center">
                  <p className="text-2xl font-semibold text-white">₹{paymentData.cashAmount}</p>
                  <img src={money} alt="Cash Icon" className="w-10 h-10 ml-auto" />
                </div>
              </div>

              {/* Total Card */}
              <div className="bg-gradient-to-r from-primary to-red-400 p-4 rounded-lg shadow">
                <h2 className="text-sm text-white dark:text-white-dark">Total Card</h2>
                <div className="flex justify-between mt-3 items-center">
                  <p className="text-2xl font-semibold text-white">₹{paymentData.cardAmount}</p>
                  <img src={card} alt="Card Icon" className="w-10 h-10 ml-auto" />
                </div>
              </div>

              {/* Total Balance */}
              <div className="bg-gradient-to-r from-gray-600 to-gray-400 p-4 rounded-lg shadow">
                <h2 className="text-sm text-white dark:text-white-dark">Total</h2>
                <div className="flex justify-between mt-3 items-center">
                  <p className="text-2xl font-semibold text-white">₹{paymentData.gpayAmount + paymentData.cashAmount + paymentData.cardAmount}</p>
                  <img src={rupee} alt="Balance Icon" className="w-10 h-10 ml-auto" />
                </div>
              </div>

              {/* Total Appointments */}
              <div className="bg-gradient-to-r from-primary to-red-400 p-4 rounded-lg shadow">
                <h2 className="text-sm text-white dark:text-white-dark">Total Appointments</h2>
                <div className="flex justify-between mt-3 items-center">
                  <p className="text-2xl font-semibold text-white">{totalAppointments}</p>
                  <img src={appointment} alt="Appointments Icon" className="w-10 h-10 ml-auto" />
                </div>
              </div>

              {/* Total Clients */}
              <div className="bg-gradient-to-r from-gray-600 to-gray-400 p-4 rounded-lg shadow">
                <h2 className="text-sm text-white dark:text-white-dark">Total Clients</h2>
                <div className="flex justify-between mt-3 items-center">
                  <p className="text-2xl font-semibold text-white">{totalClients}</p>
                  <img src={customerReview} alt="Clients Icon" className="w-10 h-10 ml-auto" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment History Table (from MasterForm) */}
        <div className="bg-white rounded-lg shadow">
          <div className="flex gap-5 relative sm:h-[calc(100vh_-_150px)] h-full">
            <div className="bg-white dark:bg-[#121c2c] rounded-lg shadow w-full flex-grow">
              <div className="flex flex-wrap items-center justify-between p-4">
                <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">Payment History</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border-gray-300 rounded bg-gray-100 dark:bg-[#1b2e4b] p-2 w-50">
                    <FaSearch className="text-gray-400 text-lg" />
                    <input
                      type="text"
                      placeholder="Search by Name, Mobile Number, or Date..."
                      className="bg-transparent border-none focus:outline-none ml-2 w-full text-gray-700"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#121c2c] rounded-lg shadow overflow-x-auto p-4 w-full">
                <table className="table-responsive mb-5 w-full border border-gray-200 dark:border-gray-700">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-[#1b2e4b] text-gray-700 dark:text-white">
                      <th className="p-2 capitalize text-center">Customer Name</th>
                      <th className="p-2 capitalize text-center">Mobile Number</th>
                      <th className="p-2 capitalize text-center">Date</th>
                      <th className="p-2 capitalize text-center">Amount</th>
                      <th className="p-2 capitalize text-center">Payment Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecords.length > 0 ? (
                      currentRecords.map((staff, index) => {
                        const formattedDate = staff.todaysDate ? new Date(staff.todaysDate).toLocaleDateString('en-GB') : "N/A";
                        return (
                          <tr key={index} className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a202c] text-gray-900 dark:text-white">
                            <td className="p-2 text-center">{staff.staffName}</td>
                            <td className="p-2 text-center">{staff.mobileNumber}</td>
                            <td className="p-2 text-center">{formattedDate}</td>
                            <td className="p-2 text-center">₹{staff.amount}</td>
                            <td className="p-2 text-center">{staff.amountPayType}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center p-4">No Data Available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-wrap items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">Rows Per Page</span>
                  <select
                    value={recordsPerPage}
                    onChange={(e) => {
                      setRecordsPerPage(Number(e.target.value));
                      setCurrentPage(1); // Reset to first page on change
                    }}
                    className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-gray-500 cursor-pointer"
                  >
                    {[5, 10, 20, 50, 100].map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <span>{(currentPage - 1) * recordsPerPage + 1}-{Math.min(currentPage * recordsPerPage, filteredData.length)} of {filteredData.length}</span>
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}`}
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(filteredData.length / recordsPerPage)}
                    className={`p-2 rounded ${currentPage === Math.ceil(filteredData.length / recordsPerPage) ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}`}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;