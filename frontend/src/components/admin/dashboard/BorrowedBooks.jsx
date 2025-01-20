import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosConfig/axiosConfig";
import { FiLoader } from "react-icons/fi"; // Importing the loader icon from react-icons
import {toast} from "react-toastify";


const BorrowedBooks = () => {
  const [filter, setFilter] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [returnLoader, setreturnLoader] = useState(false)

  const fetchBorrowedBooks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/issue/borrowed-books");
      if (response.data) {
        setBooks(response.data.books);
      }
    } catch (error) {
      console.error("Error fetching borrowed books:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsReturned = async (bookId) => {
    try {
      setreturnLoader(true)
      const response = await axiosInstance.get(`/issue/return/${bookId}`, {
        bookId,
      });
      if (response.data) {
        // Update the books list to reflect the returned book
        fetchBorrowedBooks();
        // filteredBooks
        toast.success("Book marked as returned successfully");
      } else {
        toast.error("Error marking book as returned");
      }
    } catch (error) {
      console.error("Error marking book as returned:", error);
    }finally{
      setreturnLoader(false);
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.book.title.toLowerCase().includes(filter.toLowerCase()) ||
      book.user.name.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-2 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Borrowed Books
          </h1>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search by book title or user name"
            className="w-full md:w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Loader */}
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
                        Borrowed by: {item.user.name} ({item.user.email})
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
                  {/* "Mark Returned" Button */}
                  <div className="mt-4 md:mt-0">
                    <button
                      onClick={() => markAsReturned(item._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 focus:outline-none"
                    >
                     {returnLoader ? <FiLoader className="animate-spin" size={20} /> : " Mark Returned"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No borrowed books found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowedBooks;
