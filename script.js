/* ===== Utilities ===== */
document.documentElement.classList.remove('no-js');

const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

/* ===== Header shadow on scroll ===== */
const header = $('.site-header');
const shadowObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    header.dataset.shadow = String(!entry.isIntersecting);
  });
}, { rootMargin: '-80px 0px 0px 0px', threshold: 0 });
shadowObserver.observe($('#home'));

/* ===== Mobile nav ===== */
const navToggle = $('.nav-toggle');
const navMenu = $('#nav-menu');
navToggle?.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  if (isOpen) {
    const first = navMenu.querySelector('a,button');
    first && first.focus();
  }
});
$$('[data-navlink]').forEach(a => {
  a.addEventListener('click', () => navMenu.classList.remove('open'));
});

/* ===== Scrollspy ===== */
const sections = ['about','projects','skills','contact'].map(id => ({ id, el: document.getElementById(id) }));
const navLinks = new Map($$('[data-navlink]').map(a => [a.getAttribute('href')?.slice(1), a]));
const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const id = entry.target.id;
    const link = navLinks.get(id);
    if (entry.isIntersecting) {
      $$('[aria-current="page"]').forEach(e => e.removeAttribute('aria-current'));
      link?.setAttribute('aria-current', 'page');
    }
  });
}, { threshold: 0.6 });
sections.forEach(s => spy.observe(s.el));

/* ===== Theme toggle (respects system, persists) ===== */
const THEME_KEY = 'pref-theme';
const themeBtn = $('[data-theme-toggle]');
const setTheme = (mode) => {
  document.documentElement.setAttribute('data-theme', mode);
  try { localStorage.setItem(THEME_KEY, mode); } catch {}
};
const getTheme = () => {
  try { return localStorage.getItem(THEME_KEY); } catch { return null; }
};
const sysDark = window.matchMedia('(prefers-color-scheme: dark)');
const initTheme = () => setTheme(getTheme() || (sysDark.matches ? 'dark' : 'light'));
initTheme();
sysDark.addEventListener?.('change', e => { if (!getTheme()) setTheme(e.matches ? 'dark':'light'); });
themeBtn?.addEventListener('click', () => setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

/* ===== In-view animations ===== */
const inView = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('animate-in');
      inView.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
$$('[data-animate]').forEach(el => inView.observe(el));

/* ===== Projects render + filters + modal ===== */
const grid = $('#projectsGrid');
const modal = $('#projectModal');
const closeTriggers = $$('[data-close-modal]');
const titleEl = $('#modalTitle');
const descEl = $('#modalDesc');
const imgEl = $('#modalImg');
const metaEl = $('#modalMeta');
const liveEl = $('#modalLive');
const codeEl = $('#modalCode');

const projects = window.__PROJECTS__ || [];
const renderProjects = (list) => {
  grid.setAttribute('aria-busy', 'true');
  grid.innerHTML = '';
  const fragment = document.createDocumentFragment();
  list.forEach(proj => {
    const article = document.createElement('article');
    article.className = 'project';
    article.tabIndex = 0;
    article.setAttribute('role', 'button');
    article.setAttribute('aria-label', `${proj.title}: ${proj.blurb}`);
    article.dataset.category = proj.category;
    article.dataset.projectId = proj.id;
    article.innerHTML = `
      <figure>
        <img src="${proj.img}" alt="${proj.title}" loading="lazy" width="1200" height="750" />
      </figure>
      <div class="padded">
        <h3>${proj.title}</h3>
        <p>${proj.blurb}</p>
        <ul class="tags">${proj.stack.map(s=>`<li>${s}</li>`).join('')}</ul>
      </div>
      <div class="actions">
        <a class="btn" href="${proj.live}" target="_blank" rel="noopener">Live</a>
        <a class="btn ghost" href="${proj.code}" target="_blank" rel="noopener">Code</a>
        <button class="btn ghost" data-open="${proj.id}">Details</button>
      </div>
    `;
    fragment.appendChild(article);
  });
  grid.appendChild(fragment);
  grid.setAttribute('aria-busy', 'false');
};
renderProjects(projects);

const filterBtns = $$('.chip');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-pressed','false'); });
    btn.classList.add('is-active'); btn.setAttribute('aria-pressed','true');
    const f = btn.dataset.filter;
    const filtered = f === 'all' ? projects : projects.filter(p => p.category === f);
    renderProjects(filtered);
  });
});

/* Modal open/close with focus trap */
let lastFocus = null;
const trapFocus = (e) => {
  const focusables = $$('a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])', modal);
  if (!focusables.length) return;
  const first = focusables[0], last = focusables[focusables.length - 1];
  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  } else if (e.key === 'Escape') {
    modal.close('cancel');
  }
};

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-open]');
  if (btn) {
    const id = btn.getAttribute('data-open');
    const proj = projects.find(p => p.id === id) || projects.find(p=>p.id===btn.closest('.project')?.dataset.projectId);
    if (!proj) return;
    titleEl.textContent = proj.title;
    descEl.textContent = proj.description;
    imgEl.src = proj.img;
    imgEl.alt = proj.title;
    metaEl.innerHTML = `<li class="meta">Category: ${proj.category}</li>`;
    liveEl.href = proj.live;
    codeEl.href = proj.code;

    lastFocus = document.activeElement;
    modal.showModal();
    modal.addEventListener('keydown', trapFocus);
    setTimeout(() => $('#modalTitle').focus(), 0);
  }
});
closeTriggers.forEach(el => el.addEventListener('click', () => modal.close('cancel')));
modal.addEventListener('close', () => {
  modal.removeEventListener('keydown', trapFocus);
  lastFocus?.focus();
});

/* Keyboard activation for project cards */
document.addEventListener('keydown', (e) => {
  const card = e.target.closest('.project');
  if (card && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    const id = card.dataset.projectId;
    const btn = card.querySelector(`[data-open="${id}"]`);
    btn?.click();
  }
});

/* ===== Contact form (client-side validation + demo submission) ===== */
const form = $('#contactForm');
const note = $('#formNote');
const copyEmail = $('#copyEmail');
const setError = (id, msg='') => { const el = document.getElementById(`err-${id}`); el.textContent = msg; };
const validators = {
  name: v => v.trim().length > 1 || 'Please enter your name.',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email.',
  message: v => v.trim().length >= 10 || 'Message must be at least 10 characters.'
};
form?.addEventListener('input', (e) => {
  const t = e.target;
  if (t.name && validators[t.name]) {
    const ok = validators[t.name](t.value);
    setError(t.name, ok === true ? '' : ok);
  }
});
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  let ok = true;
  for (const k of Object.keys(validators)) {
    const res = validators[k](data[k] ?? '');
    if (res !== true) { setError(k, res); ok = false; }
  }
  if (!ok) { note.textContent = 'Please fix the errors above.'; return; }

  /* Demo submit: replace with your backend or form service */
  note.textContent = 'Sending…';
  await new Promise(r => setTimeout(r, 600));
  note.textContent = 'Thanks! Your message was validated locally. Hook this up to your backend to actually send.';
  form.reset();
});
copyEmail?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('hello@example.com');
    note.textContent = 'Email copied to clipboard! 📋';
  } catch {
    note.textContent = 'Could not copy. Long-press or right-click to copy.';
  }
});

/* ===== Footer year ===== */
$('#year').textContent = new Date().getFullYear();

/* ===== Perf: tweak scroll inertia for wheel indicator visibility ===== */
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => { ticking = false; });
    ticking = true;
  }
}, { passive: true });

/* ===== Lazy enhance: clamp hero-meta numbers on scroll (fun micro-interaction) ===== */
const counters = $$('.hero-meta strong');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.textContent);
    let start = null;
    const base = Math.max(1, Math.floor(target * 0.1));
    const step = (ts) => {
      if (!start) start = ts;
      const p = clamp((ts - start)/700, 0, 1);
      el.textContent = Math.round(base + (target - base) * p);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.8 });
counters.forEach(c => counterObserver.observe(c));
