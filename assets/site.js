/* ═══════════════════════════════════════════════════════════════════
   ZKK Consulting LLC — shared site behaviour (v5)
   Nav shrink, mobile menu, scroll reveal, smooth anchors.
   Nothing on the site depends on this file to be readable.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = typeof window.gsap !== 'undefined';
  var hasST = hasGSAP && typeof window.ScrollTrigger !== 'undefined';
  var animate = hasGSAP && !reduceMotion;
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  window.ZKK = { reduceMotion: reduceMotion, animate: animate, hasST: hasST };

  /* ── SCROLL REVEAL ── */
  if (animate) {
    document.body.classList.add('js-anim');
    gsap.set('.fade-up', { opacity: 0, y: 30 });
    if (hasST) {
      ScrollTrigger.batch('.fade-up', {
        start: 'top 88%',
        onEnter: function (els) {
          gsap.to(els, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.09, overwrite: true });
        }
      });
      ScrollTrigger.refresh();
    } else {
      gsap.to('.fade-up', { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 });
    }
  }

  /* ── NAV SHRINK ── */
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('shrink', (window.pageYOffset || document.documentElement.scrollTop) > 30);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── SMOOTH SCROLL + HASH ── */
  var navH = 72;
  function scrollToTarget(target) {
    var y = target.getBoundingClientRect().top + window.pageYOffset - navH + 1;
    window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (ev) {
      var id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      ev.preventDefault();
      scrollToTarget(target);
      if (history.pushState) history.pushState(null, '', id);
      else window.location.hash = id;
    });
  });
  window.addEventListener('popstate', function () {
    var h = window.location.hash;
    if (h && h.length > 1) { var t = document.querySelector(h); if (t) scrollToTarget(t); }
  });
  if (window.location.hash && window.location.hash.length > 1) {
    var initTarget = document.querySelector(window.location.hash);
    if (initTarget) window.setTimeout(function () { scrollToTarget(initTarget); }, 60);
  }

  /* ── MOBILE MENU ── */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    var closeMenu = function () {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };
    hamburger.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    var mc = document.getElementById('mobileClose');
    if (mc) mc.addEventListener('click', closeMenu);
    document.querySelectorAll('.mobile-link').forEach(function (l) { l.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ── ACTIVE IN-PAGE NAV LINK ── */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var id = e.target.id;
          navLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { navObs.observe(s); });
  }
})();
