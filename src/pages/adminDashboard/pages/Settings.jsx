import React, { useState } from "react";

const Settings = () => {
  const [formData, setFormData] = useState({
    name: "Admin Name",
    email: "admin@example.com",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // 🔒 TODO: Send updated data to backend
    console.log("Updated settings:", formData);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 lg:ml-56 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold font-ubuntu mb-6">Admin Settings</h2>

      <form
        onSubmit={handleSave}
        className="space-y-4 bg-white p-4 sm:p-6 rounded shadow-md"
      >
        {/* Profile Info */}
        <div>
          <h3 className="text-md font-semibold font-ubuntu mb-3">
            Profile Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-sm font-ubuntu text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 font-ubuntu text-sm p-1.5 rounded-sm"
              />
            </div>
            <div>
              <label className="block font-medium text-sm font-ubuntu text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 font-ubuntu text-sm p-1.5 rounded-sm"
              />
            </div>
          </div>
        </div>

        {/* Password Update */}
        <div>
          <h3 className="text-md font-semibold font-ubuntu mb-3">
            Change Password
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-sm font-ubuntu text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 p-1.5 rounded-sm"
              />
            </div>
            <div>
              <label className="block font-medium text-sm font-ubuntu text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 p-1.5 rounded-sm"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h3 className="text-md font-semibold font-ubuntu mb-3">
            Preferences
          </h3>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox h-3 w-3 text-black"
              />
              <span className="text-sm font-ubuntu">
                Receive Email Notifications
              </span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-sm font-ubuntu text-sm hover:bg-gray-800 transition"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
