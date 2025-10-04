import React from "react";
import { useNavigate } from "react-router-dom";

const DeliverySelectionPage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/pengantaran");
  };

  return (
    <div className="delivery_selection-container">
        <div
          className="delivery_selection-card"
          onClick={() => handleClick()}
        >
          <h2 className="batch_selection-content">Daftar Request</h2>
          <p className="batch_selection-content">Buat request pengantaran</p>
        </div>
        <h2>Card: Daftar Request, Dalam Pengantaran, Arsip Pengantaran</h2>
    </div>
  );
};

export default DeliverySelectionPage;