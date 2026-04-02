import { CATEGORIES } from "../data/mockData";

export const formatCurrency = (amount) => {
  const abs = Math.abs(amount);
  if (abs >= 100000) return `৳${(abs / 100000).toFixed(1)}L`;
  if (abs >= 1000) return `৳${(abs / 1000).toFixed(1)}K`;
  return `৳${abs.toLocaleString()}`;
};

export const formatFullCurrency = (amount) =>
  `৳${Math.abs(amount).toLocaleString("en-IN")}`;

export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

export const getCategory = (key) => CATEGORIES[key] || CATEGORIES.OTHER;

export const computeSummary = (transactions) => {
  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0);
  return { income, expenses, balance: income - expenses };
};

export const getSpendingByCategory = (transactions) => {
  const map = {};
  transactions.filter((t) => t.type === "expense").forEach((t) => {
    map[t.category] = (map[t.category] || 0) + Math.abs(t.amount);
  });
  return Object.entries(map)
    .map(([key, value]) => ({ key, value, ...CATEGORIES[key] }))
    .sort((a, b) => b.value - a.value);
};

export const exportToCSV = (transactions) => {
  const headers = ["Date", "Description", "Category", "Type", "Amount"];
  const rows = transactions.map((t) => [
    t.date, t.description, CATEGORIES[t.category]?.label || t.category,
    t.type, t.amount,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "transactions.csv"; a.click();
  URL.revokeObjectURL(url);
};

export const exportToJSON = (transactions) => {
  const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "transactions.json"; a.click();
  URL.revokeObjectURL(url);
};
