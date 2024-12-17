"use client";

import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const BarcodeScannerPage = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [barcodeData, setBarcodeData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const correctUserId = "admin";
  const correctPassword = "12345";

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId === correctUserId && password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  // Effect to initialize barcode scanner after login
  useEffect(() => {
    if (!isAuthenticated) return;
  
    const codeReader = new BrowserMultiFormatReader();
  
    if (videoRef.current) {
      codeReader
        .decodeFromVideoDevice(undefined, videoRef.current, async (result, error) => {
          if (result) {
            const scannedData = result.getText();
            setBarcodeData(scannedData);
  
            try {
              // Check if the scanned data is a valid URL (simple check)
              const isUrl = /^https?:\/\/[^\s]+$/.test(scannedData);
  
              if (isUrl) {
                // If it's a URL, you can extract parameters or handle the URL as needed
                console.log("Scanned URL:", scannedData);
                // For example, extract data from the query string:
                const url = new URL(scannedData);
                const name = url.searchParams.get("name");
                const email = url.searchParams.get("email");
                const phone = url.searchParams.get("phone");
  
                // Send the extracted data to the server
                const response = await fetch("/api/attendens", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ name, email, phone, barcodeData: scannedData }),
                });
  
                if (!response.ok) {
                  throw new Error("Failed to save QR code data");
                }
  
                const data = await response.json();
                console.log("QR Code saved:", data);
              } else {
                // Try parsing the data as JSON if it's not a URL
                const parsedData = JSON.parse(scannedData);  // Assuming it's valid JSON
  
                // Now you can extract name, email, and phone from parsedData
                const { name, email, phone } = parsedData;
  
                // Send the parsed data to the server
                const response = await fetch("/api/attendens", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ name, email, phone, barcodeData: scannedData }),
                });
  
                if (!response.ok) {
                  throw new Error("Failed to save QR code data");
                }
  
                const data = await response.json();
                console.log("QR Code saved:", data);
              }
            } catch (error) {
              setError("Error processing barcode data.");
              console.error("Error processing barcode data:", error);
            }
          } else if (error) {
            setError("No barcode detected");
          }
        })
        .catch((err) => {
          console.error("Error initializing scanner:", err);
          setError("Failed to initialize scanner");
        });
  
      return () => {
        setBarcodeData(null);
      };
    }
  }, [isAuthenticated]);
  
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-green-100">
      {!isAuthenticated ? (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Login to Access Scanner</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                User ID
              </label>
              <input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md">
              Login
            </button>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Barcode Scanner</h1>
          <div className="relative bg-white rounded-lg shadow-md p-4">
            <video ref={videoRef} className="w-full rounded-lg" autoPlay muted></video>
          </div>
          <div className="mt-4">
            {barcodeData ? (
              <p className="text-green-600 font-semibold">
                Scanned Barcode: <span className="text-black">{barcodeData}</span>
              </p>
            ) : error ? (
              <p className="text-red-600 font-semibold">{error}</p>
            ) : (
              <p className="text-gray-600">Point your camera at a barcode to scan.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScannerPage;
