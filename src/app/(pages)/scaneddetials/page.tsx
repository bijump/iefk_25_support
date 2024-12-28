'use client';

import { useEffect, useState } from "react";
import * as XLSX from "xlsx"; 
import { useRouter } from "next/navigation";

interface ScannedData {
  _id: string;
  data: string;
  createdAt: string;
  scannedAt: string;
}

export default function ScannedDataPage() {
  const [scannedData, setScannedData] = useState<ScannedData[]>([]);
  const [filteredData, setFilteredData] = useState<ScannedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    
    const isLogedin = localStorage.getItem("isLoggedIn") === "true";

    if (!isLogedin) {
      router.push("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  useEffect(() => {
    if (isAuthorized) {
      const fetchScannedData = async () => {
        try {
          const response = await fetch("/api/scandetials");
          const data = await response.json();
          setScannedData(data);
        } catch (error) {
          console.error("Error fetching scanned data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchScannedData();
    }
  }, [isAuthorized]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.value;
    setSelectedDate(selected);

    if (selected) {
      const filtered = scannedData.filter((item) =>
        new Date(item.scannedAt).toISOString().startsWith(selected)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    const dataToExport = scannedData.map((item, index) => {
      const { Name, "Phone No": PhoneNo } = Object.fromEntries(
        item.data.split("\n").map((line) => line.split(": ").map((s) => s.trim()))
      );

      return {
        No: index + 1,
        Name,
        PhoneNo,
      };
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);

    XLSX.utils.book_append_sheet(wb, ws, "Scanned Data");

    XLSX.writeFile(wb, "scanned_data.xlsx");
  };

  if (!isAuthorized) return null;

  if (loading) return <p className="text-center text-lg font-medium">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Scanned Data</h1>

      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={exportToExcel}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Export
        </button>

        <div className="flex justify-center">
          <label className="mr-2 font-medium">Filter by Day:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>
      </div>

      {!selectedDate ? (
        <p className="text-center text-lg font-medium text-gray-500">Please select a date to view data.</p>
      ) : filteredData.length === 0 ? (
        <p className="text-center text-lg font-medium text-gray-500">No data available for the selected date.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">No</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Phone No</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => {
                const { Name, "Phone No": PhoneNo } = Object.fromEntries(
                  item.data.split("\n").map((line) => line.split(": ").map((s) => s.trim()))
                );

                return (
                  <tr key={item._id || index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{Name}</td>
                    <td className="border border-gray-300 px-4 py-2">{PhoneNo}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
