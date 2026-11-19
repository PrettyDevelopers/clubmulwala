/* ClubMulwala homepage - interactions (vanilla JS, no dependencies) */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };

  /* Today's trading hours (summer hours; Fri and Sat trade later) */
  var day = new Date().getDay();
  $$('[data-today-hours]').forEach(function (el) {
    el.textContent = day === 5 ? '8am - 12.30am' : day === 6 ? '8am - 1am' : '8am - 11.30pm';
  });

  /* Header: transparent over the hero, solid once the page scrolls */
  var head = $('.cm-head'), hero = $('[data-hero]'), mbar = $('[data-mbar]');
  function onScroll() {
    var y = window.scrollY;
    if (head) {
      head.classList.toggle('is-over', !!hero && y < 60);
      head.classList.toggle('is-scrolled', y > 60);
    }
    if (mbar && hero) mbar.classList.toggle('is-on', y > hero.offsetHeight * 0.75);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* Desktop "More" dropdown */
  var more = $('[data-more]'), moreBtn = $('[data-more-toggle]');
  function setMore(open) {
    if (!more) return;
    more.classList.toggle('is-open', open);
    moreBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (moreBtn) {
    moreBtn.addEventListener('click', function (e) { e.stopPropagation(); setMore(!more.classList.contains('is-open')); });
    d.addEventListener('click', function (e) { if (!more.contains(e.target)) setMore(false); });
  }

  /* Full-screen menu */
  var menu = $('[data-menu]'), menuBtn = $('[data-menu-toggle]'), menuClose = $('[data-menu-close]');
  function focusables() {
    return $$('a[href], button:not([disabled])', menu).filter(function (el) { return el.offsetParent !== null; });
  }
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('is-open', open);
    if (open) menu.removeAttribute('inert'); else menu.setAttribute('inert', '');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    root.classList.toggle('cm-lock', open);
    if (open) { setTimeout(function () { menuClose.focus(); }, 60); }
    else { menuBtn.focus(); }
  }
  if (menu && menuBtn) {
    menuBtn.addEventListener('click', function () { setMenu(true); });
    menuClose.addEventListener('click', function () { setMenu(false); });
    /* Any link in the menu closes it (in-page anchors then scroll to their section) */
    $$('a[href]', menu).forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('is-open'); menu.setAttribute('inert', '');
        menuBtn.setAttribute('aria-expanded', 'false'); root.classList.remove('cm-lock');
      });
    });
    /* Sub-menus */
    $$('.cm-menu__tog', menu).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var sub = d.getElementById(btn.getAttribute('aria-controls'));
        var open = btn.getAttribute('aria-expanded') !== 'true';
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        sub.classList.toggle('is-open', open);
      });
    });
    /* Keep keyboard focus inside the open menu */
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = focusables(), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    /* The menu is for tablet and phone only; close it if the window grows to desktop */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1120 && menu.classList.contains('is-open')) setMenu(false);
    });
  }
  d.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (menu && menu.classList.contains('is-open')) setMenu(false);
    if (more && more.classList.contains('is-open')) { setMore(false); moreBtn.focus(); }
  });

  /* Hero slider (auto, arrows, dots, swipe) */
  if (hero) {
    var slides = $$('[data-slide]', hero), dots = $$('[data-go]', hero), cur = 0, timer = null;
    var show = function (i) {
      cur = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-on', k === cur); });
      dots.forEach(function (b, k) { b.classList.toggle('is-on', k === cur); b.setAttribute('aria-pressed', k === cur ? 'true' : 'false'); });
    };
    var stop = function () { clearInterval(timer); timer = null; };
    var start = function () { if (reduce || timer) return; timer = setInterval(function () { show(cur + 1); }, 6500); };
    dots.forEach(function (b) { b.addEventListener('click', function () { show(+b.getAttribute('data-go')); }); });
    var nx = $('[data-next]', hero), pv = $('[data-prev]', hero);
    if (nx) nx.addEventListener('click', function () { show(cur + 1); });
    if (pv) pv.addEventListener('click', function () { show(cur - 1); });
    hero.addEventListener('mouseenter', stop); hero.addEventListener('mouseleave', start);
    hero.addEventListener('focusin', stop); hero.addEventListener('focusout', start);
    var sx = null, sy = null;
    hero.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) { stop(); show(cur + (dx < 0 ? 1 : -1)); start(); }
      sx = sy = null;
    }, { passive: true });
    d.addEventListener('visibilitychange', function () { d.hidden ? stop() : start(); });
    start();
  }

  /* Dining venue selector (desktop: hover or click; phone: tap opens the venue) */
  var venues = $$('[data-venue]'), vImgs = $$('[data-venue-img]'), vLabel = $('[data-venue-label]');
  function pick(i) {
    venues.forEach(function (b, k) { b.classList.toggle('is-on', k === i); b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
    vImgs.forEach(function (im, k) { im.classList.toggle('is-on', k === i); });
    if (vLabel) vLabel.textContent = venues[i].getAttribute('data-venue-name');
  }
  var canHover = window.matchMedia('(hover: hover)').matches;
  venues.forEach(function (b, i) {
    b.addEventListener('click', function () { pick(i); });
    if (canHover) b.addEventListener('mouseenter', function () { pick(i); });
  });

  /* Resort rates toggle: rack vs member */
  var rateBtns = $$('[data-rate]'), cells = $$('[data-rack]'), note = $('[data-rate-note]');
  rateBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var mem = btn.getAttribute('data-rate') === 'member';
      rateBtns.forEach(function (b) { var on = b === btn; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      cells.forEach(function (c) { c.textContent = c.getAttribute(mem ? 'data-member' : 'data-rack'); });
      if (note) note.textContent = mem ? 'ClubMulwala Member rate: 20% off the rack rate, minimum 2 night stay.' : 'Rack rate.';
    });
  });

  /* Reviews carousel */
  var quotes = $$('[data-quote]'), qLabel = $('[data-q-label]'), q = 0;
  function showQ(i) {
    q = (i + quotes.length) % quotes.length;
    quotes.forEach(function (el, k) { el.classList.toggle('is-on', k === q); el.setAttribute('aria-hidden', k === q ? 'false' : 'true'); });
    if (qLabel) qLabel.textContent = (q + 1) + ' of ' + quotes.length;
  }
  if (quotes.length) {
    showQ(0);
    var qn = $('[data-q-next]'), qp = $('[data-q-prev]');
    if (qn) qn.addEventListener('click', function () { showQ(q + 1); });
    if (qp) qp.addEventListener('click', function () { showQ(q - 1); });
  }

  /* Swipe rails (phone): a slim progress line under each rail */
  $$('[data-rail]').forEach(function (rail) {
    var bar = d.createElement('div'), fill = d.createElement('i');
    bar.className = 'cm-rail__bar'; bar.setAttribute('aria-hidden', 'true'); bar.appendChild(fill);
    rail.parentNode.insertBefore(bar, rail.nextSibling);
    function update() {
      var max = rail.scrollWidth - rail.clientWidth;
      var frac = rail.scrollWidth ? rail.clientWidth / rail.scrollWidth : 1;
      fill.style.width = (frac * 100) + '%';
      fill.style.transform = 'translateX(' + (max > 0 ? (rail.scrollLeft / max) * (1 / frac - 1) * 100 : 0) + '%)';
    }
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  /* Newsletter: light validation before handing off to Mailchimp */
  var form = $('[data-newsletter]');
  if (form) {
    var msg = $('[data-form-msg]', form);
    form.addEventListener('submit', function (e) {
      var bad = $$('input[required]', form).filter(function (i) { return !i.checkValidity(); });
      if (bad.length) {
        e.preventDefault();
        msg.textContent = 'Please enter your first name, last name and a valid email address.';
        bad[0].focus();
        return;
      }
      msg.textContent = 'Thanks! Please check the new tab to confirm your subscription.';
    });
  }

  /* Scroll reveal */
  var rv = $$('.cm-rv');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('is-in'); });
  }
})();
