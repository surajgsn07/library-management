import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header"
import HeaderForSmallScreen from "./HeaderForSmallScreen";
const LandingPage = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <HeaderForSmallScreen/>
      <header className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              Welcome to the <span className="text-amber-500">Library Management System</span>
            </h1>
            <p className="mt-4 text-lg text-gray-700">
              Simplify the management of books, students, and admin tasks with our modern library system designed for efficiency and ease.
            </p>
            <div className="mt-6 flex justify-center md:justify-start">
              <a
                href="#features"
                className="px-6 py-3 bg-gray-900 text-white rounded-md shadow hover:bg-[#7d1d18] transition"
              >
                Learn More
              </a>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img
              src="https://pcte.edu.in/wp-content/uploads/2024/02/student-library-1-scaled.jpg"
              alt="Library Illustration"
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Why Choose Our <span className="text-gray-900">Library System</span>?
          </h2>
          <p className="mt-4 text-gray-700">
            Explore the features that make our system the perfect choice for your college library.
          </p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800">Efficient Inventory Management</h3>
              <p className="mt-2 text-gray-600">
                Easily manage book stocks, updates, and availability with real-time inventory tracking.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800">User-Friendly Interface</h3>
              <p className="mt-2 text-gray-600">
                A simple, intuitive design for both students and admins to ensure ease of use.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800">Seamless Book Issue/Return</h3>
              <p className="mt-2 text-gray-600">
                Automate issue and return processes while keeping track of due dates and fines.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800">Secure Login</h3>
              <p className="mt-2 text-gray-600">
                Separate secure login options for students and admins to ensure data privacy.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800">Detailed Reporting</h3>
              <p className="mt-2 text-gray-600">
                Generate reports on library usage, overdue books, and fines with just a few clicks.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800">Responsive Design</h3>
              <p className="mt-2 text-gray-600">
                Access the system from any device, be it desktop, tablet, or mobile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section id="login" className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Login</h2>
          <p className="mt-4 text-gray-700">
            Access your account below. Choose your role to proceed.
          </p>
          <div className="mt-12 flex flex-col md:flex-row justify-center gap-6">
            <Link
              to="/student-login"
              className="px-6 py-3 bg-gray-900 text-white rounded-md shadow hover:bg-[#7d1d18] transition"
            >
              Student Login
            </Link>
            <Link
              to="/admin-login"
              className="px-6 py-3 bg-amber-500 text-white rounded-md shadow hover:bg-gray-400 transition"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </section>


    </div>
  );
};

export default LandingPage;
