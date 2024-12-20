"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import logo from "../../../images/IEFK25- Logo png (1).avif";

import QRCode from "qrcode";
import Image from 'next/image'

const IdCard = () => { 
  const [userDetails, setUserDetails] = useState<any>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");

  useEffect(() => {
    if (phone) {
      const fetchUserDetails = async () => {
        const response = await fetch(`/api/register?phone=${phone}`);
        if (response.ok) {
          const data = await response.json();
          setUserDetails(data);

          
          const qrData = `Name: ${data.name}\nEmail: ${data.email}\nPhone No: ${data.phone}\nLocation: ${data.location} `;

const qrCodeUrl = await QRCode.toDataURL(qrData);
setQrCode(qrCodeUrl);
        } else {
          alert("User not found.");
        }
      };

      fetchUserDetails();
    }
  }, [phone]);

  const downloadPDF = async () => {
    if (!userDetails) return;

    const element = document.getElementById("id-card-content");
    const html2pdf = (await import("html2pdf.js")).default;
    let ids: [number,number] = [90,150];
    const options = {
      filename: "ID_Card.pdf",
      image: { type: "png" },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: ids, orientation: "portrait" as "portrait" | "landscape" },
    };

    html2pdf().from(element!).set(options).save();
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-red-200 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">ID Card</h1>
        
        {userDetails ? (
          <div
            id="id-card-content"
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
            <div className="w-full h-[170px] rounded bg-blue-200 flex justify-around items-center mb-[20px] " style={{border:'3px solid #00ffff'}}>
              <div className="flex h-[100px] w-[100px] bg-white flex justify-center items-center " style={{borderRadius:'50%',border:'3px solid #00ffff'}}>
                <img
                  src={logo.src}
                  
                  alt="logo"
                  style={{ height: "75px", width: "75px" }}
                />
              </div>
              
            </div>
            <div className="bg-blue-200 h-[150px] w-[100%] rounded" style={{ display: 'flex', flexDirection: 'column',justifyContent:'center', alignItems: 'center',border:'3px solid #00ffff' }}>
              <p>Name: {userDetails.name}</p>
              <p>Phone: {userDetails.phone}</p>
              <p>Email: {userDetails.email}</p>
              <p>Place: {userDetails.location}</p>
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
        ) : (
          <p>Loading...</p>
        )}
        {userDetails && (
          <button
            onClick={downloadPDF}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
          >
            Download PDF
          </button>
        )}
      </div>
    </div>
  );
};

const IdPage = () => {
  return (
      <Suspense>
          <IdCard />
      </Suspense>
  );
}

export default IdPage;
