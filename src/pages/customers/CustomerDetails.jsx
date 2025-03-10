import { Tab } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Select from "react-select";
import { useParams } from "react-router-dom";
import IconUserPlus from "../../components/Icon/IconUserPlus"
import IconPhoneCall from "../../components/Icon/IconPhoneCall"
import IconUser from "../../components/Icon/IconUser"
import IconMapPin from "../../components/Icon/IconMapPin"
import IconPhone from "../../components/Icon/IconFolder"
import IconInbox from "../../components/Icon/IconInbox"
import IconClipboardText from "../../components/Icon/IconClipboardText"
import { FaUserLarge } from "react-icons/fa6";
import customerService from "../../services/Customer/customerService";
import productService from "../../services/Product/productService";
import subProductService from "../../services/SubProduct/subProductService"
import productSaleService from "../../services/ProductSale/productSaleService"
import AlertService from "../../utils/AlertService";
import { Dialog, Transition } from "@headlessui/react";
import SelectStyles from "../../utils/SelectStyles";


const CustomerDetails = () => {
  const { id } = useParams();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [customer, setCustomer] = useState([]);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [subProducts, setSubProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [addProductSaleModal, setAddProductSaleModal] = useState(false);
  const [dynamicTabs, setDynamicTabs] = useState([]);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await customerService.getCustomerById(id);
        if (response.data.isSuccess) {
          const customerData = response.data.output;
          setCustomer({
            ...customerData,
            id: customerData.Id,
            associateId: customerData.AssociatId,
            customerName: `${customerData.FirstName} ${customerData.MiddleName || ""} ${customerData.LastName}`,
          });
        } else {
          setError("Failed to fetch customer details");
        }
      } catch (error) {
        setError("Error fetching data");
        console.error("Error fetching customer details:", error);
      }
    };
  
    if (id) fetchCustomerDetails();
  }, [id]);


  
  useEffect(() => {
    const fetchCustomerProducts = async () => {
      try {
        const response = await productSaleService.getSubProductListByProduct(id);
  
        if (response.data?.isSuccess) {
          const productSales = response.data.output || [];
  
          // Filter products that contain subProduct and it's not empty
          const filteredProducts = productSales.filter(
            (product) => product.subProduct && product.subProduct.length > 0
          );
  
          const tabs = filteredProducts.map((product) => ({
            label: product.productName,
            content: (
              <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-primary">Sub Products:</h3>
              
                <div className="overflow-x-auto mt-2">
                  <div className="max-w-4xl mx-auto"> {/* Adjust max-w-md to other values like max-w-lg if needed */}
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-200 text">
                          <th className="border border-gray-300 px-4 py-2 text-center">Sub Product Name</th>
                          <th className="border border-gray-300 px-4 py-2 text-center">Description</th>
                          <th className="border border-gray-300 px-4 py-2 text-center">Total Sale Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.subProduct.map((sub) => (
                          <tr key={sub.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 text-center text-primary font-semibold">
                              {sub.subProductName}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center text-gray-700">
                              {sub.description}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center text-gray-700">
                              {sub.totalSaleAmount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ),
          }));
          
  
          setDynamicTabs(tabs);
        } else {
          console.error("Failed to fetch customer-related products:", response.data);
        }
      } catch (error) {
        console.error("Error fetching customer-related products:", error);
      }
    };
  
    if (id) fetchCustomerProducts();
  }, [id]);
  

  
  const handleOpenModal = async () => {
    try {
      const response = await productService.getAllProducts();
      if (response.data?.isSuccess) {
        setProducts(response.data.output || []); // Ensure array format
      } else {
        console.error("Failed to fetch products:", response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setAddProductSaleModal(true);
  };

  
  const handleAddService = async (e) => {
    e.preventDefault();
  
    const requestData = {
      associateId: customer.associateId,
      associateName: customer.associateName || null,
      createdBy: 0, // Set proper user ID if applicable
      customerId: customer.id,
      customerName: customer.customerName,
      productId: customer.productId,
      productName: customer.productName,
      subProductId: customer?.subProductId ? customer.subProductId : 0,
      totalSaleAmount: customer.totalSaleAmount,
      incentiveEarned: customer.incentiveEarned,
      isActive: true, 
      status: 1, // Set appropriate status
    };
  
    try {
      const response = await productSaleService.createProductSale(requestData);
      if (response.data?.isSuccess) {
        AlertService.success("Service added successfully!");
        setAddProductSaleModal(false);
      } else {
        AlertService.error("Failed to add service");
        console.error("Error adding service:", response.data);
      }
    } catch (error) {
      AlertService.error("Error adding service");
      console.error("Error:", error);
    }
  };
  
  

  const handleUpdateCustomer = async () => {
    try {
      const response = await customerService.updateCustomer(customer.id, customer);
      if (response.status === 200) {
        AlertService.success("Customer updated successfully");
        setIsEditing(false); // Exit edit mode
      } else {
        console.error("Update failed:", response);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleChange = (e, field) => {
    setCustomer({ ...customer, [field]: e.target.value });
  };
  

  const handleProductChange = async (selectedOption) => {
    if (!selectedOption) return;
  
    const productId = selectedOption.value;
  
    try {
      const response = await productService.getProductById(productId);
  
      if (response.data?.isSuccess) {
        const productDetails = response.data.output;
        
        setCustomer((prev) => ({
          ...prev,
          productId,
          productName: productDetails?.productName || "",
          subProductId: "",
          incentiveType: productDetails?.incentiveType || "", // Store incentiveType
          incentivePercentage: productDetails?.incentivePercent || 0,
        }));
      } else {
        console.error("Failed to fetch product details:", response.data);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  
    try {
      const subProductResponse = await subProductService.getSubProductByProductId(productId);
      if (subProductResponse.data?.isSuccess) {
        setSubProducts(subProductResponse.data.output || []);
      } else {
        console.error("Failed to fetch sub-products:", subProductResponse.data);
        setSubProducts([]);
      }
    } catch (error) {
      console.error("Error fetching sub-products:", error);
      setSubProducts([]);
    }
  };
  

  useEffect(() => {
  }, [subProducts]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    setCustomer((prev) => {
      const updatedCustomer = { ...prev, [name]: value };
  
      if (name === "totalSaleAmount") {
        const saleAmount = parseFloat(value) || 0; // ✅ Handles any input
        const percent = parseFloat(prev.incentivePercentage) || 0;
        let incentive = 0;
  
        if (prev.incentiveType === "1") {  

          incentive = (saleAmount * percent) / 100;
        } else if (prev.incentiveType === "2") {  
          
          incentive = percent;
        }
  
        updatedCustomer.incentiveEarned = incentive.toFixed(2);
      }
  
      return updatedCustomer;
    });
  };
  

  const handleModalClose = () => setAddProductSaleModal(false); // Close modal


  return (
    <div className="p-4 mt-4 border bg-gray-100">
      <div className="bg-white p-4 rounded-lg shadow-lg min-h-[400px] flex flex-col">
        {/* Customer Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-6xl">
              <FaUserLarge />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-1">
                {customer ? customer.FirstName : "Loading..."} {customer ? customer.MiddleName : "Loading..."} {customer ? customer.LastName : "Loading..."}
              </h2>
              <span className="font-semibold mb-2 p-1 px-2 bg-gray-500 rounded-md text-white">
                {customer ? customer.CustomerNo : "Loading..."}
              </span>
              <p className="text-gray-600 mt-2 flex items-center gap-1">
                <IconPhoneCall className="text-red-500" /> {customer ? customer.ContactNo : "Loading..."}
              </p>
              <p className="text-gray-600 flex mt-1 items-center gap-1">
                <IconMapPin className="text-red-500" /> {customer ? customer.TemporaryAddress : "Loading..."}
              </p>

              {/* Add Service Button for Small Screens */}
              <div className="sm:hidden mt-2">
                <button
                  className="btn btn-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-red-600 w-full justify-center"
                  onClick={handleOpenModal}
                >
                  <IconUserPlus /> Add Service
                </button>
              </div>
            </div>
          </div>

          {/* Add Service Button for Larger Screens */}
          <div className="hidden sm:block">
            <button
              className="btn btn-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-red-600"
              onClick={handleOpenModal}
            >
              <IconUserPlus /> Add Service
            </button>
          </div>
        </div>

        {/* Tabs Section */}
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <div className="overflow-x-auto whitespace-nowrap scrollbar-hide ">
            <Tab.List className="mt-3 mr-3 flex border-b border-white-light dark:border-[#191e3a]">
              {/* Static Tabs */}
              {[
                { label: "Profile", icon: <IconUser className="w-5 h-5 ltr:mr-2 rtl:ml-2" /> },
                { label: "Related Task", icon: <IconClipboardText className="w-5 h-5 ltr:mr-2 rtl:ml-2" /> },
                { label: "Documents", icon: <IconPhone className="w-5 h-5 ltr:mr-2 rtl:ml-2" /> },
              ].map((tab, index) => (
                <Tab key={index} as="button" className={({ selected }) => `${selected ? '!border-white-light !border-b-white text-danger !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''} -mb-[1px] flex items-center border border-transparent p-3.5 py-2 hover:text-danger` }>
                  {tab.icon}
                  {tab.label}
                </Tab>
              ))}
            
              {/* Dynamic Tabs */}
              {dynamicTabs.map((tab, index) => (
                <Tab key={`dynamic-${index}`} as="button" className={({ selected }) => `${selected ? '!border-white-light !border-b-white text-danger !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''} -mb-[1px] flex items-center border border-transparent p-3.5 py-2 hover:text-danger` }>
                  <IconInbox className="w-5 h-5 ltr:mr-2 rtl:ml-2" /> {tab.label}
                </Tab>
              ))}
            </Tab.List>


          </div>

          {/* Tab Content */}
          <Tab.Panels className="p-4 mt-0 border rounded-b bg-gray-50 min-h-[300px] border-gray-200">
            {/* Profile Tab */}
            <Tab.Panel>
              <div className="grid grid-cols-3 gap-4">
                {customer ? (
                  [
                    { label: "First Name", field: "FirstName", value: customer.FirstName },
                    { label: "Middle Name", field: "MiddleName", value: customer.MiddleName || "-" },
                    { label: "Last Name", field: "LastName", value: customer.LastName },
                    { label: "Contact No", field: "ContactNo", value: customer.ContactNo },
                    { label: "Date Of Birth", field: "DateOfBirth", value: customer.DateOfBirth },
                    { label: "Current Address", field: "PrimaryAddress", value: customer.PrimaryAddress },
                    { label: "Permanent Address", field: "TemporaryAddress", value: customer.TemporaryAddress },
                    { label: "Place Of Birth", field: "PlaceOfBirth", value: customer.PlaceOfBirth },
                    { label: "Occupation", field: "Occupation", value: customer.Occupation },
                    { label: "Education", field: "Education", value: customer.Education },
                    { label: "Annual Income", field: "AnnualIncome", value: customer.AnnualIncome },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="text-gray-600 text-sm">{field.label}</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full form-input rounded px-3 py-2 mt-1"
                          value={field.value}
                          onChange={(e) => handleChange(e, field.field)}
                        />
                      ) : (
                        <input
                          type="text"
                          className="w-full form-input rounded px-3 py-2 mt-1"
                          value={field.value}
                          readOnly
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <p>Loading profile details...</p>
                )}
              </div>
              {/* Edit Profile Button */}
              <div className="mt-6 flex justify-end">
                <button
                  className="btn btn-primary text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
                {isEditing && (
                  <button
                    className="btn btn-success text-white px-4 py-2 ml-2 rounded hover:bg-green-600"
                    onClick={handleUpdateCustomer}
                  >
                    Update
                  </button>
                )}
              </div>
            </Tab.Panel>

            {/* Product List Tab with Dropdown */}
            <Tab.Panel>
              
            </Tab.Panel>

            {/* Documents Tab */}
            <Tab.Panel>
              <div className="text-gray-700">No documents uploaded yet.</div>
            </Tab.Panel>

            {/* Dynamic Product Tabs */}
            {dynamicTabs.map((tab, index) => (
              <Tab.Panel key={`panel-${index}`}>
                {tab.content}
              </Tab.Panel>
            ))}

          </Tab.Panels>
        </Tab.Group>

        {/* Add Service Modal */}
        <Transition appear show={addProductSaleModal} as={Fragment}>
          <Dialog as="div" open={addProductSaleModal} onClose={handleModalClose} className="relative z-[51]">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-[black]/60" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center px-4 py-8">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                    <button
                      type="button"
                      onClick={handleModalClose}
                      className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                    >
                      ✖
                    </button>
                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                      <h2 className="text-lg font-medium">Add Service</h2>
                    </div>
                    <div className="p-5">
                    <form onSubmit={handleAddService}>
                     
     
                     {/* Other Fields Remain as They Are */}

                     <div className="mb-5">
                       <label htmlFor="productId" className="block">Product</label>
                       <Select
                         id="productId"
                         name="productId"
                         styles={SelectStyles}
                         options={products.map((product) => ({
                           value: product.id,      // Ensure `value` is correct
                           label: product.productName,
                         }))}
                         value={
                           products.find((p) => p.id === customer?.productId) 
                             ? { value: customer.productId, label: products.find((p) => p.id === customer?.productId)?.productName }
                             : null
                         }
                         onChange={handleProductChange}
                         placeholder="Select a Product..."
                         className="text-sm p-1 font-semibold"
                         isSearchable
                       />
                     </div>

                     <div className="mb-5">
                       <label htmlFor="subProductId" className="block">Sub Product</label>
                       
                       <Select
                         id="subProductId"
                         name="subProductId"
                         styles={SelectStyles}
                         options={subProducts?.map((subProduct) => ({
                           value: subProduct.id,
                           label: subProduct.subProductName, 
                         })) || []} // Ensure fallback to empty array
                         value={
                           subProducts.find((sp) => sp.id === customer?.subProductId)
                             ? { value: customer.subProductId, label: subProducts.find((sp) => sp.id === customer?.subProductId)?.subProductName }
                             : null
                         }
                         onChange={(selectedOption) =>
                           setCustomer((prev) => ({
                             ...prev,
                             subProductId: selectedOption?.value || "",
                           }))
                         }
                         placeholder="Select a Sub Product..."
                         className="text-sm p-1 font-semibold"
                         isSearchable
                       />

                     </div>


                     <div className="mb-5">
                       <label htmlFor="totalSaleAmount" className="block">Total Sale Amount</label>
                       <input
                         id="totalSaleAmount"
                         type="number"
                         name="totalSaleAmount"
                         placeholder="Enter Total Sale Amount"
                         value={customer?.totalSaleAmount || ""}
                         onChange={handleInputChange}  
                         className="form-input"
                         required
                       />
                     </div>


                     <div className="mb-5">
                       <label htmlFor="incentiveEarned" className="block">Incentive Earned</label>
                       <input
                         id="incentiveEarned"
                         type="text"
                         name="incentiveEarned"
                         value={customer?.incentiveEarned || ""}
                         className="form-input"
                         readOnly
                       />
                     </div>
                  

                     <div className="ltr:text-right rtl:text-left flex justify-end items-center mt-8">
                       <button
                         type="button"
                         className="btn btn-outline-danger"
                         onClick={handleModalClose}
                       >
                         Cancel
                       </button>
                       <button
                         type="submit"
                         className="btn btn-primary ltr:ml-4 rtl:mr-4"
                       >
                         Add
                       </button>
                     </div>
                   </form>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default CustomerDetails;