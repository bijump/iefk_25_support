'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from 'next/navigation';



const QRCodeScannerPage = () => {
  const [barcodeData, setBarcodeData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();





  const [phone, setPhone] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [errorr, setErrorr] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [selectedOption, setSelectedOption] = useState('phone');

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
      // setErrorr(err.message);
      toast.error(err.message ||'phone number required') 
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
        throw new Error(error || ' participant already exist');
        
      }

      // setSaveMessage('User data saved successfully!');
      toast.success('User data saved successfully!')
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
    if (isAuthorized && selectedOption === "qr-code") {
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
  }, [isAuthorized, selectedOption]);

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
  console.log(selectedOption)

  return (
    <>


      <div className="flex flex-col gap-[10px] items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-green-100">
      <ToastContainer position="top-right" autoClose={3000} />

        <div className='h-[500px] w-full max-w-[90%] md:max-w-[70%] lg:max-w-[40%] shadow-lg border bg-white '>
          <div className='h-[50px] w-full flex items-center justify-center gap-[40px] cursor-pointer'>
            <p
              className={selectedOption === 'phone' ? 'font-bold border-b-2 border-blue-500 ' : ''}
              onClick={() => setSelectedOption('phone')}
            >Phone</p>

            <p
              className={selectedOption === 'qr-code' ? 'font-bold border-b-2 border-blue-500 cursor-pointer' : ''}
              onClick={() => setSelectedOption('qr-code')}
            >Qr-code</p>
          </div>
          <div className='p-4'>
            {selectedOption === 'phone' && (

              <>

                {/* <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full flex-col flex items-center justify-center">
                  //  */}
                  <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">Fetch and Save User</h1>
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

                  {errorr && <p className="mt-1 text-sm text-red-500">{errorr}</p>}
                  {saveMessage && <p className="mt-1 text-sm text-green-500">{saveMessage}</p>}

                  {userData && (
                    <div className="mt-2 bg-gray-50 p-4 rounded-lg shadow-inner">
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
                        Admit
                      </button>
                    </div>
                  )}
                {/* </div> */}

              </>
            )}

            {selectedOption === 'qr-code' && (
              <>

{/* <div className="w-[300px] max-w-lg p-6 h-[300px] bg-white rounded-lg shadow-md"> */}
          {/*  */}
          <h1 className="text-2xl font-bold mb-4 text-center">QR Code Scanner</h1>
          <div className="relative [200px] h-[200px]  bg-white rounded-lg  p-4 flex items-center justify-center">
            <video ref={videoRef} className="w-[200px] h-[200px]  rounded-lg" autoPlay muted/>
          </div>
          <div className="">
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
              <p className="text-red-600 font-semibold text-center">{error}</p>
            ) : (
              <p className="text-gray-600 text-center">Point your camera at a QR code to scan.</p>
            )}
            {saveSuccess && <p className="text-green-600 mt-2">{saveSuccess}</p>}
          </div>
        {/* </div> */}
              </>

            )}
          </div>

        </div>

        
      </div>
    </>
  );
};

export default QRCodeScannerPage;
