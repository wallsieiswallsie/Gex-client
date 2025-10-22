import React from "react";
import { useNavigate } from "react-router-dom";

const AimasModaSelectionPage = () => {
  const navigate = useNavigate();

  const handleClick = (via) => {
    navigate(`/finance/aimas/${via.toLowerCase()}`);
  };

  return (
    <div className="cards-container">
        {/* Card Kapal */}
        <div
          className="card"
          onClick={() => handleClick("Kapal")}
        >
          <h2 className="finance_selection-content">Kapal</h2>
          <p className="finance_selection-content">Update laporan kapal</p>
        </div>

        {/* Card Pesawat */}
        <div
          className="card"
          onClick={() => handleClick("Pesawat")}
        >
          <h2 className="finance_selection-content">Pesawat</h2>
          <p className="finance_selection-content">Update laporan pesawat</p>
        </div>
    </div>
  );
};

export default AimasModaSelectionPage;