"use client";

import React, { useState } from "react";
import QRCode from "qrcode";
import logo from "../../../images/IEFK25- Logo png (1).avif";

interface UserDetails {
  name: string;
  email: string;
  phone: string;
  location:string
}

const Page = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); 

  const handleDownloadPDF = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const response = await fetch("https://iefk-25-support.vercel.app/api/get-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserDetails(data);

        
        const qrData = `Name: ${data.name}\nEmail: ${data.email}\nPhone No: ${data.phone}\nLocation: ${data.location} `;
        
        const qrCodeUrl = await QRCode.toDataURL(qrData);
        setQrCode(qrCodeUrl);

        
        setTimeout(async () => {
          const element = document.getElementById("pdf-content");
          if (element) {

            const html2pdf = (await import("html2pdf.js")).default;
    let ids: [number,number] = [90,150];
    const options = {
      filename: "ID_Card.pdf",
      image: { type: "png" },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: ids, orientation: "portrait" as "portrait" | "landscape" },
    };

    html2pdf().from(element!).set(options).save();
          } else {
            console.error("PDF content element not found");
          }
        }, 0);

        setError("");
      } else {
        const data = await response.json();
        setError(data.error || "User not found");
        setUserDetails(null);
        setQrCode(null);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("An error occurred while fetching user data");
      setUserDetails(null);
      setQrCode(null);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 to-green-300">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-xl font-bold text-center mb-4">Download ID Card</h1>
          <form onSubmit={handleDownloadPDF}>
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Enter Registered Mobile Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your phone number"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Generating PDF..." : "Download PDF"}
            </button>
          </form>

          
          {error && (
            <div className="mt-4 p-2 bg-red-100 text-red-600 border border-red-400 rounded">
              {error}
            </div>
          )}

         
          {userDetails && (
            <div
            id="pdf-content"
            className="bg-white  text-white font-bold rounded p-4"
            style={{
              display: "flex",
              height:'567px',
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              color: "black",
              border:'3px solid #00ffff'
              
              
            }}
          >
            <div className="w-full h-[170px] rounded bg-blue-300 flex justify-around items-center mb-[20px] " style={{border:'3px solid #00ffff'}}>
              <div className="flex h-[100px] w-[100px] bg-white flex justify-center items-center " style={{borderRadius:'50%',border:'3px solid #00ffff'}}>
                <img
                  src={logo.src}
                  
                  alt="logo"
                  style={{ height: "75px", width: "75px" }}
                />
              </div>
              
            </div>
            <div className="bg-blue-300 h-[150px] w-[100%] rounded" style={{ display: 'flex', flexDirection: 'column',justifyContent:'center', alignItems: 'center',border:'3px solid #00ffff' }}>
              <div>
              <p>Name: {userDetails.name}</p>
              <p>Phone: {userDetails.phone}</p>
              <p>Email: {userDetails.email}</p>
              <p>Place: {userDetails.location}</p>
              </div>
            </div>

            {qrCode && (
              <div
                className="qr-code-container"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                 border:'3px solid #00ffff'
                }}
              >
                <img
                  src={qrCode}
                  alt="QR Code"
                  style={{ width: "150px", height: "150px" }}
                />
              </div>
            )}
          </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
