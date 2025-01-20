import React, { useState } from "react";
import axios from "axios";
import axiosInstance from "../../../axiosConfig/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../../store/authSlice";
import { setCookie } from "../../../axiosConfig/cookieFunc";
import HeaderForSmallScreen from "../../HeaderForSmallScreen";
import { BiLoaderAlt } from "react-icons/bi";
import { validatePhoneNumber } from "../../../utils/Validation";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    rollNo: "",
    email: "",
    phoneNo: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if(!validatePhoneNumber(formData.phoneNo)){
      setError('Please enter a valid phone number.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/student/register", {
        ...formData,
        className: formData.class,
      });
      if (response.data) {
        dispatch(login({ user: response.data.user, type: "student" }));
        setCookie("accessToken", response.data.token);
        navigate("/student/dashboard");
        setSuccess(response.data.message || "Registration successful!");
        setFormData({
          name: "",
          class: "",
          rollNo: "",
          email: "",
          phoneNo: "",
          password: "",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <HeaderForSmallScreen />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
            Register
          </h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              { name: "name", type: "text", label: "Name" },
              { name: "class", type: "text", label: "Course" },
              { name: "rollNo", type: "number", label: "Roll Number" },
              { name: "email", type: "email", label: "Email" },
              { name: "phoneNo", type: "text", label: "Phone Number" , placeholder:"+91 9876543210" },
              { name: "password", type: "password", label: "Password" },
            ].map(({ name, type, label ,placeholder}) => (
              <div key={name} className="flex flex-col">
                <label htmlFor={name} className="block text-gray-700">
                  {label}
                </label>
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder || "Enter your " + label}
                  className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#99231d] focus:border-transparent"
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gray-900 text-white rounded-md shadow hover:7d1d18] transition lg:col-span-2 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <BiLoaderAlt className="h-5 w-5 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <span>Register</span>
              )}
            </button>
          </form>
          <p className="mt-4 text-center">
            Already have an account?{" "}
            <Link to="/student-login" className="text-gray-900 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;