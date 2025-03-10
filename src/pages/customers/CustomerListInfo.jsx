import { useState, useEffect, Fragment } from "react";
import apiService from "../../services/appClient";
import IconListCheck from "../../components/Icon/IconListCheck";
import IconLayoutGrid from "../../components/Icon/IconLayoutGrid";
import IconSearch from "../../components/Icon/IconSearch";
import debounce from "lodash.debounce";
import { FaUserLarge } from "react-icons/fa6";

const CustomerListInfo = ({ apiUrl }) => {
  const [value, setValue] = useState("list");
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [sortField, setSortField] = useState("Id");
  const [sortDirection, setSortDirection] = useState("desc");

  
  const handleSearch = debounce((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, 500);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiService.post(apiUrl, {
          page: currentPage,
          pageSize: rowsPerPage,
          searchTerm, // Send search term to backend
          sortDirection,
          sortField,
        });

        if (response.data.isSuccess) {
          setCustomers(response.data.output.result || []);
          setTotalRows(response.data.output.rowCount || 0);
        } else {
          setCustomers([]);
          setTotalRows(0);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again.");
      }
      setLoading(false);
    };

    fetchData();
  }, [currentPage, rowsPerPage, searchTerm, sortField, sortDirection]);

  const selectedColumns = [
    "id",
    "customerNo",
    "firstName",
    "contactNo",
    "primaryAddress",
    "temporaryAddress",
    "occupation",
    "annualIncome",
    "isActive",
  ];

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">Customer List</h3>
        <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
          <button
            type="button"
            className={`btn btn-outline-primary p-2 ${value === "list" && "bg-primary text-white"}`}
            onClick={() => setValue("list")}
          >
            <IconListCheck />
          </button>
          <button
            type="button"
            className={`btn btn-outline-primary p-2 ${value === "grid" && "bg-primary text-white"}`}
            onClick={() => setValue("grid")}
          >
            <IconLayoutGrid />
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Customers"
              className="form-input py-2 pr-10"
              onChange={handleSearch}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary "
            >
              <IconSearch />
            </button>
          </div>
        </div>
      </div>

      {value === "list" && (
        <div className="table-responsive mt-5">
          <table className="table-striped table-hover w-full">
            <thead>
              <tr>
                {selectedColumns.map((col) => (
                  <th key={col} className="p-2 capitalize text-center">
                    {col === "firstName"
                      ? "Name"
                      : col === "primaryAddress"
                      ? "Permanent Address"
                      : col === "temporaryAddress"
                      ? "Current Address"
                      : col.replace(/([A-Z])/g, " $1").trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
            {loading ? (
              <tr>
                <td colSpan={selectedColumns.length + 1} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : customers.length > 0 ? (
              customers.map((item) => (
                <tr key={item.id}>
                  {selectedColumns.map((col) => (
                    <td key={col} className="p-2 text-center">
                      {col === "customerNo" ? (
                        <a
                          href={`/customerdetails/${item.id}`}
                          className="text-blue-500 underline hover:underline"
                        >
                          {item.customerNo || "N/A"}
                        </a>
                      ) : col === "firstName" ? (
                        (() => {
                          const fullName = `${item.firstName || ""} ${item.middleName || ""} ${item.lastName || ""}`.trim();
                          return fullName || "N/A";
                        })()
                      ) : (
                        item[col] !== undefined && item[col] !== null ? item[col].toString() : "N/A"
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={selectedColumns.length + 1} className="text-center p-4">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </div>
      )}

      {value === "grid" && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
          {customers.map((item) => (
            <a key={item.id} href={`/customerdetails/${item.id}`} className="block">
              <div className="bg-white shadow rounded-md p-4 text-center hover:shadow-lg transition">
                <div className="flex justify-center mb-3">
                  <div className="bg-gray-200 rounded-full p-4">
                    <FaUserLarge className="text-gray-500 text-5xl" />
                  </div>
                </div>
                {selectedColumns
                  .filter((col) => col !== "isActive" && col !== "primaryAddress")
                  .map((col) => (
                    <p key={col} className="text-gray-500">
                      <strong className="font-bold capitalize">
                        {col === "firstName"
                          ? "Name"
                          : col === "temporaryAddress"
                          ? "Current Address"
                          : col.replace(/([A-Z])/g, " $1").trim()}
                        :
                      </strong>{" "}
                      {col === "firstName" ? (
                        (() => {
                          const fullName = `${item.firstName || ""} ${item.middleName || ""} ${item.lastName || ""}`.trim();
                          return fullName || "N/A";
                        })()
                      ) : (
                        item[col] !== undefined && item[col] !== null ? item[col].toString() : "N/A"
                      )}
                    </p>
                  ))}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerListInfo;
