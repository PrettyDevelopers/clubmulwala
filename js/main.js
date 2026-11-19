/* ClubMulwala homepage - interactions (vanilla JS, no dependencies) */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };

  /* Today's trading hours (summer hours; Fri and Sat trade later) */
  var th = $('[data-today-hours]');
  if (th) {
    var day = new Date().getDay();
    th.textContent = day === 5 ? '8am - 12.30am' : day === 6 ? '8am - 1am' : '8am - 11.30pm';
  }

  /* Header shadow once the page scrolls */
  var head = $('.cm-head');
  if (head) {
    var onScroll = function () { head.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* "More" dropdown */
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

  /* Mobile menu */
  var menu = $('[data-menu]'), menuBtn = $('[data-menu-toggle]');
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    root.classList.toggle('cm-lock', open);
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  }
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (more && more.classList.contains('is-open')) { setMore(false); moreBtn.focus(); }
      if (menu && menu.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
    }
  });

  /* Hero slider */
  var hero = $('[data-hero]');
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
    d.addEventListener('visibilitychange', function () { d.hidden ? stop() : start(); });
    start();
  }

  /* Dining venue selector */
  var venues = $$('[data-venue]'), vImgs = $$('[data-venue-img]'), vLabel = $('[data-venue-label]');
  function pick(i) {
    venues.forEach(function (b, k) { b.classList.toggle('is-on', k === i); b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
    vImgs.forEach(function (im, k) { im.classList.toggle('is-on', k === i); });
    if (vLabel) vLabel.textContent = venues[i].getAttribute('data-venue-name');
  }
  venues.forEach(function (b, i) {
    b.addEventListener('click', function () { pick(i); });
    if (window.matchMedia('(hover: hover)').matches) b.addEventListener('mouseenter', function () { pick(i); });
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
