import React from "react";
import { useNavigate } from "react-router-dom";

const DeliverySelectionPage = () => {
  const navigate = useNavigate();

  const handleClick1 = () => {
    navigate("/pengantaran");
  };

  const handleClick2 = () => {
    navigate("/pengantaran_active");
  };

  const handleClick3 = () => {
    navigate("/pengantaran_archive");
  };

  return (
    <div className="cards-container">
        <div
          className="card"
          onClick={() => handleClick1()}
        >
          <h2 className="batch_selection-content">Daftar Request</h2>
          <p className="batch_selection-content">Buat request pengantaran</p>
        </div>
        <div
          className="card"
          onClick={() => handleClick2()}
        >
          <h2 className="batch_selection-content">Dalam Pengantaran</h2>
          <p className="batch_selection-content">Pengantaran Aktif</p>
        </div>
        <div
          className="card"
          onClick={() => handleClick3()}
        >
          <h2 className="batch_selection-content">Arsip</h2>
          <p className="batch_selection-content">Arsip Pengantaran</p>
        </div>
    </div>
  );
};

export default DeliverySelectionPage;