import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Menu</h2>
      <ul className="sidebar-list">
        <li className={location.pathname === "/packages" ? "active" : ""}>
          <Link to="/packages">📦 Database Paket</Link>
        </li>
        <li>
          <Link to="#">🚚 Batches Pengiriman</Link>
        </li>
        <li>
          <Link to="#">👥 Database Customer</Link>
        </li>
        <li>
          <Link to="#">🧾 Manage Invoice</Link>
        </li>
        <li>
          <Link to="#">📮 Request Pengantaran</Link>
        </li>
        <li>
          <Link to="#">✅ Update Status</Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
