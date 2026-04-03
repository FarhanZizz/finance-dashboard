import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Layout from "./components/Layout/Layout";
import Dashboard from "./components/Dashboard/Dashboard";
import Transactions from "./components/Transactions/Transactions";
import "./index.css";

function AppContent() {
  const { state } = useApp();
  return (
    <div className={`app ${state.theme}`}>
      <Layout>
        {state.activeTab === "dashboard" && <Dashboard />}
        {state.activeTab === "transactions" && <Transactions />}
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
