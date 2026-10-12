/* Penny UI Kit · insights.js: period totals, slim bar chart, category breakdown */
const $ = (id) => document.getElementById(id);
let range = 'month';
const spentIn = (list) => list.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

// Returns { buckets:[{label, list, on}], current, previous, label }
function periods(all, now = new Date()) {
  const byDate = (from, to) => all.filter((t) => t.date >= isoDate(from) && t.date <= isoDate(to));
  if (range === 'week') {
    const buckets = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      buckets.push({ label: 'SMTWTFS'[d.getDay()], list: byDate(d, d), on: i === 0 });
    }
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    const prevEnd = new Date(start); prevEnd.setDate(prevEnd.getDate() - 1);
    const prevStart = new Date(prevEnd); prevStart.setDate(prevStart.getDate() - 6);
    return { buckets, current: byDate(start, now), previous: byDate(prevStart, prevEnd), label: 'Spent in the last 7 days', prevName: 'the week before' };
  }
  if (range === 'year') {
    const buckets = MONTHS.map((m, i) => ({ label: m[0], list: inMonth(all, new Date(now.getFullYear(), i, 1)), on: i === now.getMonth() }));
    const cur = all.filter((t) => t.date.startsWith(String(now.getFullYear())));
    const prev = all.filter((t) => t.date.startsWith(String(now.getFullYear() - 1)));
    return { buckets, current: cur, previous: prev, label: `Spent in ${now.getFullYear()}`, prevName: String(now.getFullYear() - 1) };
  }
  const buckets = [];
  for (let i = 5; i >= 0; i--) {
    const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ label: MONTHS[m.getMonth()], list: inMonth(all, m), on: i === 0 });
  }
  const prevM = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return { buckets, current: inMonth(all, now), previous: inMonth(all, prevM), label: `Spent in ${MONTHS_LONG[now.getMonth()]}`, prevName: MONTHS_LONG[prevM.getMonth()] };
}

function render() {
  document.querySelectorAll('[data-range]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.range === range)));
  const p = periods(getTx());
  const cur = spentIn(p.current), prev = spentIn(p.previous);
  $('total').textContent = money(cur);
  $('total-label').textContent = p.label;
  if (prev > 0) {
    const diff = ((cur - prev) / prev) * 100; const less = diff <= 0;
    $('compare').textContent = `${Math.abs(diff).toFixed(0)}% ${less ? 'less' : 'more'} than ${p.prevName}`;
    $('compare').className = 'text-xs mt-2 ' + (less ? 'text-accent' : 'text-spend');
  } else { $('compare').textContent = ''; }

  const vals = p.buckets.map((b) => spentIn(b.list)); const max = Math.max(1, ...vals);
  $('bars').style.gap = $('bar-labels').style.gap = range === 'year' ? '6px' : '12px';
  $('bars').innerHTML = p.buckets.map((b, i) =>
    `<div class="b ${b.on ? 'on' : ''}" title="${b.label}: ${money(vals[i])}"><i style="height:${((vals[i] / max) * 100).toFixed(1)}%"></i></div>`).join('');
  $('bar-labels').innerHTML = p.buckets.map((b) => `<span class="flex-1 text-center text-[11px] ${b.on ? 'text-ink font-medium' : 'text-muted'}">${b.label}</span>`).join('');

  const by = totals(p.current).byCat;
  const rows = Object.entries(by).sort((a, b) => b[1] - a[1]);
  $('cats').innerHTML = rows.map(([c, amt]) => {
    const pct = cur ? (amt / cur) * 100 : 0;
    return `<li class="py-4" data-cat="${c}"><div class="flex items-center gap-3">
      <span class="text-muted">${icon(c)}</span><span class="flex-1 text-[15px]">${c}</span>
      <span class="text-xs text-muted w-10 text-right">${pct.toFixed(0)}%</span>
      <span class="num text-[15px] font-medium w-24 text-right">${money(amt)}</span></div>
      <div class="track mt-3 ml-8" style="height:3px"><i style="width:${pct.toFixed(1)}%"></i></div></li>`;
  }).join('');
  $('empty').classList.toggle('hidden', rows.length > 0);
}
document.querySelectorAll('[data-range]').forEach((b) => b.addEventListener('click', () => { range = b.dataset.range; render(); }));
renderNav('insights');
ensureData().then(render);
