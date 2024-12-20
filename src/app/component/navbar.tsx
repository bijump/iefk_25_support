"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  
  useEffect(() => {
    const userLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(userLoggedIn);
  }, []);

  return (
    <nav className="custom-gradient text-white px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/component/home">
          <Image
            src="/_next/static/media/IEFK25- Logo png (1).687209c4.avif"
            alt="IEFK Logo"
            width={200}
            height={100}
            layout="responsive"
          />
        </a>

        <div className="sm:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
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

        <div
          className={`flex-col sm:flex-row sm:flex sm:items-center sm:space-x-6 ${
            isOpen ? "flex" : "hidden"
          }`}
        >
          <a
            href="/registration"
            className="block py-2 px-4 sm:py-0 sm:px-0 hover:bg-gray-700 rounded sm:hover:bg-transparent"
          >
            Registration
          </a>

          <Link href="/download">Download</Link>
          <Link href="/login">Login</Link>

          
          {isLoggedIn && (
            <Link
              href="/scan"
              className="block py-2 px-4 sm:py-0 sm:px-0 hover:bg-gray-700 rounded sm:hover:bg-transparent"
            >
              Scan
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
