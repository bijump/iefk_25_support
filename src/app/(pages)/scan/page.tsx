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


  ////////phone save detials


  const [phone, setPhone] = useState('');
    const [userData, setUserData] = useState<any>(null);
    const [errorr, setErrorr] = useState('');
    const [saveMessage, setSaveMessage] = useState('');
  
    const handleFetchData = async () => {
      setErrorr('');
      setUserData(null);
      setSaveMessage('');
  
      try {
        const response = await fetch('/api/fetchphone', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone }),
        });
  
        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error || 'Error fetching user');
        }
  
        const data = await response.json();
        setUserData(data.user);
      } catch (err: any) {
        setErrorr(err.message);
      }
    };
  
    const handleSaveData = async () => {
      setErrorr('');
      setSaveMessage('');
  
      try {
        
        const formattedData = `Name: ${userData.name}\nEmail: ${userData.email}\nPhone No: ${userData.phone}\nLocation: ${userData.location || 'N/A'}`;
  
        const response = await fetch('/api/saveparticipant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: formattedData }), 
        });
  
        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error || 'Error saving participant');
        }
  
        setSaveMessage('User data saved successfully!');
      } catch (err: any) {
        setErrorr(err.message);
      }
    };





  

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
    <>
   

    <div className="flex flex-col gap-[10px] items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-green-100">




    <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Fetch and Save User</h1>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="text"
            id="phone"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>
        <button
          onClick={handleFetchData}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Get User
        </button>

        {errorr && <p className="mt-4 text-sm text-red-500">{errorr}</p>}
        {saveMessage && <p className="mt-4 text-sm text-green-500">{saveMessage}</p>}

        {userData && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
            <h2 className="text-lg font-semibold text-gray-700">User Data:</h2>
            <p className="mt-2 text-sm text-gray-600">
              <strong>Name:</strong> {userData.name}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              <strong>Email:</strong> {userData.email}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              <strong>Phone:</strong> {userData.phone}
            </p>
            {userData.location && (
              <p className="mt-2 text-sm text-gray-600">
                <strong>Location:</strong> {userData.location}
              </p>
            )}
            <button
              onClick={handleSaveData}
              className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Save User
            </button>
          </div>
        )}
      </div>





      

    
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
    </>
  );
};

export default QRCodeScannerPage;
