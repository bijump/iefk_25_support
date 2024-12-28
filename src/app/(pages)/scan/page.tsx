'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const QRCodeScannerPage = () => {
  const [barcodeData, setBarcodeData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isLogedin = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLogedin) {
      router.push('/login'); 
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  useEffect(() => {
    if (isAuthorized) {
      const codeReader = new BrowserMultiFormatReader();

      if (videoRef.current) {
        codeReader
          .decodeFromVideoDevice(undefined, videoRef.current, async (result, decodeError) => {
            if (result) {
              setBarcodeData(result.getText());
              setError(null);
            } else if (decodeError) {
              setError('No barcode detected');
            }
          })
          .catch((err) => {
            console.error('Error initializing scanner:', err);
            setError('Failed to initialize scanner');
          });
      }
    }
  }, [isAuthorized]);

  const saveData = async () => {
    if (!barcodeData) {
      toast.error('No data to save');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcodeData }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('Data saved successfully!');
        setBarcodeData(null);
      } else if (response.status === 409) {
        toast.error('Data already saved for today');
      } else {
        toast.error(result.error || 'Failed to save data');
      }
    } catch (err) {
      console.error('Error saving data:', err);
      toast.error('An error occurred while saving data');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthorized) return null; 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-green-100">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">QR Code Scanner</h1>
        <div className="relative bg-white rounded-lg shadow-md p-4">
          <video ref={videoRef} className="w-full rounded-lg" autoPlay muted></video>
        </div>
        <div className="mt-4">
          {barcodeData ? (
            <>
              <p className="text-green-600 font-semibold">
                Scanned Data: <span className="text-black">{barcodeData}</span>
              </p>
              <button
                onClick={saveData}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Data'}
              </button>
            </>
          ) : error ? (
            <p className="text-red-600 font-semibold">{error}</p>
          ) : (
            <p className="text-gray-600">Point your camera at a QR code to scan.</p>
          )}
          {saveSuccess && <p className="text-green-600 mt-2">{saveSuccess}</p>}
        </div>
      </div>
    </div>
  );
};

export default QRCodeScannerPage;
