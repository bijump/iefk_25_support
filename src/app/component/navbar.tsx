"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const userLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(userLoggedIn);
  }, []);

  return (
    <nav className="custom-gradient text-white px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4">
        
        <a href="/component/home">
          <Image
            src="/_next/static/media/IEFK25- Logo png (1).687209c4.avif"
            alt="IEFK Logo"
            width={200}
            height={100}
            layout="responsive"
          />
        </a>

        
        <div className="hidden sm:flex sm:items-center sm:space-x-6">
          <a
            href="/registration"
            className="hover:bg-gray-700 py-2 px-4 rounded-lg"
          >
            Registration
          </a>
          <Link href="/download">Download</Link>
          <Link href="/login">Login</Link>
          <Link href="/detials">RegistrationDetials</Link>
          {isLoggedIn && (
            <Link href="/scan" className="hover:bg-gray-700 py-2 px-4 rounded-lg">
              Scan
            </Link>
          )}
        </div>

        
        <div className="sm:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      
      {isMobileMenuOpen && (
        <div className="sm:hidden flex flex-col items-start space-y-4 mt-4 px-4">
          <a
            href="/registration"
            className="block py-2 px-4 w-full text-left hover:bg-gray-700 rounded"
          >
            Registration
          </a>
          <Link
            href="/download"
            className="block py-2 px-4 w-full text-left hover:bg-gray-700 rounded"
          >
            Download
          </Link>
          <Link
            href="/login"
            className="block py-2 px-4 w-full text-left hover:bg-gray-700 rounded"
          >
            Login
          </Link>
          <Link
            href="/detials"
            className="block py-2 px-4 w-full text-left hover:bg-gray-700 rounded"
          >
            RegistrationDetials
          </Link>
          {isLoggedIn && (
            <Link
              href="/scan"
              className="block py-2 px-4 w-full text-left hover:bg-gray-700 rounded"
            >
              Scan
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
