import React, { useState } from "react";
import axiosInstance from "../../../axiosConfig/axiosConfig";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const [formData, setFormData] = useState({
    rollno: "",
    name: "",
    course: "",
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [updateFormData, setUpdateFormData] = useState({
    email: "",
    phoneNo: "",
  });

  // Handle input changes for search form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle search submit
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const searchQuery = formData.rollno || formData.name || formData.course;

      if (!searchQuery) {
        setError("Please enter a search term.");
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get(`/student/search`, { params: formData });
      if (response.data) setUsers(response.data.users);
    } catch (err) {
      setError("Error fetching users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle remove user
  const handleRemoveUser = async (userId) => {
    try {
      const res = await axiosInstance.delete(`/student/${userId}`);
      if (res.data) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        toast.success("User removed successfully");
      }
    } catch (err) {
      console.error("Error removing user:", err);
    }
  };

  // Handle show details (open modal and set selected user)
  const handleShowDetails = (user) => {
    setSelectedUser(user);
    setUpdateFormData({
      email: user.email,
      phoneNo: user.phoneNo,
    });
    setIsModalOpen(true);
  };

  // Handle update form input changes
  const handleUpdateChange = (e) => {
    setUpdateFormData({
      ...updateFormData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle update form submission
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(`/student/update/${selectedUser._id}`, updateFormData);
      if (res.data) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === selectedUser._id ? { ...user, ...updateFormData } : user
          )
        );
        toast.success("User updated successfully");
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Error updating user. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Manage Users</h1>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        <input
          type="text"
          name="rollno"
          value={formData.rollno}
          onChange={handleChange}
          placeholder="Roll Number"
          className="p-3 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="p-3 border border-gray-300 rounded-md"
        />
        
        <select
                id="class"
                name="class"
                value={formData.course}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Course"
              >
                <option value="">Select course</option>
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
                <option value="MCA">MCA</option>
                
                <option value="B.Tech">BCA</option>
                <option value="M.Tech">B.Pharmacy</option>
                <option value="MCA">BBA</option>
                
                <option value="B.Tech">B.Com</option>
                <option value="M.Tech">FD</option>
                <option value="MCA">BAJMC</option>
              </select>
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-md col-span-1 sm:col-span-3 lg:col-span-1"
        >
          Search
        </button>
      </form>

      {/* Loading Spinner */}
      {loading && <div className="text-center text-blue-600">Loading...</div>}

      {/* Error Message */}
      {error && <div className="text-center text-red-600">{error}</div>}

      {/* Display Users */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="bg-white shadow-md p-4 rounded-lg hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">Roll No: {user.rollNo}</p>
              <p className="text-gray-600">Course: {user.class}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleShowDetails(user)}
                  className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md"
                >
                  Show Details
                </button>
                <button
                  onClick={() => handleRemoveUser(user._id)}
                  className="mt-4 bg-red-600 text-white py-2 px-4 rounded-md"
                >
                  Remove User
                </button>
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="text-center col-span-full">No users found.</p>
        )}
      </div>

      {/* Modal for User Details */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">User Details</h2>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Roll No:</strong> {selectedUser.rollNo}</p>
            <p><strong>Class:</strong> {selectedUser.class}</p>

            {/* Update Form */}
            <form onSubmit={handleUpdateUser} className="mt-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={updateFormData.email}
                  onChange={handleUpdateChange}
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Phone No</label>
                <input
                  type="text"
                  name="phoneNo"
                  value={updateFormData.phoneNo}
                  onChange={handleUpdateChange}
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;