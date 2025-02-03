import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosConfig/axiosConfig";
import { FiLoader } from "react-icons/fi"; // Importing the loader icon from react-icons
import { toast } from "react-toastify";

const RequestedBooks = () => {
  const [filter, setFilter] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for fetching books
  const [showIssueModal, setShowIssueModal] = useState(false); // Modal state
  const [selectedBookId, setSelectedBookId] = useState(null); // Selected book ID for issuing
  const [expectedReturnDate, setExpectedReturnDate] = useState(""); // Expected return date

  console.log("books : ", books);

  const fetchRequestedBooks = async () => {
    try {
      setLoading(true); // Set loading to true when fetching starts
      const response = await axiosInstance.get("/issue/requested-books");
      if (response.data) {
        setBooks(response.data.books.filter((book) => book.user !== null));
      }
    } catch (error) {
      console.error("Error fetching requested books:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching is complete
    }
  };

  // Open issue modal and set selected book ID
  const openIssueModal = (id) => {
    setSelectedBookId(id);
    setShowIssueModal(true);
  };

  // Close issue modal
  const closeIssueModal = () => {
    setShowIssueModal(false);
    setSelectedBookId(null);
    setExpectedReturnDate("");
  };

  // Handle issuing a book with expected return date
  const handleIssue = async () => {
    if (!expectedReturnDate) {
      toast.error("Please select an expected return date.");
      return;
    }

    // Validate that the expected return date is not in the past
    const today = new Date();
    const selectedDate = new Date(expectedReturnDate);
    if (selectedDate < today) {
      toast.error("Expected return date cannot be in the past.");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get(`/issue/accept/${selectedBookId}/${expectedReturnDate}`);
      if (response.data) {
        setBooks((books) => books.filter((book) => book.id !== selectedBookId));
        toast.success("Book issued successfully");
        closeIssueModal();
      }
    } catch (error) {
      console.log("error : ", error);
      toast.error("Error accepting request");
    } finally {
      setLoading(false);
    }
  };

  // Handle removing a request
  const handleRemove = async (issueId, bookId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/issue/cancel-request", {
        issueId,
        bookId,
      });
      if (response.data) {
        setBooks((books) => books.filter((book) => book.id !== bookId));
        toast.success("Request removed successfully");
      }
    } catch (error) {
      console.log("error : ", error);
      toast.error("Error removing request");
    } finally {
      setLoading(false);
    }
  };

  // Filter books based on the search input (book title, user name, and user rollNo)
  const filteredBooks = books.filter((book) => {
    const searchTerm = filter.toLowerCase();
    return (
      book?.book?.title?.toLowerCase().includes(searchTerm) ||
      book?.user?.name?.toLowerCase().includes(searchTerm) ||
      book?.user?.rollNo?.toString()?.toLowerCase().includes(searchTerm)
    );
  });

  useEffect(() => {
    fetchRequestedBooks();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Requested Books
          </h1>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search by book title, user name, or roll number"
            className="w-full md:w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Loader - using FiLoader icon */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <FiLoader className="animate-spin text-blue-500" size={40} />
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300"
                >
                  {/* Book Details */}
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
                    <div className="flex-grow">
                      <h2 className="text-lg font-semibold text-gray-700">
                        {item.book.title}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Author: {item.book.author}
                      </p>
                      <p className="text-sm text-gray-500">
                        Requested by: {item.user.name} ({item.user.email})
                      </p>
                      <p className="text-sm text-gray-500">
                        Roll No: {item.user.rollNo}
                      </p>
                      <p className="text-sm text-gray-500">
                        Issue Date:{" "}
                        {new Date(item.issueDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Expected Return Date:{" "}
                        {new Date(item.expectedReturnDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-4 md:mt-0">
                    {/* Issue Button */}
                    <button
                      onClick={() => openIssueModal(item._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                    >
                      Issue
                    </button>

                    {/* Remove Request Button */}
                    <button
                      onClick={() => handleRemove(item._id, item.book._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition duration-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No requested books found.
              </p>
            )}
          </div>
        )}

        {/* Issue Modal */}
        {showIssueModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Set Expected Return Date</h2>
              <input
                type="date"
                value={expectedReturnDate}
                onChange={(e) => setExpectedReturnDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={closeIssueModal}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleIssue}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {loading ? <FiLoader className="animate-spin" /> : "Issue"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestedBooks;