import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import "./index.css";

function AppContent() {
  const { state } = useApp();
  return (
    <div className={`app ${state.theme}`}>
      <p style={{ padding: 32, color: "var(--text-primary)" }}>
        Context ready · theme: {state.theme} · role: {state.role} · transactions: {state.transactions.length}
      </p>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
