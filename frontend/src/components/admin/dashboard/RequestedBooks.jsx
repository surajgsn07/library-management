import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosConfig/axiosConfig";
import { FiLoader } from "react-icons/fi"; // Importing the loader icon from react-icons


import { toast } from 'react-toastify';
const RequestedBooks = () => {
  const [filter, setFilter] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for fetching books
  const [acceptLoader, setacceptLoader] = useState(false);

  const fetchRequestedBooks = async () => {
    try {
      setLoading(true); // Set loading to true when fetching starts
      const response = await axiosInstance.get("/issue/requested-books");
      console.log("res : ", response);
      if (response.data) {
        console.log("response.data : ", response.data);
        setBooks(response.data.books);
      }
    } catch (error) {
      console.error("Error fetching requested books:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching is complete
    }
  };

  // Handle issuing a book
  const handleIssue = async(id) => {
    try {
      const response = await axiosInstance.get(`/issue/accept/${id}`);
      if(response.data){
        setBooks((books) => books.filter((book) => book.id !== id));
        toast.success('Book issued successfully');
      }
    } catch (error) {
      
    }
  };

  // Handle removing a request
  const handleRemove = async(issueId , bookId) => {
    try {
      const response = await axiosInstance.post("/issue/cancel-request", {
        issueId,
        bookId,
      });
      if(response.data){
        setBooks((books) => books.filter((book) => book.id !== bookId));
        toast.success('Request removed successfully');
      }
    } catch (error) {
      
    }
  };

  // Filter books based on the search input
  const filteredBooks = books.filter((book) =>
    book.book.title.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    fetchRequestedBooks();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-2 flex justify-center items-center">
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
            placeholder="Search by book title"
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
                  key={item.id}
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
                      onClick={() => handleIssue(item._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                    >
                      Issue
                    </button>

                    {/* Remove Request Button */}
                    <button
                      onClick={() => handleRemove(item._id , item.book._id)}
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
      </div>
    </div>
  );
};

export default RequestedBooks;
