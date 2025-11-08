import React from "react";
import { HiMenu } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi"; // ikon logout
import { useNavigate } from "react-router-dom";
import logo from "../../../public/images/logo_gex.png";

function Navbar({ user, onLogout, onToggleSidebar }) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/login-customer");
  };

  return (
    <nav className="navbar">
      {/* === KIRI === */}
      <div className="navbar-left">
        {/* Tombol burger (mobile) */}
        <button
          className="burger-btn md:hidden"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <HiMenu size={26} />
        </button>

        {/* Logo & tagline (desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <button className="back-btn" onClick={handleBack}>
            &lt;
          </button>
          <img src={logo} alt="Logo" className="h-8" />
          <span className="text-sm text-gray-600 font-medium">
            #BahagianyaOngkirMurah
          </span>
        </div>
      </div>

      {/* === KANAN === */}
      <div className="navbar-right">
        <div className="user-info text-right">
          <p className="name text-sm font-semibold text-black">
            {user?.name?.toUpperCase() || "GUEST"}
          </p>
          <p className="role text-xs text-gray-500">{user?.role || "User"}</p>
        </div>

        {/* Tombol logout ikon saja */}
        <button
          className="logout-icon-btn"
          onClick={onLogout}
          title="Logout"
        >
          <FiLogOut size={24} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;