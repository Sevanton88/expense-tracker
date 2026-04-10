/* ============================================================
   Spend — iOS-Inspired Expense Tracker
   app.js
   ============================================================ */

/* ---------- Category Config ---------- */
const CATEGORIES = {
  Food:          { icon: '🍔', color: '#ff9f0a' },
  Transport:     { icon: '🚗', color: '#30d158' },
  Shopping:      { icon: '🛍', color: '#bf5af2' },
  Health:        { icon: '💊', color: '#ff453a' },
  Entertainment: { icon: '🎮', color: '#0a84ff' },
  Income:        { icon: '💰', color: '#30d158' },
  Other:         { icon: '📦', color: '#636366' },
};

/* ---------- Seed Data ---------- */
const SEED = [
  { id: 1, desc: 'Grocery run',       amount: 54.30, category: 'Food',          type: 'expense', date: today(-1) },
  { id: 2, desc: 'Monthly salary',    amount: 3200,  category: 'Income',        type: 'income',  date: today(-3) },
  { id: 3, desc: 'Uber to airport',   amount: 32.50, category: 'Transport',     type: 'expense', date: today(-2) },
  { id: 4, desc: 'Netflix',           amount: 15.99, category: 'Entertainment', type: 'expense', date: today(-5) },
  { id: 5, desc: 'Pharmacy',          amount: 22.40, category: 'Health',        type: 'expense', date: today(-4) },
  { id: 6, desc: 'New sneakers',      amount: 89.00, category: 'Shopping',      type: 'expense', date: today(-2) },
  { id: 7, desc: 'Freelance payment', amount: 450,   category: 'Income',        type: 'income',  date: today(-6) },
  { id: 8, desc: 'Coffee shop',       amount: 6.80,  category: 'Food',          type: 'expense', date: today(0)  },
];

function today(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

/* ---------- State ---------- */
let transactions = JSON.parse(localStorage.getItem('spend-tx') || 'null') || SEED;
let nextId       = parseInt(localStorage.getItem('spend-id') || '100');
let activeFilter = 'all';
let activeType   = 'expense';
let activeCategory = 'Food';
let chartInstance  = null;

/* ---------- DOM ---------- */
const totalSpentEl   = document.getElementById('total-spent');
const totalIncomeEl  = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expenses');
const txListEl       = document.getElementById('tx-list');
const emptyStateEl   = document.getElementById('empty-state');
const categoryGridEl = document.getElementById('category-grid');
const sheetOverlay   = document.getElementById('sheet-overlay');
const bottomSheet    = document.getElementById('bottom-sheet');
const filterTabs     = document.getElementById('filter-tabs');

/* ---------- Boot ---------- */
function init() {
  // Set today's date in form
  document.getElementById('f-date').value = today(0);

  loadChart();
  render();
  bindEvents();
}

/* ---------- Persistence ---------- */
function save() {
  localStorage.setItem('spend-tx', JSON.stringify(transactions));
  localStorage.setItem('spend-id', String(nextId));
}

/* ---------- Render ---------- */
function render() {
  renderSummary();
  renderCategories();
  renderTransactions();
  renderChart();
}

function renderSummary() {
  const income   = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const net      = expenses; // "total spent" shows expenses

  totalSpentEl.textContent   = fmt(net);
  totalIncomeEl.textContent  = fmt(income);
  totalExpenseEl.textContent = fmt(expenses);
}

function renderCategories() {
  const expenses = transactions.filter(t => t.type === 'expense');
  const totals   = {};
  expenses.forEach(t => { totals[t.category] = (totals[t.category] || 0) + t.amount; });

  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const max    = sorted[0]?.[1] || 1;

  if (!sorted.length) {
    categoryGridEl.innerHTML = '<div style="color:var(--text-3);font-size:.85rem;grid-column:span 2;text-align:center;padding:1rem 0;">No expense data yet</div>';
    return;
  }

  categoryGridEl.innerHTML = sorted.map(([cat, amt], i) => {
    const cfg  = CATEGORIES[cat] || CATEGORIES.Other;
    const pct  = Math.round((amt / max) * 100);
    return `
      <div class="cat-card" style="animation-delay:${i * 0.05}s">
        <div class="cat-dot" style="background:${cfg.color}"></div>
        <div class="cat-info">
          <div class="cat-name">${cfg.icon} ${cat}</div>
          <div class="cat-amount">${fmt(amt)}</div>
          <div class="cat-bar-wrap">
            <div class="cat-bar" style="width:${pct}%;background:${cfg.color}"></div>
          </div>
        </div>
      </div>`;
  }).join('');
}

function renderTransactions() {
  const filtered = activeFilter === 'all'
    ? [...transactions]
    : transactions.filter(t => t.category === activeFilter);

  // Sort newest first
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Remove old tx rows
  txListEl.querySelectorAll('.tx-row').forEach(el => el.remove());

  emptyStateEl.style.display = filtered.length ? 'none' : 'block';

  filtered.forEach(tx => {
    const cfg  = CATEGORIES[tx.category] || CATEGORIES.Other;
    const sign = tx.type === 'income' ? '+' : '−';
    const cls  = tx.type === 'income' ? 'income' : 'expense';

    const row = document.createElement('div');
    row.className = 'tx-row';
    row.innerHTML = `
      <div class="tx-icon" style="background:${cfg.color}22">${cfg.icon}</div>
      <div class="tx-info">
        <div class="tx-desc">${escHtml(tx.desc)}</div>
        <div class="tx-meta">
          <span class="tx-cat-dot" style="background:${cfg.color}"></span>
          ${tx.category} &nbsp;·&nbsp; ${fmtDate(tx.date)}
        </div>
      </div>
      <div class="tx-amount ${cls}">${sign}${fmt(tx.amount)}</div>
      <button class="tx-delete" data-id="${tx.id}" title="Delete">✕</button>
    `;
    txListEl.appendChild(row);
  });
}

/* ---------- Chart ---------- */
function loadChart() {
  const script  = document.createElement('script');
  script.src    = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
  script.onload = renderChart;
  document.head.appendChild(script);
}

function renderChart() {
  if (typeof Chart === 'undefined') return;

  const canvas = document.getElementById('spend-chart');
  const ctx    = canvas.getContext('2d');

  // Build last 7 days labels + data
  const days = Array.from({ length: 7 }, (_, i) => today(-(6 - i)));
  const dayLabels = days.map(d => {
    const dt = new Date(d + 'T12:00:00');
    return dt.toLocaleDateString('en-GB', { weekday: 'short' });
  });

  const dayTotals = days.map(d =>
    transactions
      .filter(t => t.type === 'expense' && t.date === d)
      .reduce((s, t) => s + t.amount, 0)
  );

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dayLabels,
      datasets: [{
        data: dayTotals,
        backgroundColor: dayTotals.map((_, i) =>
          i === 6 ? '#0a84ff' : 'rgba(255,255,255,0.12)'
        ),
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#2c2c2e',
          titleColor: 'rgba(255,255,255,0.5)',
          bodyColor: '#fff',
          titleFont: { family: 'DM Sans', size: 11 },
          bodyFont: { family: 'DM Sans', size: 14, weight: '600' },
          padding: 10,
          cornerRadius: 10,
          callbacks: { label: c => ' ' + fmt(c.raw) }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: 'rgba(255,255,255,0.4)', font: { family: 'DM Sans', size: 11 } }
        },
        y: {
          display: false,
          grid: { display: false },
        }
      }
    }
  });
}

/* ---------- Modal ---------- */
function openSheet() {
  sheetOverlay.classList.add('active');
  setTimeout(() => bottomSheet.classList.add('open'), 10);
  setTimeout(() => document.getElementById('f-desc').focus(), 350);
}

function closeSheet() {
  bottomSheet.classList.remove('open');
  setTimeout(() => sheetOverlay.classList.remove('active'), 380);
}

/* ---------- Add Transaction ---------- */
function addTransaction() {
  const desc   = document.getElementById('f-desc').value.trim();
  const amount = parseFloat(document.getElementById('f-amount').value);
  const date   = document.getElementById('f-date').value;

  if (!desc)            { shake('f-desc');   return; }
  if (!amount || amount <= 0) { shake('f-amount'); return; }
  if (!date)            { return; }

  const tx = {
    id:       ++nextId,
    desc,
    amount:   parseFloat(amount.toFixed(2)),
    category: activeCategory,
    type:     activeType,
    date,
  };

  transactions.unshift(tx);
  save();
  render();
  closeSheet();

  // Reset form
  document.getElementById('f-desc').value   = '';
  document.getElementById('f-amount').value = '';
  document.getElementById('f-date').value   = today(0);
}

function shake(id) {
  const el = document.getElementById(id);
  el.style.animation = 'none';
  el.style.borderColor = 'var(--red)';
  setTimeout(() => el.style.borderColor = '', 1200);
}

/* ---------- Events ---------- */
function bindEvents() {
  // Open / close sheet
  document.getElementById('add-btn').addEventListener('click', openSheet);
  document.getElementById('cancel-btn').addEventListener('click', closeSheet);
  document.getElementById('submit-btn').addEventListener('click', addTransaction);

  // Close on overlay click
  sheetOverlay.addEventListener('click', e => {
    if (e.target === sheetOverlay) closeSheet();
  });

  // Category picker
  document.getElementById('cat-picker').addEventListener('click', e => {
    const btn = e.target.closest('.cat-btn');
    if (!btn) return;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.cat;
  });

  // Type toggle
  document.getElementById('type-expense').addEventListener('click', () => setType('expense'));
  document.getElementById('type-income').addEventListener('click',  () => setType('income'));

  // Filter tabs
  filterTabs.addEventListener('click', e => {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeFilter = tab.dataset.filter;
    renderTransactions();
  });

  // Delete transaction (event delegation)
  txListEl.addEventListener('click', e => {
    const btn = e.target.closest('.tx-delete');
    if (!btn) return;
    const id = parseInt(btn.dataset.id);
    transactions = transactions.filter(t => t.id !== id);
    save();
    render();
  });

  // Clear all
  document.getElementById('clear-all-btn').addEventListener('click', () => {
    if (transactions.length === 0) return;
    if (confirm('Clear all transactions?')) {
      transactions = [];
      save();
      render();
    }
  });

  // Enter key in form
  document.getElementById('f-desc').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('f-amount').focus();
  });
  document.getElementById('f-amount').addEventListener('keydown', e => {
    if (e.key === 'Enter') addTransaction();
  });
}

function setType(type) {
  activeType = type;
  document.getElementById('type-expense').classList.toggle('active', type === 'expense');
  document.getElementById('type-income').classList.toggle('active',  type === 'income');
}

/* ---------- Helpers ---------- */
function fmt(n) {
  return '$' + parseFloat(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ---------- Go ---------- */
init();
