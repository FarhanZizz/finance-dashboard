# Finyō — Finance Dashboard

A clean, interactive finance dashboard built with React + Vite. Track financial activity, explore transactions, and understand spending patterns — all with a polished dark/light UI.

---

## 🚀 Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# http://localhost:5173

# Build for production
npm run build
npm run preview
```

---

## ✨ Features

### Dashboard Overview
- **Summary Cards** — Net Balance, Total Income, Total Expenses with trend indicators
- **Monthly Cash Flow Bar Chart** — Income vs Expenses comparison across 6 months (pure CSS/SVG, no chart lib)
- **Spending Breakdown Donut Chart** — Top spending categories with percentage breakdown
- **Recent Activity Feed** — Last 6 transactions with category icons

### Transactions Section
- Full transaction list with **Date, Description, Category, Type, Amount**
- **Search** by description (live filtering)
- **Filter** by type (income/expense) and category
- **Sort** by date, amount, or type (ascending/descending)
- **Export** to CSV or JSON

### Role-Based UI (RBAC Simulation)
Switch roles via the sidebar toggle:
- **Viewer** — Read-only mode; can browse all data but cannot add/edit/delete
- **Admin** — Full CRUD; can add, edit, and delete transactions via modal

### Insights Section
- Savings rate calculation
- Highest spending category highlight
- Month-over-month expense change
- Category-by-category spending bars
- Monthly income/expense comparison (6-month view)
- Smart auto-generated observations (savings health, income diversity, etc.)

### State Management
- **React Context + useReducer** for global state (transactions, filters, role, theme, active tab)
- **localStorage persistence** — transactions, role, and theme survive page refreshes

### UI / UX
- **Dark & Light mode** toggle
- Fully responsive — adapts to mobile with collapsible sidebar
- Empty/no-data states handled gracefully
- Smooth animations on card load

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── Dashboard/    # Overview, summary cards, charts, recent activity
│   ├── Insights/     # Spending analysis, observations
│   ├── Layout/       # Sidebar, navigation, role switcher, theme toggle
│   └── Transactions/ # Transaction table, CRUD modal, filters
├── context/
│   └── AppContext.jsx # Global state (Context + useReducer)
├── data/
│   └── mockData.js   # Static transaction data, monthly totals, categories
├── utils/
│   └── helpers.js    # Currency formatting, category lookup, CSV/JSON export
├── App.jsx
├── main.jsx
└── index.css         # Design system tokens, all component styles
```

---

## 🎨 Design Decisions

- **Font**: Syne (display) + JetBrains Mono (data/numbers) — chosen for a refined financial aesthetic
- **Theme**: Dark-first with a full light mode; CSS variables for instant switching
- **Charts**: Custom SVG/CSS — no external chart library needed, keeps bundle lean
- **Color system**: Semantic accent colors (blue = balance, green = income, red = expense)
- **No external UI library** — all components hand-crafted for full control

---

## 🔧 Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 |
| Build tool | Vite |
| State | Context API + useReducer |
| Persistence | localStorage |
| Styling | Plain CSS with custom design tokens |
| Charts | Custom SVG |
| Data | Static mock data |

---

## 📝 Assumptions Made

1. Currency is BDT (৳) — amounts shown in short format (K/L)
2. No backend required — all data lives in localStorage after first load
3. Role switching is simulated client-side (no auth)
4. Monthly chart data is static seed data; transaction totals are live-computed
