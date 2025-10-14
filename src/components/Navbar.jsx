import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo_gex.png";

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // kembali ke halaman sebelumnya
  };

  return (
    <nav className="navbar">
      {/* Kiri */}
      <div className="navbar-left">
        {/* Tombol kembali */}
        <button
          className="back-btn"
          onClick={handleBack}
          style={{ marginRight: "10px" }}
        >
          &lt;
        </button>
        <img src={logo} alt="Logo" />
        <span>#BahagianyaOngkirMurah</span>
      </div>

      {/* Kanan */}
      <div className="navbar-right">
        <div className="user-info">
          <p className="name">{user?.name.toUpperCase() || "Guest"}</p>
          <p className="role">{user?.role || "User"}</p>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;