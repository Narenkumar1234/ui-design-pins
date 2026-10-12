/* Penny UI Kit · home.js: balance, budget progress, recent list */
let cursor = new Date(); cursor.setDate(1);
let showAll = false; let openId = null;
const $ = (id) => document.getElementById(id);

function render() {
  const now = new Date();
  const list = inMonth(getTx(), cursor).reverse().sort(sortTx); // newest first, ties keep latest-added on top
  const t = totals(list);
  const isCurrent = monthKey(cursor) === monthKey(now);
  $('month-label').textContent = MONTHS_LONG[cursor.getMonth()] + (cursor.getFullYear() !== now.getFullYear() ? ' ' + cursor.getFullYear() : '');
  $('next-month').disabled = isCurrent; $('next-month').classList.toggle('opacity-30', isCurrent);
  $('balance').textContent = (t.net < 0 ? '−' : '') + money(Math.abs(t.net));
  $('income').textContent = money(t.income);
  $('spent').textContent = money(t.spent);

  const budget = getBudget(); const pct = Math.min(100, (t.spent / budget) * 100);
  $('b-spent').textContent = money(t.spent); $('b-total').textContent = money(budget);
  $('b-bar').style.width = pct.toFixed(1) + '%';
  $('b-track').classList.toggle('over', t.spent > budget);
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const left = budget - t.spent;
  let note = left >= 0 ? `${money(left)} left` : `${money(-left)} over budget`;
  if (isCurrent) { const d = daysInMonth - now.getDate(); note += ` · ${d} day${d === 1 ? '' : 's'} to go`; }
  $('b-note').textContent = note;
  $('b-note').classList.toggle('text-spend', left < 0);

  const rows = showAll ? list : list.slice(0, 5);
  $('recent').innerHTML = rows.map(txRow).join('');
  $('empty').classList.toggle('hidden', list.length > 0);
  $('see-all').textContent = showAll ? 'Show less' : 'See all';
  $('see-all').classList.toggle('hidden', list.length <= 5);
}

$('prev-month').innerHTML = icon('chevL', 'icon w-4 h-4');
$('next-month').innerHTML = icon('chevR', 'icon w-4 h-4');
$('tx-trash').innerHTML = icon('trash', 'icon w-4 h-4');
$('prev-month').onclick = () => { cursor.setMonth(cursor.getMonth() - 1); render(); };
$('next-month').onclick = () => { cursor.setMonth(cursor.getMonth() + 1); render(); };
$('see-all').onclick = () => { showAll = !showAll; render(); };

$('edit-budget').onclick = () => { $('budget-input').value = getBudget(); $('budget-dialog').showModal(); };
$('budget-dialog').addEventListener('close', () => {
  if ($('budget-dialog').returnValue !== 'save') return;
  const n = parseFloat($('budget-input').value);
  if (n > 0) { setBudget(n); render(); toast('Budget updated'); }
});

function openTx(id) {
  const t = getTx().find((x) => x.id === id); if (!t) return;
  openId = id; const d = new Date(t.date + 'T00:00');
  $('tx-meta').textContent = `${t.cat} · ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  $('tx-name').textContent = t.name;
  $('tx-amount').textContent = (t.type === 'income' ? '+' : '−') + money(t.amount);
  $('tx-amount').className = 'num text-3xl font-light mt-3 ' + (t.type === 'income' ? 'text-accent' : 'text-ink');
  $('tx-account').textContent = t.account || '';
  $('tx-dialog').showModal();
}
$('recent').addEventListener('click', (e) => { const li = e.target.closest('li[data-id]'); if (li) openTx(li.dataset.id); });
$('recent').addEventListener('keydown', (e) => { const li = e.target.closest('li[data-id]'); if (li && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openTx(li.dataset.id); } });
$('tx-dialog').addEventListener('close', () => {
  if ($('tx-dialog').returnValue === 'delete' && openId) { deleteTx(openId); render(); toast('Transaction deleted'); }
  openId = null;
});

renderNav('home');
ensureData().then(() => {
  render();
  if (new URLSearchParams(location.search).get('added')) { toast('Saved'); history.replaceState(null, '', 'index.html'); }
});
