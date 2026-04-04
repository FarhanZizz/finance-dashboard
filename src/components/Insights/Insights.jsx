import React, { useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { computeSummary, formatCurrency, formatFullCurrency, getSpendingByCategory } from "../../utils/helpers";
import { MONTHLY_DATA } from "../../data/mockData";

export default function Insights() {
  const { state } = useApp();
  const { transactions } = state;

  const spendingByCategory = useMemo(() => getSpendingByCategory(transactions), [transactions]);
  const top = spendingByCategory[0];
  const { income, expenses, balance } = useMemo(() => computeSummary(transactions), [transactions]);
  const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(1) : 0;

  const maxIncome = Math.max(...MONTHLY_DATA.map((d) => d.income));
  const maxExpenses = Math.max(...MONTHLY_DATA.map((d) => d.expenses));

  const currentMonth = MONTHLY_DATA[MONTHLY_DATA.length - 1];
  const prevMonth = MONTHLY_DATA[MONTHLY_DATA.length - 2];
  const expenseChange = prevMonth
    ? (((currentMonth.expenses - prevMonth.expenses) / prevMonth.expenses) * 100).toFixed(1)
    : 0;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Insights</div>
        <div className="page-subtitle">spending patterns & observations</div>
      </div>

      {transactions.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <div className="empty-title">No data to analyze</div>
            <div className="empty-msg">Add transactions to see insights.</div>
          </div>
        </div>
      ) : (
        <>
          {/* Key Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Savings Rate", value: `${savingsRate}%`, icon: "💰", color: "var(--green)", note: "of income saved" },
              {
                label: "Top Expense",
                value: top ? formatCurrency(top.value) : "—",
                icon: top?.icon || "📦",
                color: top?.color || "var(--accent)",
                note: top?.label || "No expenses",
              },
              {
                label: "Expense vs Last Month",
                value: `${expenseChange > 0 ? "+" : ""}${expenseChange}%`,
                icon: expenseChange > 0 ? "📈" : "📉",
                color: expenseChange > 0 ? "var(--red)" : "var(--green)",
                note: "month-over-month",
              },
            ].map((s) => (
              <div className="card" key={s.label}>
                <div className="insight-highlight" style={{ marginBottom: 0 }}>
                  <div className="highlight-icon">{s.icon}</div>
                  <div>
                    <div className="highlight-label">{s.label}</div>
                    <div className="highlight-value" style={{ color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{s.note}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="insights-grid">
            {/* Category Breakdown */}
            <div className="card insight-card">
              <div className="insight-title">Spending by Category</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {spendingByCategory.slice(0, 7).map((d) => {
                  const pct = ((d.value / expenses) * 100).toFixed(1);
                  return (
                    <div key={d.key}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, alignItems: "center" }}>
                        <span style={{ fontSize: 13 }}>{d.icon} {d.label}</span>
                        <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                          {formatCurrency(d.value)} · {pct}%
                        </span>
                      </div>
                      <div style={{ height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: d.color, borderRadius: 3, transition: "width 0.6s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Comparison */}
            <div className="card insight-card">
              <div className="insight-title">Monthly Comparison</div>
              <div className="month-compare">
                {MONTHLY_DATA.map((d) => (
                  <div key={d.month} className="compare-row">
                    <div className="compare-month">{d.month}</div>
                    <div className="compare-bars">
                      <div className="compare-bar-wrap">
                        <div className="compare-bar-fill" style={{ width: `${(d.income / maxIncome) * 100}%`, background: "var(--green)" }} />
                      </div>
                      <div className="compare-bar-wrap" style={{ marginTop: 3 }}>
                        <div className="compare-bar-fill" style={{ width: `${(d.expenses / maxExpenses) * 100}%`, background: "var(--red)", opacity: 0.7 }} />
                      </div>
                    </div>
                    <div className="compare-amount" style={{ color: d.balance > 0 ? "var(--green)" : "var(--red)" }}>
                      {formatCurrency(d.balance)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="chart-legend" style={{ marginTop: 16 }}>
                <div className="legend-item"><div className="legend-dot" style={{ background: "var(--green)" }} />Income</div>
                <div className="legend-item"><div className="legend-dot" style={{ background: "var(--red)", opacity: 0.7 }} />Expenses</div>
              </div>
            </div>
          </div>

          {/* Observations */}
          <div className="card" style={{ padding: 20 }}>
            <div className="insight-title">💡 Key Observations</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              {[
                {
                  title: "Savings Health",
                  msg: savingsRate > 20
                    ? `Excellent! You're saving ${savingsRate}% of income — well above the recommended 20%.`
                    : `You're saving ${savingsRate}% of income. Try reducing discretionary spending.`,
                  icon: savingsRate > 20 ? "✅" : "⚠️",
                },
                {
                  title: "Highest Spend Category",
                  msg: top
                    ? `${top.icon} ${top.label} accounts for ${((top.value / expenses) * 100).toFixed(0)}% of your total spending (${formatFullCurrency(top.value)}).`
                    : "No expense data available.",
                  icon: "🎯",
                },
                {
                  title: "Month-over-Month",
                  msg: parseFloat(expenseChange) > 0
                    ? `Expenses rose ${expenseChange}% vs last month. Keep an eye on discretionary categories.`
                    : `Expenses dropped ${Math.abs(expenseChange)}% vs last month. Great cost control!`,
                  icon: parseFloat(expenseChange) > 5 ? "⚠️" : "✅",
                },
                {
                  title: "Income Diversity",
                  msg: transactions.filter((t) => t.type === "income").map((t) => t.category).filter((v, i, a) => a.indexOf(v) === i).length > 1
                    ? "You have multiple income sources — good financial resilience."
                    : "Consider diversifying income streams for financial stability.",
                  icon: "📊",
                },
              ].map((obs) => (
                <div key={obs.title} style={{ padding: 14, background: "var(--bg-elevated)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 20 }}>{obs.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{obs.title}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>{obs.msg}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
