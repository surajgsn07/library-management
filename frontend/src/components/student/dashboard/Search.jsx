import React, { useState } from 'react';
import axiosInstance from "../../../axiosConfig/axiosConfig.js";
import { BiLoaderAlt } from "react-icons/bi";

const SearchBooks = () => {
  const [formData, setFormData] = useState({
    author: '',
    isbn: '',
    title: '',
    genre: '',
  });
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [reservationLoading, setReservationLoading] = useState(false);

  const LoadingSpinner = ({ size = "w-5 h-5" }) => (
    <BiLoaderAlt className={`animate-spin ${size}`} />
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance("/book/search", { params: formData });
      if (response.data) {
        setBooks(response.data.books);
      }
    } catch (err) {
      setError('Error fetching books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const confirmReservation = async (id) => {
    setReservationLoading(true);
    try {
      const response = await axiosInstance.post("/issue/request", { bookId: id });
      if (response.data) {
        setError("");
        setShowSuccessModal(true);
      }
    } catch (error) {
      setError('Error reserving book. Please try again.');
    } finally {
      setReservationLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setSelectedBook(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-6">Search for Books</h1>
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder="Author" className="p-3 border border-gray-300 rounded-md" />
        <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} placeholder="ISBN" className="p-3 border border-gray-300 rounded-md" />
        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="p-3 border border-gray-300 rounded-md" />
        <input type="text" name="genre" value={formData.genre} onChange={handleChange} placeholder="Genre" className="p-3 border border-gray-300 rounded-md" />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white p-3 rounded-md col-span-1 sm:col-span-2 lg:col-span-1 flex items-center justify-center space-x-2 disabled:bg-blue-400">
          {loading ? <><LoadingSpinner /><span>Searching...</span></> : <span>Search</span>}
        </button>
      </form>

      {loading && <div className="text-center py-8"><LoadingSpinner size="w-8 h-8" /><p className="text-blue-600 mt-2">Searching for books...</p></div>}
      {error && <div className="text-center text-red-600 mb-4">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.length > 0 ? books.map((book) => (
          <div key={book._id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <img src={book.picture || '/default-book.jpg'} alt={book.title} className="w-full h-56 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold truncate">{book.title}</h2>
              <p className="text-gray-600">{book.author}</p>
              <button onClick={() =>{ 
                setSelectedBook(book);
                confirmReservation(book._id)

              }} disabled={reservationLoading || book.quantity === 0} className={`mt-4 ${book.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''} bg-green-600 text-white p-2 rounded-md w-full`}>{reservationLoading && selectedBook?._id === book._id ? <><span>Reserving...</span></> : <span>Reserve</span>}</button>
            </div>
          </div>
        )) : (!loading && <div className="col-span-3 text-center text-gray-600">No books found</div>)}
      </div>

      {showSuccessModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-semibold mb-4 text-center">Reservation Successful!</h2>
          <p className="text-gray-600 text-center">You have successfully reserved <span className="font-semibold">{selectedBook?.title}</span>. <span className='font-bold text-green-700'>Collect it from the library</span></p>
          <button onClick={closeSuccessModal} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md w-full hover:bg-blue-700">Close</button>
        </div>
      </div>}
    </div>
  );
};

export default SearchBooks;