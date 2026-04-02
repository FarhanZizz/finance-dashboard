import React, { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function Layout({ children }) {
  const { state, dispatch } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "⬡" },
    { id: "transactions", label: "Transactions", icon: "⇄" },
    { id: "insights", label: "Insights", icon: "◎" },
  ];

  const setTab = (id) => { dispatch({ type: "SET_TAB", payload: id }); setMenuOpen(false); };
  const setRole = (role) => dispatch({ type: "SET_ROLE", payload: role });
  const toggleTheme = () => dispatch({ type: "SET_THEME", payload: state.theme === "dark" ? "light" : "dark" });

  return (
    <div className="layout">
      <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>☰</button>

      {menuOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 99 }}
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon">💎</div>
            <div>
              <div className="logo-text">Finyō</div>
              <div className="logo-sub">Finance Dashboard</div>
            </div>
          </div>
        </div>

        <nav className="nav-section">
          <div className="nav-label">Navigation</div>
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`nav-btn ${state.activeTab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              <span className="nav-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="role-selector">
            <div className="role-label">Active Role</div>
            <div className="role-toggle">
              <button
                className={`role-btn ${state.role === "viewer" ? "active" : ""}`}
                onClick={() => setRole("viewer")}
              >
                👁 Viewer
              </button>
              <button
                className={`role-btn ${state.role === "admin" ? "active" : ""}`}
                onClick={() => setRole("admin")}
              >
                ⚡ Admin
              </button>
            </div>
          </div>
          <button className="theme-btn" onClick={toggleTheme}>
            {state.theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}
