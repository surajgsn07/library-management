import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setCookie } from '../../axiosConfig/cookieFunc';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';
import axiosInstance from '../../axiosConfig/axiosConfig';
import HeaderForSmallScreen from '../HeaderForSmallScreen';
import { FaSpinner } from 'react-icons/fa'; // Import the spinner icon

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // State for loader
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true); // Show the loader

    try {
      const response = await axiosInstance.post('/admin/login', formData);
      if (response.data) {
        console.log('response.data : ', response.data);
        const user = response.data.user;
        const token = response.data.token;
        setCookie('accessToken', token);
        dispatch(login({ user, type: 'admin' }));
        navigate('/admin/dashboard');
      }
      setSuccess(response.data.message || 'Login successful!');
      localStorage.setItem('adminToken', response.data.token); // Save token to local storage
    } catch (err) {
      console.log('error : ', err);
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false); // Hide the loader
    }
  };

  return (
    <>
      <HeaderForSmallScreen />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
            Admin Login
          </h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'email', type: 'email', label: 'Email' },
              { name: 'password', type: 'password', label: 'Password' },
            ].map(({ name, type, label }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-gray-700">
                  {label}
                </label>
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#99231d] focus:border-transparent"
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full py-3 bg-gray-900 text-white rounded-md shadow hover:bg-amber-500 transition flex items-center justify-center"
              disabled={loading} // Disable button while loading
            >
              {loading ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                'Login'
              )}
            </button>
          </form>
          
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
