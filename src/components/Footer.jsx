import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#services" className="text-sm hover:text-blue-400">Services</a>
          <a href="#about" className="text-sm hover:text-blue-400">About</a>
          <a href="#contact" className="text-sm hover:text-blue-400">Contact</a>
        </div>
      </div>
    </footer>
  );
}
