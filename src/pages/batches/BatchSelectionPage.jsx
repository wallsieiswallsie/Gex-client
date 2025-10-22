import React from "react";
import { useNavigate } from "react-router-dom";

const BatchSelectionPage = () => {
  const navigate = useNavigate();

  const handleClick = (via) => {
    navigate(`/batches/${via.toLowerCase()}`);
  };

  return (
    <div className="cards-container">
        {/* Card Kapal */}
        <div
          className="card"
          onClick={() => handleClick("Kapal")}
        >
          <h2 className="batch_selection-content">Kapal</h2>
          <p className="batch_selection-content">Kelola batch kapal</p>
        </div>

        {/* Card Pesawat */}
        <div
          className="card"
          onClick={() => handleClick("Pesawat")}
        >
          <h2 className="batch_selection-content">Pesawat</h2>
          <p className="batch_selection-content">Kelola batch pesawat</p>
        </div>
    </div>
  );
};

export default BatchSelectionPage;