import React, { createContext, useContext, useReducer, useEffect } from "react";
import { generateTransactions } from "../data/mockData";

const AppContext = createContext();

const initialState = {
  transactions: [],
  role: "viewer",
  filters: { type: "all", category: "all", search: "", sortBy: "date", sortOrder: "desc" },
  theme: "dark",
  activeTab: "dashboard",
};

function appReducer(state, action) {
  switch (action.type) {
    case "INIT_TRANSACTIONS":
      return { ...state, transactions: action.payload };
    case "ADD_TRANSACTION":
      const newTransactions = [action.payload, ...state.transactions];
      localStorage.setItem("finance_transactions", JSON.stringify(newTransactions));
      return { ...state, transactions: newTransactions };
    case "EDIT_TRANSACTION":
      const updated = state.transactions.map((t) => (t.id === action.payload.id ? action.payload : t));
      localStorage.setItem("finance_transactions", JSON.stringify(updated));
      return { ...state, transactions: updated };
    case "DELETE_TRANSACTION":
      const filtered = state.transactions.filter((t) => t.id !== action.payload);
      localStorage.setItem("finance_transactions", JSON.stringify(filtered));
      return { ...state, transactions: filtered };
    case "SET_ROLE":
      localStorage.setItem("finance_role", action.payload);
      return { ...state, role: action.payload };
    case "SET_FILTER":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "SET_THEME":
      localStorage.setItem("finance_theme", action.payload);
      return { ...state, theme: action.payload };
    case "SET_TAB":
      return { ...state, activeTab: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem("finance_transactions");
    const savedRole = localStorage.getItem("finance_role") || "viewer";
    const savedTheme = localStorage.getItem("finance_theme") || "dark";
    const transactions = saved ? JSON.parse(saved) : generateTransactions();
    if (!saved) localStorage.setItem("finance_transactions", JSON.stringify(transactions));
    dispatch({ type: "INIT_TRANSACTIONS", payload: transactions });
    dispatch({ type: "SET_ROLE", payload: savedRole });
    dispatch({ type: "SET_THEME", payload: savedTheme });
  }, []);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
