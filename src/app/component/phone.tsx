'use client';

import React, { useState } from 'react';

function Phone() {
  const [phone, setPhone] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const handleFetchData = async () => {
    setError('');
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
      setError(err.message);
    }
  };

  const handleSaveData = async () => {
    setError('');
    setSaveMessage('');

    try {
      // Format the data into the desired string format
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
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
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

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
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
    </div>
  );
}

export default Phone;
