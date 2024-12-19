"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import logo from "../../../images/IEFK25- Logo png (1).avif";

const IdCard = () => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");

  useEffect(() => {
    if (phone) {
      const fetchUserDetails = async () => {
        const response = await fetch(`/api/register?phone=${phone}`);
        if (response.ok) {
          const data = await response.json();
          setUserDetails(data);
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
    const options = {
      filename: "ID_Card.pdf",
      image: { type: "png" },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as "portrait" | "landscape" },
    };

    html2pdf().from(element!).set(options).save();
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-green-200 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">ID Card</h1>
        
        {userDetails ? (
          <div
            id="id-card-content"
            className="bg-red-700 text-white font-bold rounded p-4"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              color: "#ffd700",
            }}
          >
            <div className="w-full h-[100px] rounded bg-blue-200 flex justify-center items-center mb-[20px]">
          <img
            src={logo.src}
            alt="logo"
            style={{ height: "100px", width: "100px" }}
          />
        </div>
            <div>
              <p>Name: {userDetails.name}</p>
              <p>Phone: {userDetails.phone}</p>
              <p>Email: {userDetails.email}</p>
              <p>Place: {userDetails.location}</p>
            </div>
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

export default IdCard;
