const apiUrl = 'http://localhost:3000/expenses';
const views = document.querySelectorAll('.view');
const navButtons = document.querySelectorAll('.nav-button');
const expenseList = document.querySelector('#expense-list');
const summaryList = document.querySelector('#summary-list');
const message = document.querySelector('#message');
const addForm = document.querySelector('#add-form');
const editDialog = document.querySelector('#edit-dialog');
const editForm = document.querySelector('#edit-form');
const deletePopover = document.querySelector('#delete-popover');

let expenses = [];
let selectedId = null;

function showView(viewName) {
  views.forEach(function (view) {
    view.hidden = view.id !== viewName + '-view';
  });
  navButtons.forEach(function (button) {
    const active = button.dataset.view === viewName;
    button.classList.toggle('active', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle('error', isError);
  message.hidden = false;
}

function euro(amount) {
  return Number(amount).toLocaleString('fi-FI', {
    style: 'currency', currency: 'EUR'
  });
}

function share(expense) {
  return euro(Number(expense.amount) / Number(expense.participants));
}

// Kaikki palvelinpyynnöt tarkistetaan samalla tavalla.
async function apiRequest(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error('Palvelin vastasi virheellä ' + response.status);
  if (response.status === 204 || (options && options.method === 'DELETE')) return null;
  return response.json();
}

async function loadExpenses() {
  try {
    expenses = await apiRequest(apiUrl);
    renderExpenses();
    renderSummary();
    return true;
  } catch (error) {
    showMessage('Kuluja ei voitu hakea. Tarkista, että JSON Server on käynnissä (npm run server). ' + error.message, true);
    return false;
  }
}

function renderExpenses() {
  expenseList.replaceChildren();
  document.querySelector('#empty-message').hidden = expenses.length !== 0;

  expenses.forEach(function (expense) {
    const card = document.createElement('article');
    card.className = 'expense-card';
    const title = document.createElement('h3');
    title.textContent = expense.name;
    card.append(title);

    const details = document.createElement('dl');
    const rows = [
      ['Summa', euro(expense.amount)],
      ['Maksaja', expense.payer],
      ['Osallistujia', expense.participants],
      ['Kategoria', expense.category]
    ];
    rows.forEach(function (row) {
      const term = document.createElement('dt');
      const value = document.createElement('dd');
      term.textContent = row[0];
      value.textContent = row[1];
      details.append(term, value);
    });
    card.append(details);

    const perPerson = document.createElement('p');
    perPerson.className = 'per-person';
    perPerson.textContent = 'Henkilöä kohden: ' + share(expense);
    card.append(perPerson);

    const actions = document.createElement('div');
    actions.className = 'actions';
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'secondary-button';
    editButton.textContent = 'Muokkaa';
    editButton.setAttribute('aria-label', 'Muokkaa kulua ' + expense.name);
    editButton.addEventListener('click', function () { openEdit(expense); });
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'secondary-button';
    deleteButton.textContent = 'Poista…';
    deleteButton.setAttribute('aria-label', 'Poista kulu ' + expense.name);
    deleteButton.addEventListener('click', function () { openDelete(expense); });
    actions.append(editButton, deleteButton);
    card.append(actions);
    expenseList.append(card);
  });
}

function renderSummary() {
  document.querySelector('#expense-count').textContent = expenses.length;
  const total = expenses.reduce(function (sum, expense) {
    return sum + Number(expense.amount);
  }, 0);
  document.querySelector('#total-amount').textContent = euro(total);
  summaryList.replaceChildren();
  expenses.forEach(function (expense) {
    const row = document.createElement('article');
    row.className = 'summary-row';
    const name = document.createElement('span');
    name.textContent = expense.name;
    const value = document.createElement('strong');
    value.textContent = share(expense) + ' / hlö';
    row.append(name, value);
    summaryList.append(row);
  });
  if (expenses.length === 0) summaryList.textContent = 'Ei vielä kuluja.';
}

function formExpense(form) {
  const data = new FormData(form);
  return {
    name: data.get('name').trim(),
    amount: Number(data.get('amount')),
    payer: data.get('payer').trim(),
    participants: Number(data.get('participants')),
    category: data.get('category').trim()
  };
}

function openEdit(expense) {
  selectedId = expense.id;
  editForm.elements.namedItem('name').value = expense.name;
  editForm.elements.namedItem('amount').value = expense.amount;
  editForm.elements.namedItem('payer').value = expense.payer;
  editForm.elements.namedItem('participants').value = expense.participants;
  editForm.elements.namedItem('category').value = expense.category;
  editDialog.showModal();
}

function openDelete(expense) {
  selectedId = expense.id;
  document.querySelector('#delete-question').textContent = 'Poistetaanko kulu ”' + expense.name + '”?';
  deletePopover.showPopover();
}

navButtons.forEach(function (button) {
  button.addEventListener('click', function () { showView(button.dataset.view); });
});

addForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  const button = addForm.querySelector('[type="submit"]');
  button.disabled = true;
  try {
    await apiRequest(apiUrl, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formExpense(addForm))
    });
    addForm.reset();
    if (await loadExpenses()) {
      showView('expenses');
      showMessage('Kulu lisättiin.');
    }
  } catch (error) {
    showMessage('Kulun lisääminen epäonnistui. ' + error.message, true);
  } finally {
    button.disabled = false;
  }
});

editForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  const button = editForm.querySelector('[type="submit"]');
  button.disabled = true;
  try {
    await apiRequest(apiUrl + '/' + selectedId, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formExpense(editForm))
    });
    editDialog.close();
    if (await loadExpenses()) showMessage('Muutokset tallennettiin.');
  } catch (error) {
    showMessage('Muokkaaminen epäonnistui. ' + error.message, true);
  } finally {
    button.disabled = false;
  }
});

document.querySelector('#cancel-edit').addEventListener('click', function () { editDialog.close(); });
document.querySelector('#cancel-delete').addEventListener('click', function () { deletePopover.hidePopover(); });
document.querySelector('#confirm-delete').addEventListener('click', async function () {
  const button = this;
  button.disabled = true;
  try {
    await apiRequest(apiUrl + '/' + selectedId, { method: 'DELETE' });
    deletePopover.hidePopover();
    if (await loadExpenses()) showMessage('Kulu poistettiin.');
  } catch (error) {
    showMessage('Poistaminen epäonnistui. ' + error.message, true);
  } finally {
    button.disabled = false;
  }
});

loadExpenses();
