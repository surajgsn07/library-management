import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBook, FaRegClock, FaHistory } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import axiosInstance from "../../../axiosConfig/axiosConfig";
import { useSelector } from "react-redux";

const StudentDashboard = () => {
  const [allBorrowedBooks, setAllBorrowedBooks] = useState([/* ... your initial state ... */]);
  const [allRequestedBooks, setAllRequestedBooks] = useState([/* ... your initial state ... */]);
  const [allHistory, setAllHistory] = useState([/* ... your initial state ... */]);

  const user = useSelector((state) => state.auth.user);

  const [borrowedBooks, setBorrowedBooks] = useState(allBorrowedBooks);
  const [requestedBooks, setRequestedBooks] = useState(allRequestedBooks);
  const [history, setHistory] = useState(allHistory);

  // Separate loading states for each section
  const [borrowedLoading, setBorrowedLoading] = useState(false);
  const [requestedLoading, setRequestedLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(null); // For cancel request button
  const [searchLoading, setSearchLoading] = useState({
    borrowed: false,
    requested: false,
    history: false
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [displayedBooks, setDisplayedBooks] = useState(3);

  useEffect(() => {
    const fetchData = async () => {
      setBorrowedLoading(true);
      setRequestedLoading(true);
      setHistoryLoading(true);

      try {
        const response = await axiosInstance.get(`/issue/get/${user._id}`);
        if (response.data) {
          const issues = response.data.issues;
          const requested = issues.filter((issue) => issue.type === "Request");
          const borrowed = issues.filter((issue) => issue.type === "Borrow");
          const history = issues.filter((issue) => issue.type === "Return");

          setAllBorrowedBooks(borrowed);
          setAllRequestedBooks(requested);
          setAllHistory(history);
          setBorrowedBooks(borrowed);
          setRequestedBooks(requested);
          setHistory(history);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setBorrowedLoading(false);
        setRequestedLoading(false);
        setHistoryLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleShowMore = (type) => {
    if (type === "borrowed") {
      setDisplayedBooks(borrowedBooks.length);
    } else if (type === "requested") {
      setDisplayedBooks(requestedBooks.length);
    } else if (type === "history") {
      setDisplayedBooks(history.length);
    }
  };

  const cancelRequest = async (bookId, issueId) => {
    setCancelLoading(issueId);
    try {
      const response = await axiosInstance.post(`/issue/cancel-request`, { bookId, issueId });
      if (response.data) {
        const remaining = requestedBooks.filter((book) => book._id !== issueId);
        setAllRequestedBooks(remaining);
        setRequestedBooks(remaining);
      }
    } catch (error) {
      console.error("Error canceling request:", error);
    } finally {
      setCancelLoading(null);
    }
  };

  const handleSearch = async (e, type) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setSearchLoading(prev => ({ ...prev, [type]: true }));

    try {
      if (term === "") {
        if (type === "borrowed") setBorrowedBooks(allBorrowedBooks);
        else if (type === "requested") setRequestedBooks(allRequestedBooks);
        else if (type === "history") setHistory(allHistory);
      } else {
        if (type === "borrowed") {
          setBorrowedBooks(allBorrowedBooks.filter((book) =>
            book.book.title.toLowerCase().includes(term)
          ));
        } else if (type === "requested") {
          setRequestedBooks(allRequestedBooks.filter((book) =>
            book.book.title.toLowerCase().includes(term)
          ));
        } else if (type === "history") {
          setHistory(allHistory.filter((entry) =>
            entry.book.title.toLowerCase().includes(term)
          ));
        }
      }
    } finally {
      setSearchLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-4">
      <BiLoaderAlt className="animate-spin text-2xl text-gray-600" />
    </div>
  );

  return (
    <div className="p-8 bg-gray-100 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Student Dashboard
      </h1>

      {/* Borrowed Books Section */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <FaBook className="text-blue-500 text-2xl mr-2" />
          <h2 className="text-2xl font-semibold text-gray-700">Borrowed Books</h2>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Borrowed Books"
            className="mb-4 p-2 border border-gray-300 rounded-lg w-full"
            onChange={(e) => handleSearch(e, "borrowed")}
          />
          {searchLoading.borrowed && (
            <BiLoaderAlt className="absolute right-3 top-3 animate-spin text-gray-600" />
          )}
        </div>
        {borrowedLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-4">
            {borrowedBooks.length === 0 && (
              <p className="text-gray-600">No borrowed books found.</p>
            )}
            {borrowedBooks.slice(0, displayedBooks).map((book) => (
              <div key={book._id} className="border-b pb-4">
                <h3 className="font-medium text-gray-800">{book.book.title}</h3>
                <p className="text-gray-600">
                  Issue Date: {new Date(book.issueDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  Expected Return Date: {new Date(book.expectedReturnDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Requested Books Section */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <FaRegClock className="text-yellow-500 text-2xl mr-2" />
          <h2 className="text-2xl font-semibold text-gray-700">Requested Books</h2>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Requested Books"
            className="mb-4 p-2 border border-gray-300 rounded-lg w-full"
            onChange={(e) => handleSearch(e, "requested")}
          />
          {searchLoading.requested && (
            <BiLoaderAlt className="absolute right-3 top-3 animate-spin text-gray-600" />
          )}
        </div>
        {requestedLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-4">
            {requestedBooks.length === 0 && (
              <p className="text-gray-600">No requested books found.</p>
            )}
            {requestedBooks.slice(0, displayedBooks).map((book) => (
              <div key={book._id} className="border-b pb-4 sm:flex justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">{book.book.title}</h3>
                  <p className="text-gray-600">Author: {book.book.author}</p>
                  <p className="text-gray-600">
                    Request Date: {new Date(book.issueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex justify-center">
                  <button 
                    onClick={() => cancelRequest(book.book._id, book._id)}
                    disabled={cancelLoading === book._id}
                    className="bg-red-500 h-10 mt-3 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center space-x-2"
                  >
                    {cancelLoading === book._id ? (
                      <>
                        <BiLoaderAlt className="animate-spin" />
                        <span>Canceling...</span>
                      </>
                    ) : (
                      <span>Cancel</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History Section */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <FaHistory className="text-green-500 text-2xl mr-2" />
          <h2 className="text-2xl font-semibold text-gray-700">History</h2>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search History"
            className="mb-4 p-2 border border-gray-300 rounded-lg w-full"
            onChange={(e) => handleSearch(e, "history")}
          />
          {searchLoading.history && (
            <BiLoaderAlt className="absolute right-3 top-3 animate-spin text-gray-600" />
          )}
        </div>
        {historyLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-4">
            {history.length === 0 && (
              <p className="text-gray-600">No history found.</p>
            )}
            {history.slice(0, displayedBooks).map((entry) => (
              <div key={entry._id} className="border-b pb-4">
                <h3 className="font-medium text-gray-800">{entry.book.title}</h3>
                <p className="text-gray-600">Action: {entry.type}</p>
                <p className="text-gray-600">
                  Date: {new Date(entry.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;