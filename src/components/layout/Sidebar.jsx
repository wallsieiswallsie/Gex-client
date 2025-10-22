import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { HiX } from "react-icons/hi";

const MENU_ITEMS = [
  { path: "/packages", label: "Database Paket", roles: ["Manager Destination Warehouse", "Manager Main Warehouse"] },
  { path: "/batches", label: "Batches Pengiriman", roles: ["Manager Destination Warehouse", "Manager Main Warehouse"] },
  { path: "#", label: "Database Customer", roles: ["Manager Destination Warehouse"] },
  { path: "/invoices", label: "Manage Invoice", roles: ["Manager Destination Warehouse"] },
  { path: "/selection_pengantaran", label: "Request Pengantaran", roles: ["Manager Destination Warehouse"] }, 
  { path: "/finance", label: "Keuangan", roles: ["Manager Destination Warehouse", "Manager Main Warehouse"] },
  { path: "/input", label: "Input Data Paket", roles: ["Manager Main Warehouse", "Staff Main Warehouse"] },
];

export default function Sidebar({ open, setOpen }) {
  const { user } = useAuth();
  const location = useLocation();

  const visibleMenu = useMemo(() => {
    if (!user?.role) return [];
    return MENU_ITEMS.filter((item) => item.roles.includes(user.role));
  }, [user?.role]);

  return (
    <>
      {/* Overlay hanya untuk mobile */}
      <div
        className={`sidebar-overlay ${open ? "sidebar-overlay--visible" : "sidebar-overlay--hidden"}`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar selalu terbuka di desktop */}
      <aside className={`sidebar ${open ? "sidebar--open" : "sidebar--closed"}`}>
        <div className="sidebar__header">
          <h2 className="sidebar__title">Menu</h2>
          {/* Tombol tutup hanya muncul di mobile */}
          <button className="sidebar__close-btn md:hidden" onClick={() => setOpen(false)}>
            <HiX size={20} />
          </button>
        </div>

        <ul className="sidebar__menu">
          {visibleMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path} className="sidebar__item">
                <Link
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`sidebar__link ${
                    isActive ? "sidebar__link--active" : "sidebar__link--inactive"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
} 