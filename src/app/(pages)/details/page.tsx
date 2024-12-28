'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string | null;
}

export default function DetailsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;
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
      async function fetchUsers() {
        try {
          const response = await fetch('/api/detials');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          console.error('Failed to fetch users:', error);
        } finally {
          setLoading(false);
        }
      }

      fetchUsers();
    }
  }, [isAuthorized]);

  const totalPages = Math.ceil(users.length / rowsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const paginatedUsers = users.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const exportToExcel = () => {
    const dataToExport = users.map((user, index) => ({
      No: index + 1,
      Name: user.name,
      Email: user.email,
      Phone: user.phone,
      Location: user.location ?? 'Not provided',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'users.xlsx');
  };

  if (!isAuthorized) return null; 

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  if (users.length === 0)
    return <p className="text-center text-gray-500">No users found.</p>;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Registered Details</h1>
      <p className="text-center text-lg mb-4">
        Registered Users: {users.length}
      </p>

      <div className="flex justify-end mb-4">
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Export
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">NO</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, index) => (
              <tr
                key={user.id}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {(currentPage - 1) * rowsPerPage + index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {user.email}
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">{user.phone}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.location ?? 'Not provided'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
