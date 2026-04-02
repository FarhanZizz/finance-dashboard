import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Layout from "./components/Layout/Layout";
import "./index.css";

function AppContent() {
  const { state } = useApp();
  return (
    <div className={`app ${state.theme}`}>
      <Layout>
        <div className="page-header">
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">layout scaffold</div>
        </div>
      </Layout>
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
