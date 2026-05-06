import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminNav() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="admin-mobile-bar">
        <button className="admin-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileOpen ? (
              <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
            ) : (
              <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>
            )}
          </svg>
        </button>
        <span className="admin-mobile-brand">Basquiat.</span>
        <div className="admin-mobile-avatar">
          {user?.username?.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && <div className="admin-overlay" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`admin-sidebar${mobileOpen ? " open" : ""}`}>
        <div className="admin-sidebar-brand">
          <h1 className="admin-brand">Basquiat.</h1>
          <span className="admin-brand-sub">Admin Panel</span>
        </div>

        <nav className="admin-nav-links">
          <NavLink to="/admin" end className={({ isActive }) => `admin-nav-item${isActive ? " active" : ""}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => `admin-nav-item${isActive ? " active" : ""}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            <span>Orders</span>
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => `admin-nav-item${isActive ? " active" : ""}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            <span>Products</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">{user?.username?.charAt(0).toUpperCase()}</div>
            <span className="admin-user-name">{user?.username}</span>
          </div>
          <button className="admin-logout-btn" onClick={logout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}