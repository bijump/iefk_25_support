"use client";

import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const QRCodeScannerPage = () => {
  const [barcodeData, setBarcodeData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    if (videoRef.current) {
      codeReader
        .decodeFromVideoDevice(undefined, videoRef.current, async (result, decodeError) => {
          if (result) {
            setBarcodeData(result.getText());
            setError(null);

            try {
              const isUrl = /^https?:\/\/[^\s]+$/.test(result.getText());
              console.log("Scanned Data:", result.getText());

              if (isUrl) {
                console.log("Scanned URL:", result.getText());
              } else {
                console.log("Scanned QR Code Data:", result.getText());
              }
            } catch (err) {
              setError("Error processing barcode data.");
              console.error(err);
            }
          } else if (decodeError) {
            setError("No barcode detected");
          }
        })
        .catch((err) => {
          console.error("Error initializing scanner:", err);
          setError("Failed to initialize scanner");
        });

      // return () => {
      //   codeReader.stop();
        
      // };
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-green-100">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">QR Code Scanner</h1>
        <div className="relative bg-white rounded-lg shadow-md p-4">
          <video ref={videoRef} className="w-full rounded-lg" autoPlay muted></video>
        </div>
        <div className="mt-4">
          {barcodeData ? (
            <p className="text-green-600 font-semibold">
              Scanned Data: <span className="text-black">{barcodeData}</span>
            </p>
          ) : error ? (
            <p className="text-red-600 font-semibold">{error}</p>
          ) : (
            <p className="text-gray-600">Point your camera at a QR code to scan.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeScannerPage;
