import React from "react";
// import img from '../../images/fe9502_7788884ebccd45d5a5e86317b9014c7f~mv2.jpg'
import Image from 'next/image';


const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row items-center justify-center  bg-gradient-to-r from-blue-100 to-green-100 px-4 sm:px-8 py-8">
     
      <div className="sm:w-1/2 text-center sm:text-left">
        <h1 className="text-4xl font-bold text-blue-800 mb-6">Welcome to IEFK</h1>
        <p className="text-lg text-gray-700 leading-relaxed">
        The IEFK 2025 brings together global energy professionals, thought leaders, policymakers, and innovators 
          for a three-day event showcasing Kerala’s commitment to sustainable energy and decarbonization. 
          The event serves as a catalyst for the state’s clean energy transformation, 
          offering a forum for collaboration, knowledge sharing, and exploring opportunities 
          across sectors such as renewable energy, energy efficiency, sustainable technologies, and more
        </p>
      </div>

      
      <div className="sm:w-1/2 mt-8 sm:mt-0 flex justify-center">
      {/* <div style={{ position: 'relative', width: '100%', height: '400px' }}> */}
  <Image
    src="/images/hero1.jpg"
    alt="Description"
    
  width={100} 
  height={400} 
  layout="responsive"
  />

        </div>
    </div>
  );
};

export default HomePage;
