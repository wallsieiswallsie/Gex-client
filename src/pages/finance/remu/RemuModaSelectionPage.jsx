import React from "react";
import { useNavigate } from "react-router-dom";

const RemuModaSelectionPage = () => {
  const navigate = useNavigate();

  const handleClick = (via) => {
    navigate(`/finance/remu/${via.toLowerCase()}`);
  };

  return (
    <div className="finance_selection-container">
        {/* Card Kapal */}
        <div
          className="finance_selection-card"
          onClick={() => handleClick("Kapal")}
        >
          <h2 className="finance_selection-content">Kapal</h2>
          <p className="finance_selection-content">Update laporan kapal</p>
        </div>

        {/* Card Pesawat */}
        <div
          className="finance_selection-card"
          onClick={() => handleClick("Pesawat")}
        >
          <h2 className="finance_selection-content">Pesawat</h2>
          <p className="finance_selection-content">Update laporan pesawat</p>
        </div>
    </div>
  );
};

export default RemuModaSelectionPage;