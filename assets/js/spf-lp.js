/**
 * SPF Soluções — Landing Pages JavaScript
 * Versão: 1.0
 * Funcionalidades: scroll reveal, navbar, WhatsApp tracking, smooth scroll
 */
(function () {
  'use strict';

  /* =============================================================
     1. SCROLL REVEAL (Intersection Observer)
     ============================================================= */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.animate-reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger delay if data-delay is set
            const delay = parseInt(entry.target.dataset.delay) || 0;
            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  /* =============================================================
     2. NAVBAR SCROLL EFFECT
     ============================================================= */
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScrollY = 0;

    function updateNavbar() {
      const scrollY = window.scrollY;

      // Add shadow when scrolled
      if (scrollY > 10) {
        navbar.classList.add('navbar--scrolled');
      } else {
        navbar.classList.remove('navbar--scrolled');
      }

      lastScrollY = scrollY;
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar(); // Initial state
  }

  /* =============================================================
     3. WHATSAPP CLICK TRACKING
     ============================================================= */
  function initWhatsAppTracking() {
    const waButtons = document.querySelectorAll('[data-wa-track]');

    waButtons.forEach((btn) => {
      btn.addEventListener('click', function (e) {
        // Don't prevent default — let the link open WhatsApp
        const source = this.dataset.waTrack || 'desconhecido';
        const page = window.location.pathname;
        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get('utm_source') || 'direto';
        const utmMedium = urlParams.get('utm_medium') || '';
        const utmCampaign = urlParams.get('utm_campaign') || '';

        const trackData = {
          source: source,
          page: page,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          timestamp: new Date().toISOString(),
        };

        // Log to console for now (future: send to CRM API)
        console.log('[SPF Track] WhatsApp Click:', trackData);

        // If you add Google Analytics or similar in the future:
        // if (typeof gtag !== 'undefined') {
        //   gtag('event', 'whatsapp_click', trackData);
        // }
      });
    });
  }

  /* =============================================================
     4. SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================================= */
  function initSmoothScroll() {
    document.addEventListener(
      'click',
      function (e) {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const targetId = link.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        const navbarHeight =
          document.querySelector('.navbar')?.offsetHeight || 0;
        const offset = target.offsetTop - navbarHeight - 24;

        window.scrollTo({
          top: offset,
          behavior: 'smooth',
        });
      },
      { passive: false }
    );
  }

  /* =============================================================
     5. COUNTER ANIMATION (for stats/numbers)
     ============================================================= */
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');

    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.counter) || 0;
            const duration = parseInt(el.dataset.duration) || 1500;
            const prefix = el.dataset.prefix || '';
            const suffix = el.dataset.suffix || '';
            const startTime = performance.now();

            function update(now) {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease-out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.round(target * eased);

              el.textContent = prefix + current.toLocaleString('pt-BR') + suffix;

              if (progress < 1) {
                requestAnimationFrame(update);
              }
            }

            requestAnimationFrame(update);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  /* =============================================================
     6. CURRENT YEAR (for footer copyright)
     ============================================================= */
  function initCurrentYear() {
    const yearEls = document.querySelectorAll('[data-current-year]');
    const year = new Date().getFullYear();
    yearEls.forEach((el) => {
      el.textContent = year;
    });
  }

  /* =============================================================
     7. INIT
     ============================================================= */
  function init() {
    initNavbar();
    initScrollReveal();
    initWhatsAppTracking();
    initSmoothScroll();
    initCounters();
    initCurrentYear();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
