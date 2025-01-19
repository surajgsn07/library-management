import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../axiosConfig/axiosConfig";
import { useDispatch } from "react-redux";
import { login } from "../../../store/authSlice";
import { setCookie } from "../../../axiosConfig/cookieFunc";
import HeaderForSmallScreen from "../../HeaderForSmallScreen";
import { BiLoaderAlt } from "react-icons/bi";

const Login = () => {
  const [formData, setFormData] = useState({
    rollNo: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/student/login", formData);

      if (response.data) {
        dispatch(login({ user: response.data.user, type: "student" }));
        setCookie("accessToken", response.data.token);
        setSuccess(response.data.message || "Login successful!");
        setFormData({ rollNo: "", password: "" });
        navigate("/student/dashboard");
      }
    } catch (err) {
      console.log("err : ", err);
      setError(err.response?.data?.message || "Invalid credentials.");
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
            Login
          </h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="rollNo" className="block text-gray-700">
                Roll Number
              </label>
              <input
                type="text"
                id="rollNo"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#99231d] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#99231d] focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gray-900 text-white rounded-md shadow hover:bg-[#7d1d18] transition flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <BiLoaderAlt className="h-5 w-5 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-gray-700">
              Don't have an account?{" "}
              <Link to="/student-register" className="text-gray-900">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;