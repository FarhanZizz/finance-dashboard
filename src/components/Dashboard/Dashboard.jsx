import React, { useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { computeSummary, formatCurrency, getSpendingByCategory } from "../../utils/helpers";
import { MONTHLY_DATA } from "../../data/mockData";

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
        <div className="summary-meta">{transactions.filter((t) => t.type === "income").length} income entries</div>
        <div className="summary-icon">↑</div>
      </div>
      <div className="summary-card expense">
        <div className="summary-label">Total Expenses</div>
        <div className="summary-amount">{formatCurrency(expenses)}</div>
        <div className="summary-meta">{transactions.filter((t) => t.type === "expense").length} expense entries</div>
        <div className="summary-icon">↓</div>
      </div>
    </div>
  );
}

function BarChart() {
  const maxVal = Math.max(...MONTHLY_DATA.map((d) => Math.max(d.income, d.expenses)));
  return (
    <div className="card chart-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div className="chart-title">Monthly Cash Flow</div>
          <div className="chart-subtitle">Income vs Expenses · 2024</div>
        </div>
      </div>
      <div className="bar-chart">
        {MONTHLY_DATA.map((d) => (
          <div key={d.month} className="bar-group">
            <div className="bar-pair" style={{ height: "140px" }}>
              <div className="bar income-bar" style={{ height: `${(d.income / maxVal) * 100}%` }} title={`Income: ৳${d.income.toLocaleString()}`} />
              <div className="bar expense-bar" style={{ height: `${(d.expenses / maxVal) * 100}%` }} title={`Expenses: ৳${d.expenses.toLocaleString()}`} />
            </div>
            <div className="bar-label">{d.month}</div>
          </div>
        ))}
      </div>
      <div className="chart-legend">
        <div className="legend-item"><div className="legend-dot" style={{ background: "var(--green)" }} />Income</div>
        <div className="legend-item"><div className="legend-dot" style={{ background: "var(--red)", opacity: 0.7 }} />Expenses</div>
      </div>
    </div>
  );
}

function DonutChart({ transactions }) {
  const data = useMemo(() => getSpendingByCategory(transactions), [transactions]);
  const total = data.reduce((s, d) => s + d.value, 0);
  const top5 = data.slice(0, 5);
  const size = 140, r = 52, cx = size / 2, cy = size / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  const segments = top5.map((d) => {
    const pct = d.value / total;
    const dash = pct * circumference;
    const seg = { ...d, pct, dash, offset };
    offset += dash;
    return seg;
  });
  return (
    <div className="card chart-card">
      <div className="chart-title">Spending Breakdown</div>
      <div className="donut-wrapper">
        <svg width={size} height={size} className="donut-svg">
          {segments.map((seg, i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth={20}
              strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
              strokeDashoffset={-seg.offset + circumference / 4}
              style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px`, transition: "opacity 0.2s" }} />
          ))}
          <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">TOTAL</text>
          <text x={cx} y={cy + 8} textAnchor="middle" fill="var(--text-primary)" fontSize="13" fontWeight="700" fontFamily="var(--font-display)">{formatCurrency(total)}</text>
        </svg>
        <div className="category-list">
          {top5.map((d) => (
            <div key={d.key} className="category-item">
              <div className="category-dot" style={{ background: d.color }} />
              <span className="category-name">{d.icon} {d.label}</span>
              <div className="category-bar-wrap">
                <div className="category-bar-fill" style={{ width: `${d.pct * 100}%`, background: d.color }} />
              </div>
              <span className="category-pct">{(d.pct * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
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
      <div className="charts-grid">
        <BarChart />
        <DonutChart transactions={transactions} />
      </div>
    </div>
  );
}
