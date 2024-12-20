"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { z } from "zod";


const registrationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone number is required").regex(/^\d{10}$/, "Phone number must be 10 digits"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  location: z.string().min(1, "Location is required"),
});

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

   
    const result = registrationSchema.safeParse(formData);

    if (!result.success) {
      
      result.error.errors.forEach((err) => {
        toast.error(err.message);
      });
      return;
    }

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      toast.success("Registration successful! Redirecting...");
      router.push(`/idcard?phone=${formData.phone}`);
    } else {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundImage: 'linear-gradient(to top, #3a7eba, #0299ca, #00b3d2, #33ccd1, #6ce3cc);' }}>
      <div className="bg-blue-700 p-8 rounded shadow-md w-full max-w-md md:max-w-lg lg:max-w-xl">
        <h1 className="text-2xl font-bold text-center mb-6">Registration Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Place</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter your place"
              
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
