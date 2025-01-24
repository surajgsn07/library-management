import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { removeCookie } from '../axiosConfig/cookieFunc';

const Header = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch()
  const navigate = useNavigate();
  
  

  return (
    <header className="bg-gray-900 hidden lg:block  text-white py-4 shadow-md">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-3 bg-whiteS">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvWP-O8V_U9-giVM67Kal68utE1jPGE7kFmg&s" 
            alt="Library Logo"
            className="w-10 h-12 rounded-lg object-cover"
          />
          <h1 className="text-2xl font-bold">Library System</h1>
        </Link>

                <div>
                  {
                    user ? <>
                    <button onClick={()=>{
                      removeCookie("accessToken");
                      removeCookie("type");
                      dispatch(logout());
                      navigate("/");
                    }} className='px-4 py-2 bg-red-700 text-white rounded-md' >Logout</button></>:<>
                    
                  <a href='#login'  className='px-4 py-2 bg-amber-500 text-white rounded-md' >Login</a></>

                  }
                  
                
                </div>

      </div>
    </header>
  );
};

export default Header;
