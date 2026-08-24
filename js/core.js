/* ============================================================
   HEALTHPLUS PHARMACY
   File: js/core.js
   Purpose: Core UI behaviours shared across ALL pages.
            Handles navigation, scroll effects, reveal animations,
            form helpers, toast notifications, and geolocation.
   Loaded: Every page via <script src="js/core.js" defer>
   ============================================================ */

/* ── NAVIGATION ──────────────────────────────────────────────
   Toggle the mobile hamburger menu open/closed.
   Called by onclick="toggleNav()" on the hamburger element.
   ──────────────────────────────────────────────────────────── */
function toggleNav() {
  const nav = document.getElementById('nav-links');
  if (!nav) return;
  const open = nav.classList.toggle('open');
  /* Lock background scroll while the mobile menu overlay is open */
  document.body.classList.toggle('nav-open', open);
}

/* ── MODAL SCROLL LOCK ───────────────────────────────────────
   Whenever a full-screen overlay (cart, delivery, payment,
   auth) is open, the page behind it must not be scrollable —
   otherwise the site footer (or any other content) can be
   scrolled into view behind a modal that's meant to be the
   sole focus. Call this after any modal's open/closed state
   changes; it locks body scroll if ANY tracked overlay is
   still open, and unlocks it once none are. */
function syncModalScrollLock() {
  const anyOpen = document.querySelector(
    '.modal-overlay.open, .cart-dropdown.open, .auth-modal-overlay.open'
  );
  document.body.classList.toggle('modal-lock', !!anyOpen);
}

/* ── DOM READY ───────────────────────────────────────────────
   Everything below runs after the DOM is fully parsed.
   ──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

  /* Close mobile nav when any link inside it is clicked */
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      const nav = document.getElementById('nav-links');
      if (nav) nav.classList.remove('open');
      /* Restore background scroll */
      document.body.classList.remove('nav-open');
    });
  });

  /* Add .scrolled class to nav when user scrolls past 40px.
     The CSS uses this to add a stronger box-shadow. */
  const siteNav = document.getElementById('site-nav');
  if (siteNav) {
    window.addEventListener('scroll', function () {
      siteNav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ── SCROLL REVEAL ANIMATION ──────────────────────────────
     Any element with class="reveal" starts invisible (opacity 0,
     translateY 24px). When it enters the viewport the observer
     adds class "in-view" which triggers the CSS transition. */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        /* Stop observing once revealed — no need to watch it anymore */
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });

  /* ── DATE INPUT MINIMUM / MAXIMUM ─────────────────────────
     For DOB fields: range is 1930-01-01 to today (past only).
     For appointment/delivery date fields: today onward (future only). */
  var today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(function (el) {
    if (el.id === 'reg-dob') {
      /* Date of birth must be in the past — 1930 to today */
      el.min = '1930-01-01';
      el.max = today;
    } else {
      /* Appointment / delivery dates must be today or in the future */
      if (!el.min) el.min = today;
    }
  });

  /* ── FILTER CHIPS (generic) ───────────────────────────────
     Used on hospital finder and blog category filter.
     Each chip with data-filter calls the right filter function. */
  document.querySelectorAll('.filter-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      /* Only update active state if the chip is in a group
         (they share a parent .filter-group) */
      var group = chip.closest('.filter-group');
      if (group) {
        group.querySelectorAll('.filter-chip').forEach(function (c) {
          c.classList.remove('active');
        });
      }
      chip.classList.add('active');
    });
  });

}); /* end DOMContentLoaded */


/* ── TOAST NOTIFICATION ──────────────────────────────────────
   Shows a brief message at the bottom of the screen.
   Usage: showToast('Your message here');
   Duration: 4 seconds then auto-hides.
   ──────────────────────────────────────────────────────────── */
function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) {
    /* Fallback if toast element is missing from a page */
    console.warn('Toast element not found. Message:', msg);
    return;
  }
  t.textContent = msg;
  t.classList.add('show');
  /* Clear any existing hide timer before starting a new one */
  clearTimeout(t._hideTimer);
  t._hideTimer = setTimeout(function () {
    t.classList.remove('show');
  }, 4000);
}


/* ── GEOLOCATION — USE MY LOCATION ───────────────────────────
   Fills a text input with the user's lat/lng coordinates.
   inputId: the id attribute of the target input element.
   Usage: onclick="useMyLocation('delivery-location')"
   ──────────────────────────────────────────────────────────── */
function useMyLocation(inputId) {
  /* Check browser support */
  if (!navigator.geolocation) {
    showToast('Location services are not available on this device.');
    return;
  }
  showToast('Detecting your location…');
  navigator.geolocation.getCurrentPosition(
    /* Success callback */
    function (pos) {
      var input = document.getElementById(inputId);
      if (input) {
        /* Format coordinates to 4 decimal places */
        input.value = 'Lat ' +
          pos.coords.latitude.toFixed(4) +
          ', Lng ' +
          pos.coords.longitude.toFixed(4);
      }
      showToast('Location detected and added ✓');
    },
    /* Error callback */
    function () {
      showToast('Could not detect location — please type your address.');
    },
    /* Options: timeout after 10 seconds */
    { timeout: 10000 }
  );
}


/* ── CARD FORMATTING HELPERS ─────────────────────────────────
   Used in payment forms to auto-format card number and expiry.
   ──────────────────────────────────────────────────────────── */

/* Format card number as "1234 5678 9012 3456" */
function fmtCard(input) {
  /* Strip non-digits, cap at 16 */
  var v = input.value.replace(/\D/g, '').substring(0, 16);
  /* Insert a space every 4 digits */
  input.value = v.replace(/(.{4})/g, '$1 ').trim();
}

/* Format expiry as "MM / YY" */
function fmtExp(input) {
  var v = input.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 3) {
    v = v.substring(0, 2) + ' / ' + v.substring(2);
  }
  input.value = v;
}


/* ── BLOG CATEGORY FILTER ─────────────────────────────────────
   Called by the category chips on blog.html. Shows/hides
   .blog-card elements based on their data-cat attribute. */
function filterBlog(cat, chipEl) {
  document.querySelectorAll('.cat-chip').forEach(function (c) {
    c.classList.remove('active');
  });
  if (chipEl) chipEl.classList.add('active');

  document.querySelectorAll('.blog-card').forEach(function (card) {
    var show = (cat === 'all') || (card.getAttribute('data-cat') === cat);
    card.style.display = show ? '' : 'none';
  });
}


/* ── NEWSLETTER SUBSCRIBE ────────────────────────────────────
   Validates the email input on the blog newsletter form.
   ──────────────────────────────────────────────────────────── */
function subscribeNewsletter() {
  var input = document.getElementById('nl-email');
  var email = input ? input.value.trim() : '';
  /* Basic email format check */
  if (!email || !email.includes('@') || !email.includes('.')) {
    showToast('Please enter a valid email address.');
    return;
  }
  showToast('Subscribed! Health tips on the way 🎉');
  if (input) input.value = '';
}



