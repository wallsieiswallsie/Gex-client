import React from "react";
import logo from "../assets/images/logo_gex.png";

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      {/* Kiri */}
      <div className="navbar-left">
        <img
          src={logo}
          alt="Logo"
        />
        <span>#BahagianyaOngkirMurah</span>
      </div>

      {/* Kanan */}
      <div className="navbar-right">
        <div className="user-info">
          <p className="name">{user?.name || "Guest"}</p>
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
