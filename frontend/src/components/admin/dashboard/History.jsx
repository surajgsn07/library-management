import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosConfig/axiosConfig";
import { FaSpinner } from "react-icons/fa"; // Import the spinner icon from react-icons
import { exportToExcel } from "../../../utils/ConvertToExcel";

// Demo data for returned books
const demoHistoryData = [
  {
    id: 1,
    book: { title: "Book A", author: "Author A" },
    user: { name: "John Doe", email: "john.doe@example.com", rollNo: "12345" },
    issueDate: "2025-01-01",
    returnDate: "2025-01-15",
  },
  {
    id: 2,
    book: { title: "Book B", author: "Author B" },
    user: { name: "Jane Smith", email: "jane.smith@example.com", rollNo: "67890" },
    issueDate: "2025-01-05",
    returnDate: "2025-01-20",
  },
];

const History = () => {
  const [filter, setFilter] = useState("");
  const [history, setHistory] = useState(demoHistoryData);
  const [loading, setLoading] = useState(true); // Add loading state

  // Filter returned books based on the search input
  const filteredHistory = history.filter((record) => {
    const searchTerm = filter.toLowerCase();
    return (
      record?.book?.title?.toLowerCase().includes(searchTerm) ||
      record?.user?.name?.toLowerCase().includes(searchTerm) ||
      record?.user?.email?.toLowerCase().includes(searchTerm) ||
      String(record?.user?.rollNo)?.toLowerCase().includes(searchTerm) // Convert rollNo to string
    );
  });

  const fetchHistory = async () => {
    try {
      const response = await axiosInstance.get("/issue/history");
      if (response.data) {
        setHistory(response.data.books);
      }
    } catch (error) {
      console.error("Error fetching returned books:", error);
    } finally {
      setLoading(false); // Set loading to false after the request is done
    }
  };

  // Flatten data for Excel export
  function flattenData(dataArray) {
    return dataArray.map((entry) => ({
      transactionId: entry._id || entry.id,
      bookName: entry.book?.title,
      bookAuthor: entry.book?.author,
      userName: entry.user?.name,
      userEmail: entry.user?.email,
      userPhone: entry.user?.phoneNo || "N/A",
      rollNo: entry.user?.rollNo || "N/A",
      issueDate: new Date(entry.issueDate).toLocaleDateString(),
      returnDate: entry.returnDate
        ? new Date(entry.returnDate).toLocaleDateString()
        : "Not Returned",
    }));
  }

  // Export data to Excel
  const exportExcel = () => {
    exportToExcel(flattenData(history), "BooksHistory.xlsx");
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="bg-gray-100 pt-16 min-h-screen p-6 flex justify-center items-center relative">
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
            Returned Books History
          </h1>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search by book title, user name, email, or roll number"
            className="w-full md:w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* History List */}
        <div className="grid gap-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <FaSpinner className="animate-spin text-3xl text-blue-500" /> {/* Show spinner */}
            </div>
          ) : filteredHistory.length > 0 ? (
            filteredHistory.map((record) => (
              <div
                key={record.id}
                className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300"
              >
                {/* Book Details */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold text-gray-700">
                      {record.book?.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Author: {record.book?.author}
                    </p>
                    <p className="text-sm text-gray-500">
                      Borrowed by: {record.user?.name} ({record.user?.email})
                    </p>
                    <p className="text-sm text-gray-500">
                      Roll No: {record.user?.rollNo || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Issue Date: {new Date(record.issueDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Return Date:{" "}
                      {record.returnDate
                        ? new Date(record.returnDate).toLocaleDateString()
                        : "Not Returned"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No returned books history found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;