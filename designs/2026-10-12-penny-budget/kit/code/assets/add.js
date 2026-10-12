/* Penny UI Kit · add.js: keypad amount entry, category chips, save to localStorage */
const $ = (id) => document.getElementById(id);
const state = { type: 'expense', raw: '', cat: 'Food' };

function setType(type) {
  state.type = type; state.cat = CATS[type][0];
  document.querySelectorAll('[data-type]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.type === type)));
  $('title').textContent = type === 'income' ? 'Add income' : 'Add expense';
  $('save').textContent = type === 'income' ? 'Save income' : 'Save expense';
  renderCats();
}
function renderCats() {
  $('cats').innerHTML = CATS[state.type].map((c) =>
    `<button type="button" class="chip inline-flex items-center gap-1.5" data-cat="${c}" aria-pressed="${c === state.cat}">${icon(c, 'icon w-4 h-4')}${c}</button>`).join('');
}
function renderAmount() {
  const [i, d] = state.raw.split('.');
  const int = i ? inr.format(parseInt(i, 10)) : '0';
  $('amount').textContent = d !== undefined ? `${int}.${d}` : int;
  $('err').textContent = '';
}
function press(k) {
  if (k === 'back') state.raw = state.raw.slice(0, -1);
  else if (k === '.') { if (!state.raw.includes('.')) state.raw = (state.raw || '0') + '.'; }
  else {
    const [i, d] = state.raw.split('.');
    if (d !== undefined && d.length >= 2) return;           // max 2 decimals
    if (d === undefined && (i || '').length >= 7) return;   // max ₹99,99,999
    state.raw = state.raw === '0' ? k : state.raw + k;
  }
  renderAmount();
}

$('close').innerHTML = icon('close');
$('keypad').innerHTML = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'back'].map((k) =>
  `<button type="button" class="key grid place-items-center" data-key="${k}" aria-label="${k === 'back' ? 'Backspace' : k}">${k === 'back' ? icon('back') : k}</button>`).join('');
$('keypad').addEventListener('click', (e) => { const b = e.target.closest('[data-key]'); if (b) press(b.dataset.key); });
document.addEventListener('keydown', (e) => {
  if (e.target.matches('input, select')) return;
  if (/^[0-9.]$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') press('back'); else if (e.key === 'Enter') save();
});
document.querySelectorAll('[data-type]').forEach((b) => b.addEventListener('click', () => setType(b.dataset.type)));
$('cats').addEventListener('click', (e) => { const b = e.target.closest('[data-cat]'); if (!b) return; state.cat = b.dataset.cat; renderCats(); });
$('date').value = isoDate(new Date());
$('date').max = isoDate(new Date());

async function save() {
  const amount = parseFloat(state.raw);
  if (!(amount > 0)) { $('err').textContent = 'Enter an amount first'; return; }
  await ensureData();
  addTx({ type: state.type, cat: state.cat, name: $('note').value.trim() || state.cat, amount, account: $('account').value, date: $('date').value || isoDate(new Date()) });
  location.href = 'index.html?added=1';
}
$('save').addEventListener('click', save);

const p = new URLSearchParams(location.search);
setType(p.get('type') === 'income' ? 'income' : 'expense');
renderAmount();
