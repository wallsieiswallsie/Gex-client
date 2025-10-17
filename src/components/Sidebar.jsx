// components/Sidebar.jsx
import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Menu config untuk fleksibilitas
const MENU_ITEMS = [
  { path: "/packages", label: "Database Paket", roles: ["Manager Destination Warehouse", "Manager Main Warehouse"] },
  { path: "/batches", label: "Batches Pengiriman", roles: ["Manager Destination Warehouse", "Manager Main Warehouse"] },
  { path: "#", label: "Database Customer", roles: ["Manager Destination Warehouse"] },
  { path: "/invoices", label: "Manage Invoice", roles: ["Manager Destination Warehouse"] },
  { path: "/selection_pengantaran", label: "Request Pengantaran", roles: ["Manager Destination Warehouse"] },
  //{ path: "#", label: "Update Status", roles: ["Manager Destination Warehouse"] },
  { path: "/finance", label: "Keuangan", roles: ["Manager Destination Warehouse", "Manager Main Warehouse"] },

  { path: "/input", label: "Input Data Paket", roles: ["Manager Main Warehouse", "Staff Main Warehouse"] },
  { path: "/packing", label: "Packing", roles: ["Manager Main Warehouse", "Staff Main Warehouse"] },
];

function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  // Hanya hitung menu yang sesuai role
  const visibleMenu = useMemo(() => {
    if (!user?.role) return [];
    return MENU_ITEMS.filter((item) => item.roles.includes(user.role));
  }, [user?.role]);

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Menu</h2>
      <ul className="sidebar-list">
        {visibleMenu.map((item) => (
          <li key={item.path} className={location.pathname === item.path ? "active" : ""}>
            <Link to={item.path}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default React.memo(Sidebar);