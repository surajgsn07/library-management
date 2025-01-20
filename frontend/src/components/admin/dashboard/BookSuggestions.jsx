import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosConfig/axiosConfig";
import { FiLoader } from "react-icons/fi"; // Importing the loader icon
import { toast } from "react-toastify";
import { validateQuantity } from "../../../utils/Validation";

const AllBookSuggestions = () => {
  const [filter, setFilter] = useState(""); // Search filter
  const [bookSuggestions, setBookSuggestions] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [modalOpen, setModalOpen] = useState(false); // Modal state
  const [selectedBook, setSelectedBook] = useState(null); // Selected book for adding to library
  const [quantity, setQuantity] = useState(1); // Quantity for adding
  const [isbn, setisbn] = useState("")

  const fetchBookSuggestions = async () => {
    try {
      setLoading(true); // Set loading to true when fetching starts
      const response = await axiosInstance.get("/suggestion/all");
      if (response.data) {
        setBookSuggestions(response.data.bookSuggestions);
      }
    } catch (error) {
      console.error("Error fetching book suggestions:", error);
    } finally {
      setLoading(false); // Set loading to false when fetching is done
    }
  };

  // Filter book suggestions based on the search input for title or author
  const filteredSuggestions = bookSuggestions.filter(
    (book) =>
      book.title.toLowerCase().includes(filter.toLowerCase()) ||
      book.author.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAddToLibrary = async (id) => {
    try {
        if(validateQuantity(quantity) === false){
            return toast.error('Please enter a valid quantity');
        }
        if(!isbn){
            return toast.error('Please enter ISBN');
        }

        if(!quantity){
            return toast.error('Please enter quantity');
        }
        const response = await axiosInstance.post("/suggestion/add-to-library", {
            bookId : id,
            quantities : quantity,
            isbn
        })
        if(response.data){
          console.log("response.data : ", response.data);
          setBookSuggestions(bookSuggestions.filter((book) => book._id !== id));
          toast.success('Book added to library successfully');
          setModalOpen(false); 
        }
    } catch (error) {
      console.log("Error adding book to library:", error);
      toast.error('Error adding book to library');
    }
  };

  useEffect(() => {
    fetchBookSuggestions();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-4 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Book Suggestions
          </h1>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search by title or author"
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
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((suggestion) => (
                <div
                  key={suggestion._id}
                  className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                >
                  {/* Book Image */}
                  <div className="w-32 h-28 bg-gray-200 rounded-md overflow-hidden">
                    <img
                      src={suggestion.picture || "default-image.jpg"} // Use a default image if no picture is available
                      alt={suggestion.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Book Details */}
                  <div className="flex flex-col ml-6 md:ml-12 w-full">
                    <h2 className="text-xl font-semibold text-gray-800">{suggestion.title}</h2>
                    <p className="text-sm text-gray-500">Author: {suggestion.author}</p>
                    <p className="text-sm text-gray-500">Genre: {suggestion.genre}</p>
                  </div>

                  {/* Add to Library Button */}
                  <div className="mt-4 md:mt-0 flex-shrink-0">
                    <button
                      onClick={() => {
                        setSelectedBook(suggestion);
                        setModalOpen(true);
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      Add to Library
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No book suggestions found.</p>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add to Library</h2>
            <p className="text-lg text-gray-600 mb-4">
              You are adding the book: <span className="font-bold">{selectedBook.title}</span>
            </p>

            {/* Quantity Input */}
            <div className="mb-4">
              <label className="block text-gray-700">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                className="w-full p-2 border rounded-lg mt-2"
              />
              <label className="block mt-2 text-gray-700">ISBN </label>
              <input type="text" value={isbn} onChange={(e) => setisbn(e.target.value)} className="w-full p-2 border rounded-lg mt-2"  />
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={()=>(handleAddToLibrary(selectedBook._id))}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Add to Library
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBookSuggestions;
