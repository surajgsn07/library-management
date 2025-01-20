import React, { useState } from "react";
import axiosInstance from "../../../axiosConfig/axiosConfig";

const SuggestBookForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    author: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const response = await axiosInstance.post("/suggestion/create", formData);
      if (response.data) {
        setMessage(response.data.message);
        setFormData({
          title: "",
          genre: "",
          author: "",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Suggest a Book
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-300"
              placeholder="Enter the book title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-300"
              placeholder="Enter the genre"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-300"
              placeholder="Enter the author's name"
              required
            />
          </div>
          {message && (
            <p className="text-green-600 font-medium text-sm">{message}</p>
          )}
          {error && (
            <p className="text-red-600 font-medium text-sm">{error}</p>
          )}
          <button
            type="submit"
            className="w-full py-3 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg font-bold shadow-md hover:shadow-lg transition duration-300"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Suggestion"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuggestBookForm;
