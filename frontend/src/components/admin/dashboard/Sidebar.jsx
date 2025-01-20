import React, { useState } from 'react';
import { FaBars, FaTimes, FaBook, FaSearch, FaHistory, FaPlus, FaClipboardList,FaSignOutAlt ,FaRegLightbulb,FaUserPlus } from 'react-icons/fa'; // Icons for each menu item
import { Link, Outlet, useLocation, useNavigate  } from 'react-router-dom';
import RequestedBooks from './RequestedBooks';
import BorrowedBooks from './BorrowedBooks';
import History from './History';
import AddBook from './AddBook';
import SearchBooks from './SearchBook';
import { removeCookie } from '../../../axiosConfig/cookieFunc';
import { useDispatch } from 'react-redux';
import {logout} from "../../../store/authSlice" 

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to toggle sidebar on small screens
  const location = useLocation(); // Hook to get the current route for active link styling

  const dispatch = useDispatch();
  const navigate = useNavigate();


// Sidebar menu items array for the admin
const menuItems = [
    {
      title: 'Student Requests',
      path: '/admin/dashboard',
      icon: <FaClipboardList className="h-5 w-5" />,
    },
    {
      title: 'Borrowed Books',
      path: '/admin/dashboard/borrowed-books',
      icon: <FaBook className="h-5 w-5" />,
    },
    {
      title: 'Return Log',
      path: '/admin/dashboard/history',
      icon: <FaHistory className="h-5 w-5" />,
    },
    {
      title: 'Add New Book',
      path: '/admin/dashboard/add-new-book',
      icon: <FaPlus className="h-5 w-5" />,
    },
    {
      title: 'Search',
      path: '/admin/dashboard/search',
      icon: <FaSearch className="h-5 w-5" />,
    },
    {
      title: 'Book Suggestions',  // New menu item for Book Suggestions
      path: '/admin/dashboard/book-suggestions',
      icon: <FaRegLightbulb className="h-5 w-5" />, 
    },

  {
    title: 'Add Admin',  // New menu item for Add Admin
    path: '/admin/dashboard/add-admin',
    icon: <FaUserPlus className="h-5 w-5" />,  // You can use FaUserPlus or any other suitable icon
  },
        {
          title: "Logout",
          path: "/logout",
          icon: <FaSignOutAlt className="h-5 w-5" />,
        },
  ];

  // Function to toggle the sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex h-screen  bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 overflow-y-scroll z-40 text-white fixed lg:static lg:w-1/5 w-64 h-full p-5 transform transition-all duration-300 ease-in-out shadow-lg ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        style={{
          scrollbarWidth: 'none', // For Firefox
          msOverflowStyle: 'none', // For IE/Edge
        }}
      >
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            className="lg:hidden text-white focus:outline-none"
            onClick={toggleSidebar}
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>
        <ul className="space-y-6">
          {menuItems.map((item, index) => (
            <li key={index} 
            onClick={() => {
              if (item.path === "/logout") {
                removeCookie("accessToken");
                dispatch(logout());
                navigate("/");
              }
            }}
            className="border-b border-gray-400">
              <Link
                to={item.path}
                className={`flex items-center gap-4 px-4 py-2 rounded-md hover:bg-gray-700 transition ${
                  location.pathname === item.path ? 'bg-gray-700' : ''
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main content area */}
      <div className="flex-grow">
        {/* Top Navbar for small screens */}
        <div className="lg:hidden p-4 bg-gray-900 text-white shadow-md flex items-center justify-between">
        <img
        onClick={()=>navigate("/")} 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvWP-O8V_U9-giVM67Kal68utE1jPGE7kFmg&s" 
                    alt="Library Logo"
                    className="w-10 h-12 rounded-lg object-cover"
                  />
          <h1 onClick={()=>navigate("/")}  className="text-xl font-bold">Library System </h1>
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none"
          >
            {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
          </button>
        </div>

        {/* Main Content */}
        <div className="p-2 lg:ml-1/5 h-screen pb-20" style={{ overflow: 'scroll' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
