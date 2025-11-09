import React from "react";
import { useNavigate } from "react-router-dom";

const BatchSelectionPage = () => {
  const navigate = useNavigate();

  const handleClick = (via) => {
    navigate(`/batches/${via.toLowerCase()}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Card Kapal */}
      <div
        className="bg-white shadow-lg rounded-2xl p-6 cursor-pointer hover:shadow-xl transition flex flex-col justify-center items-start gap-2 border border-[#3e146d]/20"
        onClick={() => handleClick("Kapal")}
      >
        <h2 className="text-xl font-bold text-[#3e146d]">Kapal</h2>
        <p className="text-gray-700">Kelola batch kapal</p>
      </div>

      {/* Card Pesawat */}
      <div
        className="bg-white shadow-lg rounded-2xl p-6 cursor-pointer hover:shadow-xl transition flex flex-col justify-center items-start gap-2 border border-[#3e146d]/20"
        onClick={() => handleClick("Pesawat")}
      >
        <h2 className="text-xl font-bold text-[#3e146d]">Pesawat</h2>
        <p className="text-gray-700">Kelola batch pesawat</p>
      </div>
    </div>
  );
};

export default BatchSelectionPage;