import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/mockData";
import { formatCurrency, formatDate, getCategory, exportToCSV, exportToJSON } from "../../utils/helpers";

function TransactionModal({ tx, onClose }) {
  const { dispatch } = useApp();
  const isEdit = Boolean(tx?.id);

  const [form, setForm] = useState({
    description: tx?.description || "",
    amount: tx?.amount ? Math.abs(tx.amount) : "",
    category: tx?.category || "FOOD",
    type: tx?.type || "expense",
    date: tx?.date || new Date().toISOString().split("T")[0],
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.description || !form.amount) return;
    const amount = parseFloat(form.amount) * (form.type === "expense" ? -1 : 1);
    const payload = { ...form, amount, id: tx?.id || Date.now() };
    dispatch({ type: isEdit ? "EDIT_TRANSACTION" : "ADD_TRANSACTION", payload });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{isEdit ? "Edit Transaction" : "Add Transaction"}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="form-group">
          <label className="form-label">Type</label>
          <div className="type-selector">
            <button
              className={`type-opt ${form.type === "income" ? "active-income" : ""}`}
              onClick={() => set("type", "income")}
            >↑ Income</button>
            <button
              className={`type-opt ${form.type === "expense" ? "active-expense" : ""}`}
              onClick={() => set("type", "expense")}
            >↓ Expense</button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            className="form-input"
            placeholder="e.g. Grocery Store"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Amount (৳)</label>
            <input
              className="form-input"
              type="number"
              placeholder="0"
              value={form.amount}
              onChange={(e) => set("amount", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              className="form-input"
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {Object.entries(CATEGORIES).map(([k, v]) => (
              <option key={k} value={k}>{v.icon} {v.label}</option>
            ))}
          </select>
        </div>

        <div className="modal-actions">
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit}>
            {isEdit ? "Save Changes" : "Add Transaction"}
          </button>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function Transactions() {
  const { state, dispatch } = useApp();
  const { transactions, filters, role } = state;
  const isAdmin = role === "admin";

  const [modal, setModal] = useState(null); // null | 'add' | tx object
  const [confirm, setConfirm] = useState(null);

  const setFilter = (obj) => dispatch({ type: "SET_FILTER", payload: obj });

  const handleSort = (col) => {
    if (filters.sortBy === col) {
      setFilter({ sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" });
    } else {
      setFilter({ sortBy: col, sortOrder: "desc" });
    }
  };

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (filters.type !== "all") list = list.filter((t) => t.type === filters.type);
    if (filters.category !== "all") list = list.filter((t) => t.category === filters.category);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((t) => t.description.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      let av = a[filters.sortBy], bv = b[filters.sortBy];
      if (filters.sortBy === "amount") { av = Math.abs(av); bv = Math.abs(bv); }
      if (filters.sortBy === "date") { av = new Date(av); bv = new Date(bv); }
      return filters.sortOrder === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return list;
  }, [transactions, filters]);

  const handleDelete = (id) => {
    dispatch({ type: "DELETE_TRANSACTION", payload: id });
    setConfirm(null);
  };

  const SortTh = ({ col, label }) => (
    <th
      className={filters.sortBy === col ? "sort-active" : ""}
      onClick={() => handleSort(col)}
    >
      {label}
      <span className="sort-icon">{filters.sortBy === col ? (filters.sortOrder === "asc" ? " ↑" : " ↓") : " ↕"}</span>
    </th>
  );

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div className="page-title">Transactions</div>
          <div className="page-subtitle">{filtered.length} of {transactions.length} entries</div>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setModal("add")}>
            + Add Transaction
          </button>
        )}
      </div>

      <div className="tx-controls">
        <div className="search-box">
          <span style={{ color: "var(--text-muted)" }}>⌕</span>
          <input
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => setFilter({ search: e.target.value })}
          />
        </div>

        <select
          className="filter-select"
          value={filters.type}
          onChange={(e) => setFilter({ type: e.target.value })}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          className="filter-select"
          value={filters.category}
          onChange={(e) => setFilter({ category: e.target.value })}
        >
          <option value="all">All Categories</option>
          {Object.entries(CATEGORIES).map(([k, v]) => (
            <option key={k} value={k}>{v.icon} {v.label}</option>
          ))}
        </select>

        <button className="btn btn-secondary" onClick={() => exportToCSV(filtered)} title="Export CSV">
          ↓ CSV
        </button>
        <button className="btn btn-secondary" onClick={() => exportToJSON(filtered)} title="Export JSON">
          ↓ JSON
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">No matching transactions</div>
            <div className="empty-msg">Try adjusting your filters or search query.</div>
          </div>
        ) : (
          <div className="tx-table-wrap">
            <table className="tx-table">
              <thead>
                <tr>
                  <SortTh col="date" label="Date" />
                  <th>Description</th>
                  <th>Category</th>
                  <SortTh col="type" label="Type" />
                  <SortTh col="amount" label="Amount" />
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const cat = getCategory(t.category);
                  return (
                    <tr key={t.id}>
                      <td style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
                        {formatDate(t.date)}
                      </td>
                      <td style={{ fontWeight: 500 }}>{t.description}</td>
                      <td>
                        <span className="cat-badge">
                          {cat.icon} {cat.label}
                        </span>
                      </td>
                      <td>
                        <span className={`type-badge ${t.type}`}>
                          {t.type === "income" ? "↑" : "↓"} {t.type}
                        </span>
                      </td>
                      <td>
                        <span className={`tx-amount ${t.type}`}>
                          {t.type === "income" ? "+" : "-"}{formatCurrency(Math.abs(t.amount))}
                        </span>
                      </td>
                      {isAdmin && (
                        <td>
                          <div className="action-btns">
                            <button className="btn btn-secondary btn-sm" onClick={() => setModal(t)}>✎</button>
                            <button className="btn btn-danger btn-sm" onClick={() => setConfirm(t.id)}>✕</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {(modal === "add" || (modal && modal.id)) && (
        <TransactionModal tx={modal === "add" ? null : modal} onClose={() => setModal(null)} />
      )}

      {confirm && (
        <div className="modal-overlay" onClick={() => setConfirm(null)}>
          <div className="modal" style={{ maxWidth: 360 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-title" style={{ marginBottom: 12 }}>Delete Transaction?</div>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleDelete(confirm)}>Delete</button>
              <button className="btn btn-secondary" onClick={() => setConfirm(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
