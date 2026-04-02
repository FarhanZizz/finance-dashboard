import React, { useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { computeSummary, formatCurrency } from "../../utils/helpers";

function SummaryCards({ transactions }) {
  const { income, expenses, balance } = computeSummary(transactions);
  const count = transactions.length;

  return (
    <div className="summary-grid">
      <div className="summary-card balance">
        <div className="summary-label">Net Balance</div>
        <div className="summary-amount">{formatCurrency(balance)}</div>
        <div className="summary-meta">{count} total transactions</div>
        <div className="summary-icon">◈</div>
      </div>
      <div className="summary-card income">
        <div className="summary-label">Total Income</div>
        <div className="summary-amount">{formatCurrency(income)}</div>
        <div className="summary-meta">
          {transactions.filter((t) => t.type === "income").length} income entries
        </div>
        <div className="summary-icon">↑</div>
      </div>
      <div className="summary-card expense">
        <div className="summary-label">Total Expenses</div>
        <div className="summary-amount">{formatCurrency(expenses)}</div>
        <div className="summary-meta">
          {transactions.filter((t) => t.type === "expense").length} expense entries
        </div>
        <div className="summary-icon">↓</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { state } = useApp();
  const { transactions } = state;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Dashboard</div>
        <div className="page-subtitle">financial overview · {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</div>
      </div>
      <SummaryCards transactions={transactions} />
    </div>
  );
}
