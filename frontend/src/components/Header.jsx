import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  

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


      </div>
    </header>
  );
};

export default Header;
