import React, { useState } from "react";
import Header from "./Header";
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
  FaSyncAlt,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const Leadlist = () => {
  const [selected, setSelected] = useState("Lead List");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const totalRows = 500;
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  const handleSelection = (item) => {
    setSelected(item);
  };

  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const displayedRowsStart = (currentPage - 1) * rowsPerPage + 1;
  const displayedRowsEnd = Math.min(
    displayedRowsStart + rowsPerPage - 1,
    totalRows
  );

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const renderPageNumbers = () => {
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`w-8 h-8 rounded-full flex items-center justify-center font-medium transition ${
            currentPage === i
              ? "bg-red-200 text-red-700"
              : "border border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    product: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      icon: "success",
      title: "Lead added successfully",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      product: "",
    });
    setIsVisible(true);
  };

  return (
    <>
      <Header />
      <div className="flex flex-col lg:flex-row h-screen">
        <div className="w-full lg:w-1/5 bg-white text-gray-600 p-4 border-r border-gray-200">
          <div className="mb-6">
            <div
              className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
                selected === "Dashboard" ? "bg-red-500 text-white" : ""
              }`}
              onClick={() => {
                handleSelection("Lead List");
                navigate("/dashboard"); // Redirect to /Leadlist
              }}
            >
              <FaTachometerAlt />
              <h1 className="text-lg ">Dashboard</h1>
            </div>
          </div>
          <ul className="space-y-4">
            <li
              className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
                selected === "Lead List" ? "bg-red-500 text-white" : ""
              }`}
              onClick={() => handleSelection("Lead List")}
            >
              <FaUser />
              <span>Lead List</span>
            </li>
            <li>
              {/* Check if a submenu item is selected */}
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

              {/* Submenu with vertical and horizontal lines */}
              <ul className="relative ml-6 mt-2 pl-4">
                {/* Vertical line */}
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

        <div className="w-full lg:w-4/5 bg-gray-100 p-6">
          {isVisible && (
            <>
              <div className="flex flex-wrap items-center justify-end mb-4 gap-4">
                <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100">
                  <FaSyncAlt className="text-gray-600" />
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-500 text-white font-medium hover:bg-red-600"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  + Add Lead
                </button>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="flex flex-wrap items-center justify-between p-4">
                  <h2 className="text-xl ">Lead List</h2>
                  <div className="flex items-center border-gray-300 rounded bg-gray-100 p-2 w-full md:w-80">
                    <FaSearch className="text-gray-400 text-lg" />
                    <input
                      type="text"
                      placeholder="Search lead..."
                      className="bg-transparent border-none focus:outline-none ml-2 w-full text-gray-700"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-x-auto p-4">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-200 text-left">
                        <th className="p-2">Actions</th>
                        {/* <th className="p-2">ID</th> */}
                        <th className="p-2">Name</th>
                        <th className="p-2">Mobile Number</th>
                        <th className="p-2">Email Id</th>
                        <th className="p-2">Associate Name</th>
                        <th className="p-2">Products</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: rowsPerPage }).map((_, index) => {
                        const rowIndex = displayedRowsStart + index;
                        if (rowIndex > totalRows) return null;

                        return (
                          <tr key={index} className="border-b border-gray-200">
                            <td className="p-2 flex justify-evenly items-center">
                              <FaEdit className="text-blue-500 cursor-pointer" />
                              <FaUserPlus className="text-green-500 cursor-pointer" />
                              <FaTrashAlt className="text-red-500 cursor-pointer" />
                            </td>
                            {/* <td className="p-2 text-center">{rowIndex}</td> */}
                            <td className="p-2">User {rowIndex}</td>
                            <td className="p-2 text-center">9011337536</td>
                            <td className="p-2">user{rowIndex}@example.com</td>
                            <td className="p-2">Associate {rowIndex % 3}</td>
                            <td className="p-2">E Wealth, Finance...</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <div className="flex flex-wrap items-center justify-between p-4 border-t">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-700 font-medium">
                        Row Per Page
                      </span>
                      <select
                        value={rowsPerPage}
                        onChange={(e) => setRowsPerPage(Number(e.target.value))}
                        className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-gray-500 cursor-pointer"
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
                              : "text-gray-700"
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
                              : "text-gray-700"
                          }`}
                        >
                          <FaChevronRight />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Form Section */}
          {!isVisible && (
            <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen w-full">
              <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-5xl">
                <div className="flex items-center mb-4">
                  <FaArrowLeft
                    className="text-[#909090] text-xl cursor-pointer"
                    onClick={() => setIsVisible(true)} // Switch back to table view
                  />
                  <h1 className="text-2xl  ml-2">Add Lead</h1>
                </div>
                <hr />
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    <div className="relative">
                      <label
                        className="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-600"
                        htmlFor="firstName"
                      >
                        First name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-red-500"
                        placeholder="Enter first name"
                      />
                    </div>

                    <div className="relative">
                      <label
                        className="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-600"
                        htmlFor="lastName"
                      >
                        Last name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-red-500"
                        placeholder="Enter last name"
                      />
                    </div>

                    <div className="relative">
                      <label
                        className="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-600"
                        htmlFor="mobile"
                      >
                        Mobile no
                      </label>
                      <input
                        type="text"
                        name="mobile"
                        id="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-red-500"
                        placeholder="Enter mobile number"
                      />
                    </div>

                    <div className="relative col-span-1 md:col-span-2">
                      <label
                        className="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-600"
                        htmlFor="email"
                      >
                        Email ID
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-red-500"
                        placeholder="Enter email"
                      />
                    </div>

                    <div className="relative col-span-1">
                      <label
                        className="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-600"
                        htmlFor="product"
                      >
                        Select Products
                      </label>
                      <select
                        name="product"
                        id="product"
                        value={formData.product}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-red-500"
                      >
                        <option value="" disabled>
                          Select Products
                        </option>
                        <option value="Product A">Product A</option>
                        <option value="Product B">Product B</option>
                        <option value="Product C">Product C</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-center mt-6 space-x-4">
                    <button
                      type="button"
                      className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md shadow hover:bg-gray-300"
                      onClick={() => setIsVisible(true)} // Switch back to table view
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-red-500 text-white py-2 px-6 rounded-md shadow hover:bg-red-600"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Leadlist;
