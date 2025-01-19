import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 ">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          {/* Quote Section */}
          <h2 className="text-xl font-semibold mb-4">
            "A book is a dream that you hold in your hand." — Neil Gaiman
          </h2>
          <p className="text-md mb-8">
            Explore, learn, and dive into the world of knowledge. Your next adventure is just a page away.
          </p>

          {/* Contact & Links Section */}
          {/* <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Connect with Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:contact@library.com" className="hover:text-red-500 transition">Email Us</a>
              </li>
              <li>
                <a href="https://twitter.com" className="hover:text-red-500 transition">Twitter</a>
              </li>
            </ul>
          </div> */}
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 text-center">
          <p className="text-sm">&copy; 2025 Library Management. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
