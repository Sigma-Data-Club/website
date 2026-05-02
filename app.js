// Sigma Data Club — theme + nav helpers

(function () {
  const STORAGE_KEY = 'sdc-theme';
  const root = document.documentElement;

  function setTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem(STORAGE_KEY, t); } catch (e) {}
    const btn = document.querySelector('.theme-toggle');
    if (btn) btn.textContent = t === 'light' ? '[ dark ]' : '[ light ]';
  }

  function initTheme() {
    let t = null;
    try { t = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (!t) {
      t = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    setTheme(t);
  }

  function bindToggle() {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const cur = root.getAttribute('data-theme') || 'dark';
      setTheme(cur === 'light' ? 'dark' : 'light');
    });
  }

  function markActiveNav() {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav a').forEach((a) => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href === path || (path === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  // Run before paint to avoid flash
  initTheme();

  document.addEventListener('DOMContentLoaded', () => {
    bindToggle();
    markActiveNav();
  });
})();
