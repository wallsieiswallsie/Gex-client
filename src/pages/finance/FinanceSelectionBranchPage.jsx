import React from "react";
import { useNavigate } from "react-router-dom";

const FinanceSelectionBranchPage = () => {
  const navigate = useNavigate();

  const handleClick = (branch) => {
    navigate(`/finance/${branch.toLowerCase()}`);
  };

  return (
    <div className="finance_selection-container">
        <div
          className="finance_selection-card"
          onClick={() => handleClick("Remu")}
        >
          <h2 className="finance_selection-content">Remu</h2>
          <p className="finance_selection-content">Kelola laporan Remu</p>
        </div>

        <div
          className="finance_selection-card"
          onClick={() => handleClick("Aimas")}
        >
          <h2 className="finance_selection-content">Aimas</h2>
          <p className="finance_selection-content">Kelola laporan Aimas</p>
        </div>
    </div>
  );
};

export default FinanceSelectionBranchPage;