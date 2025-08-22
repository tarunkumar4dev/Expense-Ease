/*************** THEME: dark/light with persistence ***************/
(function () {
  const root = document.documentElement; // <html>
  const btn = document.getElementById('theme-toggle');

  const saved = localStorage.getItem('theme'); // 'light' | 'dark' | null
  const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (systemDark ? 'dark' : 'light');

  setTheme(initial);
  updateBtn(initial);

  btn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
    updateBtn(next);
    localStorage.setItem('theme', next);
  });

  function setTheme(mode) { root.setAttribute('data-theme', mode); }
  function updateBtn(mode) { if (btn) btn.textContent = mode === 'dark' ? '☀️ Light' : '🌙 Dark'; }
})();

/*************** EXPENSE TRACKER LOGIC (your original, cleaned) ***************/
const balance    = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus= document.getElementById('money-minus');
const list       = document.getElementById('list');
const form       = document.getElementById('form');
const text       = document.getElementById('text');
const amount     = document.getElementById('amount');

// Load from localStorage
let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');

// Add transaction
function addTransaction(e) {
  e.preventDefault();
  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add text and amount');
    return;
  }

  const transaction = {
    id: Math.floor(Math.random() * 1_000_000_000),
    text: text.value.trim(),
    amount: +amount.value
  };

  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();

  text.value = '';
  amount.value = '';
}

// Add to DOM list
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  item.innerHTML = `
    <span>${transaction.text}</span>
    <span>₹${Math.abs(transaction.amount).toFixed(2)}</span>
    <button class="delete-btn" aria-label="Delete" onclick="removeTransaction(${transaction.id})">x</button>
  `;
  list.appendChild(item);
}

// Update balance/income/expense
function updateValues() {
  const amounts = transactions.map(t => t.amount);
  const total   = amounts.reduce((a, v) => a + v, 0).toFixed(2);
  const income  = amounts.filter(v => v > 0).reduce((a, v) => a + v, 0).toFixed(2);
  const expense = (amounts.filter(v => v < 0).reduce((a, v) => a + v, 0) * -1).toFixed(2);

  balance.innerHTML    = `₹${total}`;
  money_plus.innerHTML = `+₹${income}`;
  money_minus.innerHTML= `-₹${expense}`;
}

// Remove by ID
function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

// Persist
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();
form.addEventListener('submit', addTransaction);
