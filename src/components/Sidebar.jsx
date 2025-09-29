// components/Sidebar.jsx
import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Menu config untuk fleksibilitas
const MENU_ITEMS = [
  { path: "/packages", label: "📦 Database Paket", roles: ["manager_destination_shipping"] },
  { path: "#", label: "🚚 Batches Pengiriman", roles: ["manager_destination_shipping"] },
  { path: "#", label: "👥 Database Customer", roles: ["manager_destination_shipping"] },
  { path: "/invoices", label: "🧾 Manage Invoice", roles: ["manager_destination_shipping"] },
  { path: "#", label: "📮 Request Pengantaran", roles: ["manager_destination_shipping"] },
  { path: "#", label: "✅ Update Status", roles: ["manager_destination_shipping"] },
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