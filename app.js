/* ============================================================
   WARUNG PEMPEK MEMBLE MBAK WIWIN - JavaScript
   ✅ Compatible: Desktop Chrome/Firefox/Edge + Android Chrome/WebView
   ============================================================ */

'use strict';

// ===== NAVBAR SCROLL EFFECT =====
const navbar     = document.getElementById('navbar');
const navOverlay = document.getElementById('navOverlay');

const onScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
};
window.addEventListener('scroll', onScroll, { passive: true });
// Run once immediately in case page loads mid-scroll
onScroll();

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
let navOpen = false;

function openNav() {
  navOpen = true;
  navLinks.classList.add('open');
  navOverlay.classList.add('visible');
  navToggle.setAttribute('aria-expanded', 'true');
  // FIX: prevent background scroll on Android when drawer is open
  document.body.style.overflow = 'hidden';
}

function closeNav() {
  navOpen = false;
  navLinks.classList.remove('open');
  navOverlay.classList.remove('visible');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

navToggle.addEventListener('click', () => {
  navOpen ? closeNav() : openNav();
});

// Close nav when any link inside is tapped
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeNav);
});

// Close on overlay click (backdrop tap on Android)
navOverlay.addEventListener('click', closeNav);

// Close on Escape key (desktop)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navOpen) closeNav();
});

// ===== MENU FILTER TABS =====
const tabBtns   = document.querySelectorAll('.tab-btn');
const menuCards = document.querySelectorAll('.menu-card');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.cat;

    // Update active state
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Filter + re-animate cards
    menuCards.forEach((card, i) => {
      // Colab wide card: show on "all" and "seblak" tabs
      const cardCat = card.dataset.cat;
      const isColabCard = card.classList.contains('card-colab');
      const match = cat === 'all' || cardCat === cat || (isColabCard && cat === 'seblak');

      if (match) {
        card.classList.remove('hidden');
        // Stagger re-animate
        card.classList.remove('visible');
        // FIX: use requestAnimationFrame for reliable paint on Android
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            card.classList.add('visible');
          });
        });
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== FADE-IN ON SCROLL (IntersectionObserver) =====
// IntersectionObserver is supported on all modern Android Chrome (since Android 5)
const fadeEls = document.querySelectorAll([
  '.menu-card',
  '.testi-card',
  '.info-card',
  '.gallery-item',
  '.highlight-item',
  '.about-text',
  '.about-visual',
  '.owner-text',
  '.owner-visual'
].join(', '));

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  fadeEls.forEach((el, i) => {
    el.classList.add('fade-in');
    // Stagger delay by position (max 4 columns)
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    observer.observe(el);
  });
} else {
  // FIX: Fallback for very old Android WebViews — just show all immediately
  fadeEls.forEach(el => el.classList.add('visible'));
}

// ===== SMOOTH ACTIVE NAV HIGHLIGHT =====
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.style.fontWeight = a.getAttribute('href') === `#${id}` ? '700' : '500';
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObserver.observe(s));
}

// ===== CURRENT YEAR IN FOOTER =====
const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
  footerYear.textContent = footerYear.textContent.replace(
    /\d{4}/,
    new Date().getFullYear()
  );
}

// ===== FIX: Smooth scroll polyfill for older Android WebView =====
// Native scroll-behavior: smooth is widely supported (Android 5+)
// but just in case, we add JS-based smooth scroll as an enhancement
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    // FIX: account for fixed navbar height
    const navH = navbar.getBoundingClientRect().height;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ===== FIX: 300ms tap delay removal for Android older Chrome =====
// Modern CSS `touch-action: manipulation` handles this, but adding
// a passive touchstart listener activates the browser's fast-tap path
document.addEventListener('touchstart', function(){}, { passive: true });

// ===== GALLERY PLACEHOLDER HOVER EFFECT =====
document.querySelectorAll('.gal-placeholder').forEach(el => {
  el.setAttribute('title', 'Foto akan segera ditambahkan');
  el.setAttribute('role', 'img');
  const label = el.querySelector('p');
  if (label) el.setAttribute('aria-label', label.textContent);
});

// ===== DEV CONSOLE =====
console.log(
  '%c🍢 Warung Pempek Memble Mbak Wiwin',
  'color: #e63c1e; font-size: 20px; font-weight: bold;'
);
console.log('%cDibuat dengan ❤️ | ✅ Responsive Desktop & Android', 'color: #f5841f; font-size: 13px;');
