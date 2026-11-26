const API_URL = 'http://127.0.0.1:3000/expenses';
const expenseList = document.querySelector('#expense-list');
const sortSelect = document.querySelector('#sort-mode');
const addForm = document.querySelector('#add-form');
const editForm = document.querySelector('#edit-form');
const editDialog = document.querySelector('#edit-dialog');
const editError = document.querySelector('#edit-error');
const deletePopover = document.querySelector('#delete-popover');
const deleteError = document.querySelector('#delete-error');
const confirmDelete = document.querySelector('#confirm-delete');
const message = document.querySelector('#message');
const retryButton = document.querySelector('#retry-load');
const fields = document.querySelector('#expense-fields');
const cardTemplate = document.querySelector('#expense-card');
const money = new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' });

let expenses = [];

for (const form of [addForm, editForm]) {
  form.querySelector('.fields').append(fields.content.cloneNode(true));
  form.addEventListener('submit', saveExpense);
}

function showView(moveFocus = false) {
  let view = location.hash.slice(1);
  if (!['expenses', 'add', 'summary'].includes(view)) view = 'expenses';

  for (const section of document.querySelectorAll('.view')) {
    section.hidden = section.id !== view + '-view';
    if (moveFocus && !section.hidden) section.querySelector('h2').focus();
  }
  for (const link of document.querySelectorAll('nav a')) {
    if (link.hash === '#' + view) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
}

function showMessage(text, isError = false, retry = false) {
  document.querySelector('#message-text').textContent = text;
  message.hidden = !text;
  message.classList.toggle('error', isError);
  retryButton.hidden = !retry;
}

async function apiRequest(method = 'GET', id, expense) {
  const path = id === undefined ? '' : '/' + encodeURIComponent(id);
  const options = { method };
  if (expense) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(expense);
  }

  const response = await fetch(API_URL + path, options);
  if (!response.ok) throw new Error('Palvelimen virhe: ' + response.status);
  if (method === 'GET') return response.json();
}

async function loadExpenses() {
  try {
    const data = await apiRequest();
    if (!Array.isArray(data)) throw new Error('Kululista puuttuu.');
    expenses = data;
    renderExpenses();
    renderSummary();
    showMessage('');
    return true;
  } catch {
    showMessage('Kuluja ei voitu ladata. Tarkista, että JSON Server on käynnissä.', true, true);
    return false;
  }
}

function renderExpenses() {
  const sorted = expenses.slice();
  if (sortSelect.value === 'amount') sorted.sort((a, b) => b.amount - a.amount);
  else if (sortSelect.value === 'name') sorted.sort((a, b) => String(a.name).localeCompare(String(b.name), 'fi'));
  else sorted.reverse();

  expenseList.replaceChildren(...sorted.map(makeCard));
  document.querySelector('#empty-message').hidden = sorted.length > 0;
}

function share(expense) {
  return money.format(expense.amount / expense.participants);
}

function makeCard(expense) {
  const card = cardTemplate.content.firstElementChild.cloneNode(true);
  card.querySelector('h3').textContent = expense.name;
  const [amount, payer, participants, category] = card.querySelectorAll('dd');
  amount.textContent = money.format(expense.amount);
  payer.textContent = expense.payer;
  participants.textContent = expense.participants;
  category.textContent = expense.category;
  card.querySelector('.per-person').textContent = 'Henkilöä kohden: ' + share(expense);

  const edit = card.querySelector('.edit-button');
  const remove = card.querySelector('.delete-button');
  edit.setAttribute('aria-label', 'Muokkaa kulua ' + expense.name);
  remove.setAttribute('aria-label', 'Poista kulu ' + expense.name);
  edit.addEventListener('click', () => openEdit(expense));
  remove.addEventListener('click', () => openDelete(expense));
  return card;
}

function renderSummary() {
  document.querySelector('#expense-count').textContent = expenses.length;
  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  document.querySelector('#total-amount').textContent = money.format(total);

  const list = document.querySelector('#summary-list');
  list.replaceChildren();
  if (!expenses.length) list.textContent = 'Ei vielä kuluja.';
  for (const expense of expenses) {
    const row = document.createElement('article');
    const name = document.createElement('span');
    const amount = document.createElement('strong');
    row.className = 'summary-row';
    name.textContent = expense.name;
    amount.textContent = share(expense) + ' / hlö';
    row.append(name, amount);
    list.append(row);
  }
}

function openEdit(expense) {
  if (editForm.querySelector('[type="submit"]').disabled) return;
  editForm.dataset.id = expense.id;
  for (const input of editForm.querySelectorAll('input')) {
    input.value = expense[input.name];
  }
  editError.textContent = '';
  editDialog.showModal();
}

function openDelete(expense) {
  if (confirmDelete.disabled) return;
  confirmDelete.dataset.id = expense.id;
  document.querySelector('#delete-question').textContent = 'Poistetaanko ' + expense.name + '?';
  deleteError.textContent = '';
  deletePopover.showPopover();
  deletePopover.querySelector('button').focus();
}

function readForm(form) {
  const data = new FormData(form);
  return {
    name: data.get('name').trim(),
    amount: Number(data.get('amount')),
    payer: data.get('payer').trim(),
    participants: Number(data.get('participants')),
    category: data.get('category').trim()
  };
}

async function saveExpense(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('[type="submit"]');
  if (button.disabled) return;

  const editing = form === editForm;
  button.disabled = true;
  editError.textContent = '';
  try {
    await apiRequest(editing ? 'PATCH' : 'POST', form.dataset.id, readForm(form));
    if (editing) editDialog.close();
    else {
      form.reset();
      location.hash = 'expenses';
    }
    if (await loadExpenses()) showMessage(editing ? 'Muutokset tallennettiin.' : 'Kulu lisättiin.');
  } catch {
    const text = 'Kulua ei voitu tallentaa. Tarkista palvelin ja yritä uudelleen.';
    if (editing && editDialog.open) editError.textContent = text;
    else showMessage(text, true);
  } finally {
    button.disabled = false;
  }
}

async function deleteExpense() {
  confirmDelete.disabled = true;
  deleteError.textContent = '';
  try {
    await apiRequest('DELETE', confirmDelete.dataset.id);
    deletePopover.hidePopover();
    if (await loadExpenses()) showMessage('Kulu poistettiin.');
  } catch {
    const text = 'Kulua ei voitu poistaa. Tarkista palvelin ja yritä uudelleen.';
    if (deletePopover.matches(':popover-open')) deleteError.textContent = text;
    else showMessage(text, true);
  } finally {
    confirmDelete.disabled = false;
  }
}

document.querySelector('#cancel-edit').addEventListener('click', () => editDialog.close());
confirmDelete.addEventListener('click', deleteExpense);
sortSelect.addEventListener('change', renderExpenses);
retryButton.addEventListener('click', loadExpenses);
window.addEventListener('hashchange', () => showView(true));

showView();
loadExpenses();
