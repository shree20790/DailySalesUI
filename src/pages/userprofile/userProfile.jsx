import React, { useEffect, useState } from "react";
import userService from "../../services/User/userService";
import changePasswordService from "../../services/ChangePassword/changePassword";
import { getUserData } from "../../utils/userData";
import { FaPhoneAlt, FaMapMarkerAlt, FaUserEdit, FaSave, FaLock } from "react-icons/fa";
import { FaUserLarge } from "react-icons/fa6";

const UserProfile = () => {
  const [user, setUser] = useState({
    id: "",
    firstName: "",
    middleName: "",
    lastName: "",
    contactNo: "",
    email: "",
    dateOfBirth: "",
    currentAddress: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = getUserData();
        const response = await userService.getUserById(user?.userId);
        if (response.data.isSuccess) {
          setUser(response.data.output);
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);



  const handleEditProfile = () => setIsEditing(true);

  const handleSaveProfile = async () => {
    try {
      const response = await userService.updateUser(user);
      if (response.data.isSuccess) {
        AlertService.warning("Profile updated successfully!");
        setIsEditing(false);
      } else {
        AlertService.warning("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      AlertService.warning("Error updating profile.");
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("New password and confirm password do not match!");
      return;
    }
  
    try {
      const user = getUserData(); // Get logged-in user's ID
      if (!user?.userId) {
        setMessage("User not found. Please log in again.");
        return;
      }
  
      console.log("Sending request to API...");
      
      // Await API response
      const response = await changePasswordService.updateChangePassword({
        userId: user.userId,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
  
      // Debugging - Check if response is received
      
      if (!response || !response.data) {
        setMessage("No response from server. Please try again.");
        return;
      }

  
      if (response.data && response.data.isSuccess) {
        console.log("Password updated successfully!");
        setMessage("Password updated successfully!");
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setActiveTab("profile");
      } else {
        setMessage(response.data?.message || "Failed to update password.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage("An error occurred. Please check the console for details.");
    }
  };
    
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;

  return (
    <div className="bg-white p-6">
      {/* Profile Header */}
      <div className="bg-gray-100 p-6 rounded-md shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-3xl">
            <FaUserLarge />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">
              {user.firstName} {user.middleName} {user.lastName}
            </h2>
            {/* <p className="text-gray-600 flex items-center">
              <FaPhoneAlt className="mr-2 text-red-500" /> {user.contactNo}
            </p>
            <p className="text-gray-600 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-red-500" /> {user.currentAddress}
            </p> */}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-50 flex border-b mt-6">
        {["Profile", "Password"].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 text-center font-bold ${
              activeTab === tab.toLowerCase()
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab(tab.toLowerCase())}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Profile Form */}
      {activeTab === "profile" && (
        <div className="bg-grey-100 p-6 rounded-md shadow-md mt-4">
          <div className="bg-grey-100 grid grid-cols-2 gap-6">
            {[
              { label: "First Name", key: "firstName" },
              { label: "Middle Name", key: "middleName" },
              { label: "Last Name", key: "lastName" },
              { label: "Email", key: "email", type: "email" },
              { label: "Contact No", key: "contactNo" },
              { label: "Date Of Birth", key: "dateOfBirth", type: "date" },
              { label: "Current Address", key: "currentAddress" },
            ].map(({ label, key, type = "text" }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-600">{label}</label>
                <input
                  type={type}
                  name={key}
                  value={user[key]}
                  onChange={handleChange}
                  className="w-full p-2 form-input border-gray-300 rounded-md"
                  readOnly={!isEditing}
                />
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-6">
            {isEditing ? (
              <>
                <button
                  className="btn btn-primary text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success text-white px-4 py-2 ml-2 rounded hover:bg-green-600"
                  onClick={handleSaveProfile}
                >
                  Save
                </button>
              </>
            ) : (
              <button
                className="py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-600 flex items-center"
                onClick={handleEditProfile}
              >
                 Edit Profile
              </button>
            )}
          </div>
        </div>
      )}

      {/* Password Change Form */}
  
      {activeTab === "password" && (
        <div className="bg-grey-100 p-6 rounded-md shadow-md mt-4 flex justify-center">
          <div className="w-1/3">
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: "Old Password", key: "oldPassword" },
                { label: "New Password", key: "newPassword" },
                { label: "Confirm Password", key: "confirmPassword" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-600">{label}</label>
                  <input
                    type="password"
                    name={key}
                    value={passwordData[key]}
                    onChange={handlePasswordChange}
                    className="w-full p-2 form-input border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>

            {/* Message */}
            {message && <p className="text-center text-sm mt-2 text-red-500">{message}</p>}

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button className=" btn btn-primary text-white px-4 py-2 rounded hover:bg-red-600" onClick={() => setActiveTab("profile")}>
                Cancel
              </button>
              <button className="py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700" onClick={handleUpdatePassword}>
                 Update 
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
