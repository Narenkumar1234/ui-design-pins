/* Pulse Fit UI Kit · shared app.js */
const THEME_KEY = 'pulsefit.theme';
const STREAK_KEY = 'pulsefit.streak';
const DONE_KEY = 'pulsefit.done';       // ISO date -> true when today's workout completed
const EX_DONE_KEY = 'pulsefit.exDone'; // exercise ids completed today

async function loadWorkout() {
  if (location.protocol === 'file:') return window.WORKOUT;
  try {
    const res = await fetch('data/workout.json');
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch {
    return window.WORKOUT;
  }
}

function toggleTheme() {
  const dark = document.documentElement.classList.toggle('dark');
  localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
}

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function getStreak(fallback) {
  const n = parseInt(localStorage.getItem(STREAK_KEY), 10);
  return Number.isFinite(n) ? n : (fallback || 0);
}
function setStreak(n) { localStorage.setItem(STREAK_KEY, String(n)); }

function isWorkoutDoneToday() {
  try {
    const map = JSON.parse(localStorage.getItem(DONE_KEY) || '{}');
    return !!map[todayISO()];
  } catch { return false; }
}
function markWorkoutDone() {
  const map = JSON.parse(localStorage.getItem(DONE_KEY) || '{}');
  if (!map[todayISO()]) {
    map[todayISO()] = true;
    localStorage.setItem(DONE_KEY, JSON.stringify(map));
    setStreak(getStreak(0) + 1);
  }
}

function getExDone() {
  try {
    const map = JSON.parse(localStorage.getItem(EX_DONE_KEY) || '{}');
    return map[todayISO()] || [];
  } catch { return []; }
}
function toggleExDone(id) {
  const all = JSON.parse(localStorage.getItem(EX_DONE_KEY) || '{}');
  const list = new Set(all[todayISO()] || []);
  if (list.has(id)) list.delete(id); else list.add(id);
  all[todayISO()] = [...list];
  localStorage.setItem(EX_DONE_KEY, JSON.stringify(all));
  return all[todayISO()];
}

let toastTimer;
function toast(message) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.setAttribute('role', 'status');
    el.className = 'toast hide fixed left-1/2 -translate-x-1/2 bottom-24 z-50 ' +
      'bg-ink text-bg font-bold text-sm px-4 py-3 rounded-brut border-[3px] border-outline shadow-brut';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.remove('hide');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hide'), 1800);
}

function renderBottomNav(active) {
  const nav = document.getElementById('bottom-nav');
  if (!nav) return;
  const items = [
    { id: 'home', href: 'index.html', label: 'Home', icon: homeIcon },
    { id: 'workout', href: 'workout.html', label: 'Workout', icon: workoutIcon },
    { id: 'progress', href: 'progress.html', label: 'Progress', icon: progressIcon },
    { id: 'theme', href: '#', label: 'Theme', icon: themeIcon, action: true },
  ];
  nav.className = 'fixed bottom-0 inset-x-0 z-40 bg-card border-t-[3px] border-outline';
  nav.innerHTML = `<div class="max-w-lg mx-auto grid grid-cols-4 gap-1 px-2 py-2">` +
    items.map((it) => {
      const on = it.id === active;
      const cls = on
        ? 'bg-lime text-on-lime border-[3px] border-outline shadow-brut-sm'
        : 'text-muted border-[3px] border-transparent';
      return `<a href="${it.href}" data-nav="${it.id}" class="flex flex-col items-center gap-0.5 py-2 rounded-brut font-bold text-[11px] ${cls}">
        ${it.icon(on)}
        <span>${it.label}</span>
      </a>`;
    }).join('') + `</div>`;
  nav.querySelector('[data-nav="theme"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    toggleTheme();
    toast(document.documentElement.classList.contains('dark') ? 'Dark mode' : 'Light mode');
  });
}

function homeIcon(on) {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z"/></svg>`;
}
function workoutIcon() {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 9v6M18 9v6M9 7v10M15 7v10M3 11v2M21 11v2"/></svg>`;
}
function progressIcon() {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 19V10M12 19V5M19 19v-7"/></svg>`;
}
function themeIcon() {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`;
}

function fmtTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}
