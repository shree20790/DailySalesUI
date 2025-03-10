import React, { useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import rupee from "../assets/rupee.png";
import team from "../assets/team.png";
import customerReview from "../assets/customer-review.png";
import money from "../assets/money.png";
import box from "../assets/box.png";
import {
  FaTachometerAlt,
  FaUser,
  FaUsers,
  FaRupeeSign,
  FaUserFriends,
  FaBox,
  FaMoneyBillWave,
  FaUserPlus,
  FaEdit,
  FaTrashAlt,
  FaChevronDown,
  FaSearch,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const Dashboard = () => {
  const [selected, setSelected] = useState("Dashboard");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const totalRows = 500;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const navigate = useNavigate();
  const [value, setValue] = React.useState(dayjs('2022-04-17'));


  const handleSelection = (item) => {
    setSelected(item);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prev) =>
      direction === "next"
        ? Math.min(prev + 1, totalPages)
        : Math.max(prev - 1, 1)
    );
  };

  const displayedRowsStart = (currentPage - 1) * rowsPerPage + 1;
  const displayedRowsEnd = Math.min(currentPage * rowsPerPage, totalRows);

  return (
    <>
      <Header />
      <div className="flex flex-col lg:flex-row h-screen">
        <div className="w-full lg:w-1/5 bg-[#FFFFFF] text-[#606060] p-4 border-r border-gray-200">
          <div className="mb-6">
            <div
              className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
                selected === "Dashboard" ? "bg-red-500 text-white" : ""
              }`}
              onClick={() => handleSelection("Dashboard")}
            >
              <FaTachometerAlt />
              <h2 className="text-lg ">Dashboard</h2>
            </div>
          </div>
          <ul className="space-y-4">
            <li
              className={`flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-gray-100 ${
                selected === "Lead List" ? "bg-red-500 text-white" : ""
              }`}
              onClick={() => {
                handleSelection("Lead List");
                navigate("/leadlist"); // Redirect to /Leadlist
              }}
            >
              <FaUser />
              <span>Lead List</span>
            </li>
            <li>
              <div
                className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
                  [
                    "Associates",
                    "Associates Role",
                    "Customers",
                    "Products",
                    "Bonus Master",
                  ].includes(selected)
                    ? "text-red-500"
                    : ""
                }`}
                onClick={() => handleSelection("Users Master")}
              >
                <FaUsers />
                <span>Users Master</span>
              </div>

              <ul className="relative ml-6 mt-2 pl-4">
                <div className="absolute left-0 top-0 h-full w-[1px] bg-gray-300"></div>

                {[
                  "Associates",
                  "Associates Role",
                  "Customers",
                  "Products",
                  "Bonus Master",
                ].map((item) => (
                  <li
                    key={item}
                    className={`relative flex items-center p-2 cursor-pointer  ${
                      selected === item
                        ? "bg-red-500 text-white rounded-lg"
                        : ""
                    }`}
                    onClick={() => handleSelection(item)}
                  >
                    {/* Horizontal line */}
                    <span className="absolute -left-4 w-4 h-[1px] bg-gray-300"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>

        <div className="w-full lg:w-4/5 bg-gray-100 p-6 overflow-auto">
          <div className="w-full p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-yellow-100 p-4 rounded-lg shadow">
                <h2 className="text-sm text-[#606060]">Incentive Balance</h2>
                <div className="flex justify-between mt-3 items-center">
                  <p className="text-2xl font-semibold">₹23,200</p>
                  <img
                    src={rupee}
                    alt="Rupee Icon"
                    className="w-10 h-10 ml-auto"
                  />
                </div>
              </div>
              <div className="bg-pink-100 p-4 rounded-lg shadow">
                <h2 className="text-sm text-[#606060]">Total Leads</h2>
                <div className="flex justify-between mt-3 items-center">
                  <p className="text-2xl font-semibold">524</p>
                  <img
                    src={team}
                    alt="Rupee Icon"
                    className="w-10 h-10 ml-auto"
                  />
                </div>
              </div>

              <div className="bg-blue-100  p-4 rounded-lg shadow">
                <h2 className="text-sm text-[#606060]">Total Customers</h2>
                <div className="flex justify-between mt-3 items-center">
                  <p className="text-2xl font-semibold">20,000</p>
                  <img
                    src={customerReview}
                    alt="Rupee Icon"
                    className="w-10 h-10 ml-auto"
                  />
                </div>
              </div>

              <div className="bg-[#DCFFD7]  p-4 rounded-lg shadow">
                <h2 className="text-sm text-[#606060]"> Total Incentive</h2>
                <div className="flex justify-between mt-3 items-center">
                  <p className="text-2xl font-semibold">₹55,050</p>
                  <img
                    src={money}
                    alt="Rupee Icon"
                    className="w-10 h-10 ml-auto"
                  />
                </div>
              </div>

              <div className="bg-[#FFEAD7] p-4 rounded-lg shadow">
                <h2 className="text-sm text-[#606060]"> Total Incentive</h2>
                <div className="flex justify-between mt-3 items-center">
                  <p className="text-2xl font-semibold">₹55,050</p>
                  <img
                    src={box}
                    alt="Rupee Icon"
                    className="w-10 h-10 ml-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="flex flex-col sm:flex-row items-center justify-between p-4">
              <h2 className="text-xl "></h2>
              {/* <div className="flex space-x-2 mt-2 sm:mt-0">
                <input
                  type="date"
                  className="border border-gray-300 rounded p-2"
                />
                <input
                  type="date"
                  className="border border-gray-300 rounded p-2"
                />
              </div> */}

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker", "DatePicker"]}>
                  <DatePicker
                    label="From"
                    defaultValue={dayjs("2022-04-17")}
                  />
                  <DatePicker
                    label="To"
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
            <div className="flex flex-col lg:flex-row justify-between items-center mb-2 mt-2 p-4 space-y-4 lg:space-y-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {["Country", "Category", "Seller name", "Buyer name"].map(
                  (placeholder, index) => (
                    <div key={index} className="relative">
                      <span className="absolute inset-y-0 left-2 flex items-center">
                        <FaSearch className="text-gray-400" />
                      </span>
                      <input
                        type="text"
                        placeholder={placeholder}
                        className="w-full pl-8 pr-8 border border-gray-300 rounded p-2"
                      />
                      <span className="absolute inset-y-0 right-2 flex items-center">
                        <FaChevronDown className="text-gray-400" />
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-auto p-4">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-2 text-center">Action</th>
                    {/* <th className="p-2">Rank</th> */}
                    <th className="p-2">Product Name</th>
                    <th className="p-2 text-center">Impressions</th>
                    <th className="p-2 text-center">Enquiries</th>
                    <th className="p-2">Top Regions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: rowsPerPage }).map((_, index) => {
                    const rowIndex = displayedRowsStart + index;
                    if (rowIndex > totalRows) return null;

                    return (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="p-2 flex justify-center space-x-4">
                          <FaEdit className="text-blue-500 cursor-pointer" />
                          <FaUserPlus className="text-green-500 cursor-pointer" />
                          <FaTrashAlt className="text-red-500 cursor-pointer" />
                        </td>
                        {/* <td className="p-2 text-center">{rowIndex}</td> */}
                        <td className="p-2">
                          Military Boonie Hat - Woodland {rowIndex}
                        </td>
                        <td className="p-2 text-center">
                          {1000 - rowIndex * 2}
                        </td>
                        <td className="p-2 text-center">{50 - rowIndex}</td>
                        <td className="p-2">India</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">Show</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
                  >
                    {[10, 20, 50, 100].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <span>
                    {displayedRowsStart}-{displayedRowsEnd} of {totalRows}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange("prev")}
                      disabled={currentPage === 1}
                      className={`p-2 rounded ${
                        currentPage === 1
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-red-500"
                      }`}
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={() => handlePageChange("next")}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded ${
                        currentPage === totalPages
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-red-500"
                      }`}
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
    </>
  );
};

export default Dashboard;
