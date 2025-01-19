import React, { useRef, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../../axiosConfig/axiosConfig';
import { FiCamera } from "react-icons/fi";

const SearchBooks = () => {
  const [formData, setFormData] = useState({
    author: '',
    isbn: '',
    title: '',
    genre: '',
    name: '',
  });
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);  // Search Loading
  const [addLoading, setAddLoading] = useState(false); // Add Quantity Loading
  const [error, setError] = useState('');
  const [showAddMoreModal, setShowAddMoreModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const ref = useRef(null);
  const [pic, setPic] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle search submit
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/book/search', { params: formData });
      setBooks(response.data.books);
    } catch (err) {
      setError('Error fetching books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Open add more modal
  const openAddMoreModal = (book) => {
    setSelectedBook(book);
    setShowAddMoreModal(true);
  };

  // Close add more modal
  const closeAddMoreModal = () => {
    setShowAddMoreModal(false);
    setSelectedBook(null);
    setQuantityToAdd(1);
  };

  // Confirm adding more books
  const confirmAddMore = async () => {
    setAddLoading(true);
    try {
      const response = await axiosInstance.post('/book/add-quantity', { id: selectedBook._id, quantityToAdd: quantityToAdd });
      if (response.data) {
        const updatedBooks = books.map((book) =>
          book._id === selectedBook._id
            ? { ...book, quantities: response.data.book.quantities }
            : book
        );
        setBooks(updatedBooks);
        setShowSuccessModal(true);
        setShowAddMoreModal(false);
      }
    } catch (error) {
      console.log("error:", error);
    } finally {
      setAddLoading(false);
    }
  };

  const handleImageChange = async (bookId) => {
    const file = ref.current.files[0];
    const formData = new FormData();
    formData.append('image', file);
    formData.append('bookId', bookId);

    try {
      const res = await axiosInstance.post('/book/addPicture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data) {
        setBooks((prev) => {
          if (prev._id === bookId) {
            return { ...prev, picture: res.data.book.picture };
          } else {
            return prev;
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Close success modal
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setSelectedBook(null);
    setQuantityToAdd(1);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-6">Search for Books</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Author"
          className="p-3 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          placeholder="ISBN"
          className="p-3 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="p-3 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          placeholder="Genre"
          className="p-3 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-md col-span-1 sm:col-span-2 lg:col-span-1"
        >
          Search
        </button>
      </form>

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center text-blue-600">Loading...</div>
      )}

      {/* Error Message */}
      {error && <div className="text-center text-red-600">{error}</div>}

      {/* Display Books */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.length > 0 ? (
          books.map((book) => (
            <div
              key={book._id}
              className="relative bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Add Picture Icon */}
              <button
                onClick={() => ref.current.click()}
                className="absolute top-2 right-2 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full shadow-md"
              >
                <FiCamera size={20} />
              </button>

              {/* Book Cover Image */}
              <img
                src={book.picture || '/default-book.jpg'}
                alt={book.title}
                className="w-full h-56 object-cover"
              />

              <input
                type="file"
                name="image"
                hidden
                ref={ref}
                onChange={() => handleImageChange(book._id)}
              />

              {/* Book Details */}
              <div className="p-4">
                <h2 className="text-xl font-semibold truncate">{book.title}</h2>
                <p className="text-gray-600">{book.author}</p>
                <p className="text-gray-500">Available Quantity: {book.quantities}</p>
                <button
                  onClick={() => openAddMoreModal(book)}
                  className="mt-4 bg-green-600 text-white p-2 rounded-md w-full"
                >
                  Add More
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-600">No books found</div>
        )}
      </div>

      {/* Add More Modal */}
      {showAddMoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add More Books</h2>
            <p className="text-gray-600 mb-4">
              Enter the quantity of{' '}
              <span className="font-semibold">{selectedBook.title}</span> to add.
            </p>
            <input
              type="number"
              min="1"
              value={quantityToAdd}
              onChange={(e) => setQuantityToAdd(parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={closeAddMoreModal}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmAddMore}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                disabled={addLoading}
              >
                {addLoading ? 'Adding...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-green-600 mb-4">Success!</h2>
            <p className="text-gray-600">Quantity has been added successfully.</p>
            <button
              onClick={closeSuccessModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-md w-full mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBooks;
