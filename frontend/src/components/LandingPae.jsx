import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import HeaderForSmallScreen from "./HeaderForSmallScreen";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../axiosConfig/axiosConfig";
import { validateDateNotOlderThanToday } from "../utils/Validation";
import { FaSpinner } from "react-icons/fa";

const LandingPage = () => {
  const user = useSelector((state) => state.auth.user);
  const type = useSelector((state) => state.auth.type);

  const [comicBooks, setComicBooks] = useState([]);
  const [adventureBooks, setAdventureBooks] = useState([]);
  const [classicBooks, setClassicBooks] = useState([]);

  const [selectedBook, setselectedBook] = useState(null);
  const [reserveModalOpen, setReserveModalOpen] = useState(false);
  const [returnData, setreturnData] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  const handleReserveBook = (book) => {
    if (!user) {
      toast.error("Please login to reserve a book");
      navigate("/student/login");
      return;
    }
    setselectedBook(book);
    setReserveModalOpen(true);
  };

  const handleConfirmReserve = (e) => {
    e.stopPropagation();
    if (!returnData) {
      toast.error("Please enter a return date");
      return;
    }

    if (validateDateNotOlderThanToday(returnData) === false) {
      toast.error("Please enter a valid return date");
      return;
    }

    try {
      const response = axiosInstance.post("/issue/request", {
        expectedReturnDate: returnData,
        bookId: selectedBook._id,
      });
      if (response.data) {
        toast.success("Book reserved successfully");
        setReserveModalOpen(false);
      }
    } catch (error) {
      console.log("error  : ", error);
      toast.error("Error reserving book");
    }
  };

  const fetchBooks = async (genre) => {
    try {
      setloading(true);
      const response = await axiosInstance.get(`/book/genre/${genre}`);
      if (response.data) {
        if (genre === "Comic") {
          setComicBooks(response.data.books);
        } else if (genre === "Adventure") {
          setAdventureBooks(response.data.books);
        } else if (genre === "Classic") {
          setClassicBooks(response.data.books);
        }
      }
    } catch (error) {
      console.log("error : ", error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchBooks("Comic");
    fetchBooks("Adventure");
    fetchBooks("Classic");
  }, []);

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <HeaderForSmallScreen />
      <header className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              Welcome to the{" "}
              <span className="text-amber-500">Library Management System</span>
            </h1>
            <p className="mt-4 text-lg text-gray-700">
              Simplify the management of books, students, and admin tasks with
              our modern library system designed for efficiency and ease.
            </p>
            <div className="mt-6 flex justify-center md:justify-start">
              <a
                href="#features"
                className="px-6 py-3 bg-gray-900 text-white rounded-md shadow hover:bg-amber-500 transition"
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

      {/* Dashboard Access Section */}
      {user && (
        <section id="dashboard-access" className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome Back, {user.name}!
            </h2>
            <p className="mt-4 text-gray-700">
              Access your dashboard to manage your tasks and explore more
              features.
            </p>
            <div className="mt-6">
              <Link
                to={`${
                  type === "admin" ? "/admin/dashboard" : "/student/dashboard"
                }`}
                className="px-6 py-3 bg-amber-500 text-white rounded-md shadow hover:bg-gray-400 transition"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Why Choose Our <span className="text-gray-900">Library System</span>
            ?
          </h2>
          <p className="mt-4 text-gray-700">
            Explore the features that make our system the perfect choice for
            your college library.
          </p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Efficient Inventory Management
              </h3>
              <p className="mt-2 text-gray-600">
                Easily manage book stocks, updates, and availability with
                real-time inventory tracking.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800">
                User-Friendly Interface
              </h3>
              <p className="mt-2 text-gray-600">
                A simple, intuitive design for both students and admins to
                ensure ease of use.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Seamless Book Issue/Return
              </h3>
              <p className="mt-2 text-gray-600">
                Automate issue and return processes while keeping track of due
                dates and fines.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Secure Login
              </h3>
              <p className="mt-2 text-gray-600">
                Separate secure login options for students and admins to ensure
                data privacy.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Detailed Reporting
              </h3>
              <p className="mt-2 text-gray-600">
                Generate reports on library usage, overdue books, and fines with
                just a few clicks.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Responsive Design
              </h3>
              <p className="mt-2 text-gray-600">
                Access the system from any device, be it desktop, tablet, or
                mobile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comic Books Section */}
      <section id="comic-books" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Comic Books Collection
          </h2>
          <p className="mt-4 text-gray-700">
            Explore our latest comic book additions!
          </p>
          <div className="relative mt-12">
            <div
              className="overflow-x-auto whitespace-nowrap scroll-smooth overflow-hidden "
              style={{
                msOverflowStyle: "none" /* IE and Edge */,
                scrollbarWidth: "none" /* Firefox */,
              }}
            >
              {loading && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <FaSpinner className="animate-spin" />
                </div>
              )}

              {comicBooks.map((book) => (
                <div
                  key={book._id}
                  className="inline-block w-64 overflow-hidden bg-white shadow-lg rounded-lg mx-2 p-6"
                >
                  <img
                    src={"https://placehold.co/600x400?text=" + book.title}
                    alt={book.title}
                    className="w-full h-64 object-cover rounded-t-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-800">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 mt-2">by {book.author}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-gray-500">
                      Available: {book.quantities}
                    </span>
                    <button
                      onClick={() => handleReserveBook(book)}
                      className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition"
                      disabled={book.quantities === 0}
                    >
                      {book.quantities > 0 ? "Reserve" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Adventure Books Section */}
      <section id="comic-books" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Adventure Books Collection
          </h2>
          <p className="mt-4 text-gray-700">
            Explore our latest adventure book additions!
          </p>
          <div className="relative mt-12">
            <div
              className="overflow-x-auto whitespace-nowrap scroll-smooth overflow-hidden "
              style={{
                msOverflowStyle: "none" /* IE and Edge */,
                scrollbarWidth: "none" /* Firefox */,
              }}
            >
              {loading && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <FaSpinner className="animate-spin" />
                </div>
              )}
              {adventureBooks.map((book) => (
                <div
                  key={book._id}
                  className="inline-block w-64 overflow-hidden bg-white shadow-lg rounded-lg mx-2 p-6"
                >
                  <img
                    src={"https://placehold.co/600x400?text=" + book.title}
                    alt={book.title}
                    className="w-full h-64 object-cover rounded-t-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-800">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 mt-2">by {book.author}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-gray-500">
                      Available: {book.quantities}
                    </span>
                    <button
                      onClick={() => handleReserveBook(book)}
                      className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition"
                      disabled={book.quantities === 0}
                    >
                      {book.quantities > 0 ? "Reserve" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Classic Books Section */}
      <section id="comic-books" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Classic Books Collection
          </h2>
          <p className="mt-4 text-gray-700">
            Explore our latest classic book additions!
          </p>
          <div className="relative mt-12">
            <div
              className="overflow-x-auto whitespace-nowrap scroll-smooth overflow-hidden "
              style={{
                msOverflowStyle: "none" /* IE and Edge */,
                scrollbarWidth: "none" /* Firefox */,
              }}
            >
              {loading && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <FaSpinner className="animate-spin" />
                </div>
              )}
              {classicBooks.map((book) => (
                <div
                  key={book._id}
                  className="inline-block w-64 overflow-hidden bg-white shadow-lg rounded-lg mx-2 p-6"
                >
                  <img
                    src={"https://placehold.co/600x400?text=" + book.title}
                    alt={book.title}
                    className="w-full h-64 object-cover rounded-t-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-800">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 mt-2">by {book.author}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-gray-500">
                      Available: {book.quantities}
                    </span>
                    <button
                      onClick={() => handleReserveBook(book)}
                      className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition"
                      disabled={book.quantities === 0}
                    >
                      {book.quantities > 0 ? "Reserve" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Login Section */}
      {!user && (
        <section id="login" className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Login</h2>
            <p className="mt-4 text-gray-700">
              Access your account below. Choose your role to proceed.
            </p>
            <div className="mt-12 flex flex-col md:flex-row justify-center gap-6">
              <Link
                to="/student-login"
                className="px-6 py-3 bg-gray-900 text-white rounded-md shadow hover:bg-gray-400 transition"
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
      )}

      {reserveModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center"
            onClick={() => setReserveModalOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white min-w-60 rounded-lg p-6 w-1/2"
            >
              <h2 className="text-2xl font-bold text-gray-900">Reserve Book</h2>
              <p className="text-gray-600 mt-2">
                Enter the return date for {selectedBook?.title}
              </p>
              <input
                value={returnData}
                onChange={(e) => setreturnData(e.target.value)}
                type="date"
                className="mt-4 mx-auto "
                name="returnDate"
                id=""
              />
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={(e) => {
                    // Implement reserve book logic here
                    handleConfirmReserve(e);
                  }}
                  className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition"
                >
                  Reserve
                </button>
                <button
                  onClick={(e) => setReserveModalOpen(false)}
                  className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LandingPage;
