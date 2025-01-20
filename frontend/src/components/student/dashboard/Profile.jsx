import React from "react";
import {useSelector} from "react-redux"
import {Link} from "react-router-dom"

const ProfileComponent = () => {
  // Hardcoded demo user data
  const user = useSelector((state) => state.auth.user);
  if(!user){
    return (
    
    <>
    
    <div className="flex justify-center items-center py-4">loading...</div></>
    )
  }

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center py-10">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-3xl">
        {/* Profile Header */}
        <div className="sm:flex items-center mb-8">
          <img
            src={user.profilePic }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mr-8 border-4 border-gradient-to-r from-blue-500 to-indigo-600"
          />
          <div>
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              {user.name}
            </h2>
            <p className="text-xl text-gray-600 mt-2">{user.class}</p>
            <p className="text-lg text-gray-500 mt-1">Roll No: {user.rollNo}</p>
            <p className="text-lg text-gray-500 mt-1">Email: {user.email}</p>
            <p className="text-lg text-gray-500 mt-1">Phone: {user.phoneNo}</p>
            <p className="text-lg text-gray-500 mt-1">
              Fine: <span className="text-green-500">₹{user.fine}</span>
            </p>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex justify-between mt-8">
         
          <Link to="/student/dashboard" className="bg-red-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700 transition duration-300 shadow-md">
            View Reserved Books
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm font-light">
            Joined on {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
