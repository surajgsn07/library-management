import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosConfig/axiosConfig";
import { FiLoader } from "react-icons/fi"; // Importing the loader icon from react-icons
import { toast } from "react-toastify";
import { exportToExcel } from "../../../utils/ConvertToExcel.js";

const BorrowedBooks = () => {
  const [filter, setFilter] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [returnLoader, setReturnLoader] = useState(false);

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
      setReturnLoader(true);
      const response = await axiosInstance.get(`/issue/return/${bookId}`, {
        bookId,
      });
      if (response.data) {
        // Update the books list to reflect the returned book
        fetchBorrowedBooks();
        toast.success("Book marked as returned successfully");
      } else {
        toast.error("Error marking book as returned");
      }
    } catch (error) {
      console.error("Error marking book as returned:", error);
    } finally {
      setReturnLoader(false);
    }
  };

  // Filter books based on book title, user name, or user rollNo
  const filteredBooks = books.filter((book) => {
    const searchTerm = filter.toLowerCase();
    return (
      book.book.title.toLowerCase().includes(searchTerm) ||
      book.user.name.toLowerCase().includes(searchTerm) ||
      String(book.user.rollNo).toLowerCase().includes(searchTerm) // Convert rollNo to string
    );
  });

  // Export data to Excel
  const exportExcel = () => {
    exportToExcel(flattenData(books), "BorrowedBooks.xlsx");
  };

  // Flatten data for Excel export
  function flattenData(dataArray) {
    return dataArray.map((entry) => ({
      transactionId: entry._id,
      bookName: entry.book.title,
      bookAuthor: entry.book.author,
      userName: entry.user.name,
      userEmail: entry.user.email,
      userPhone: entry.user.phoneNo,
      rollNo: entry.user.rollNo,
      issueDate: new Date(entry.issueDate).toLocaleDateString(),
      returnDate: entry.returnDate
        ? new Date(entry.returnDate).toLocaleDateString()
        : "Not Returned",
      expectedReturnDate: new Date(entry.expectedReturnDate).toLocaleDateString(),
      type: entry.type,
    }));
  }

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  return (
    <div className="bg-gray-100 pt-16  relative min-h-screen p-2 flex justify-center items-center">
      {/* Export to Excel Button */}
      <button
        className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded absolute top-4 right-4"
        onClick={exportExcel}
      >
        Export to Excel
      </button>

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
            placeholder="Search by book title, user name, or roll number"
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
                        Roll No: {item.user.rollNo}
                      </p>
                      <p className="text-sm text-gray-500">
                        Issue Date: {new Date(item.issueDate).toLocaleDateString()}
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
                      {returnLoader ? (
                        <FiLoader className="animate-spin" size={20} />
                      ) : (
                        "Mark Returned"
                      )}
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