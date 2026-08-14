/* ============================================================
   HEALTHPLUS PHARMACY
   File: js/security.js
   Purpose: Client-side security layer for HealthPlus.
            Provides both DEFENSIVE and DETECTION capabilities.

   IMPORTANT: This is a client-side security layer.
   It works alongside — NOT instead of — server-side
   security. For a production deployment you MUST also
   implement HTTPS, Content Security Policy headers,
   server-side input validation, parameterised SQL queries,
   rate limiting, and secure session management.

   WHAT THIS FILE DOES
   ───────────────────
   DEFENCE SECTION
     D1. Input sanitisation — strips dangerous characters
         from all form fields before submission
     D2. Payment field protection — clears card / MoMo data
         from the DOM when the modal closes; blocks DevTools
         paste attacks into hidden payment fields
     D3. Anti-clickjacking — detects if the page is loaded
         inside an iframe (often used in UI redress attacks)
         and breaks out to top frame
     D4. Content Security — detects unexpected script tags
         injected into the DOM at runtime (basic XSS guard)
     D5. Session timeout — warns idle users and clears
         sensitive in-memory state after inactivity
     D6. Copy-paste protection on payment fields — prevents
         automated tools from pasting bulk card data

   DETECTION / ATTACK MONITORING SECTION
     A1. DevTools detection — notices when browser DevTools
         are opened (common first step of scraping / tampering)
     A2. Right-click / keyboard shortcut monitoring — logs
         attempts to open inspect / view-source on sensitive pages
     A3. Input tampering detection — watches for attempts
         to set values on payment inputs via JS console
     A4. Rapid-fire form submission detection — flags
         bot-like submission patterns
     A5. Suspicious navigation detection — flags deep-link
         direct access to payment flows without going through
         the normal booking funnel
     A6. Security event logging — all detections are stored
         in sessionStorage and can be sent to your server
   ============================================================ */


/* ── CONFIGURATION ───────────────────────────────────────────
   Tune these values for your deployment.
   ──────────────────────────────────────────────────────────── */
var SEC_CONFIG = {
  /* How many minutes of inactivity before warning the user */
  SESSION_TIMEOUT_MINUTES: 15,

  /* How many seconds of further inactivity before clearing payment state */
  SESSION_CLEAR_SECONDS: 60,

  /* Whether to log security events to console (disable in production) */
  DEBUG_LOGGING: false,

  /* Pages that should NOT be accessed by direct URL without referrer.
     Checked by A5 suspicious navigation detection. */
  PROTECTED_PATHS: ['order-online.html'],

  /* Maximum submissions per minute before flagging as bot-like */
  MAX_SUBMISSIONS_PER_MINUTE: 5
};


/* ── INTERNAL SECURITY LOG ───────────────────────────────────
   All security events are appended here and stored in
   sessionStorage so they survive page refreshes within
   the same browser session. In production, POST these
   to your server's security endpoint.
   ──────────────────────────────────────────────────────────── */
var _securityLog = [];

/* Load any existing log from this session */
(function () {
  try {
    var stored = sessionStorage.getItem('hp_sec_log');
    if (stored) _securityLog = JSON.parse(stored);
  } catch (e) { /* sessionStorage may be unavailable in private mode */ }
})();


/* ── LOG SECURITY EVENT ──────────────────────────────────────
   Records a security event with timestamp, type, and detail.
   Parameters:
     type   : string — event category (e.g. 'XSS_ATTEMPT')
     detail : string — human-readable description
   ──────────────────────────────────────────────────────────── */
function _logSecEvent(type, detail) {
  var event = {
    ts:      new Date().toISOString(),
    type:    type,
    detail:  detail,
    page:    window.location.pathname,
    ua:      navigator.userAgent.substring(0, 120)
  };
  _securityLog.push(event);

  /* Persist to sessionStorage (capped at 200 events to avoid bloat) */
  if (_securityLog.length > 200) _securityLog.shift();
  try {
    sessionStorage.setItem('hp_sec_log', JSON.stringify(_securityLog));
  } catch (e) { /* ignore storage errors */ }

  /* Optional console output during development */
  if (SEC_CONFIG.DEBUG_LOGGING) {
    console.warn('[HealthPlus Security]', type, ':', detail);
  }
}


/* ── GET SECURITY LOG ────────────────────────────────────────
   Returns the accumulated security event log.
   Call this to POST events to your server endpoint.
   ──────────────────────────────────────────────────────────── */
function getSecurityLog() {
  return _securityLog.slice(); /* Return a copy */
}


/* ──────────────────────────────────────────────────────────────
   ═══════════════════════════════════════════════════════════════
   DEFENCE SECTION
   ═══════════════════════════════════════════════════════════════
   ────────────────────────────────────────────────────────────── */


/* ── D1. INPUT SANITISATION ──────────────────────────────────
   Scans all visible form inputs before any form submits.
   Strips HTML tags, script keywords, and SQL injection patterns
   from text fields. Does NOT touch password or card number fields
   (those are handled separately by D2).

   This is a defence-in-depth measure. The server must
   ALSO validate and sanitise — never trust only client-side.
   ──────────────────────────────────────────────────────────── */
function sanitiseAllInputs() {
  /* Regex patterns that indicate potential injection attempts */
  var DANGEROUS_PATTERNS = [
    /<script[\s\S]*?>/gi,            /* Opening script tags */
    /<\/script>/gi,                  /* Closing script tags */
    /javascript\s*:/gi,              /* javascript: protocol */
    /on\w+\s*=\s*["'`]/gi,          /* Inline event handlers (onerror=, onclick=) */
    /data\s*:\s*text\/html/gi,       /* Data URI HTML injection */
    /vbscript\s*:/gi,               /* VBScript protocol (IE) */
    /<iframe/gi,                     /* Iframe injection */
    /<img\s+[^>]*\bsrc\s*=/gi,      /* Image src injection */
    /UNION\s+SELECT/gi,             /* SQL UNION injection */
    /DROP\s+TABLE/gi,               /* SQL DROP injection */
    /INSERT\s+INTO/gi,              /* SQL INSERT injection */
    /;\s*DELETE\s+FROM/gi,          /* SQL DELETE injection */
    /--\s*$/gm,                     /* SQL comment injection */
    /\/\*[\s\S]*?\*\//g             /* Block comment injection */
  ];

  /* Fields to skip (sensitive — handled by D2) */
  var SKIP_IDS = ['card-num', 'card-exp', 'card-cvv',
                  'card-name', 'momo-number', 'momo-name'];

  document.querySelectorAll(
    'input[type="text"], input[type="tel"], input[type="email"], textarea'
  ).forEach(function (input) {
    /* Skip payment fields */
    if (SKIP_IDS.indexOf(input.id) !== -1) return;
    /* Skip read-only and disabled fields */
    if (input.readOnly || input.disabled) return;

    var original = input.value;
    var cleaned  = original;

    DANGEROUS_PATTERNS.forEach(function (pattern) {
      cleaned = cleaned.replace(pattern, '');
    });

    if (cleaned !== original) {
      /* Value was modified — a dangerous pattern was found */
      input.value = cleaned;
      _logSecEvent('XSS_INPUT_SANITISED', 'Field "' + (input.id || input.name) +
        '" contained dangerous content. Stripped before submission.');
      /* Show a subtle warning to the user */
      showToast('Some special characters were removed from your input for security.');
    }
  });
}


/* ── D2. PAYMENT FIELD PROTECTION ────────────────────────────
   A) Clears card and MoMo fields from the DOM after the
      payment modal closes (already called in payment.js
      _clearPaymentFields — this adds an extra DOM watcher).
   B) Disables autocomplete on payment fields to prevent
      browsers from caching sensitive data.
   C) Blocks automated paste-injection: if the pasted value
      contains obviously non-card characters (e.g. <script>),
      it is cleared immediately.
   ──────────────────────────────────────────────────────────── */
function protectPaymentFields() {
  var PAYMENT_FIELD_IDS = ['card-num', 'card-exp', 'card-cvv',
                           'card-name', 'momo-number', 'momo-name'];

  PAYMENT_FIELD_IDS.forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;

    /* Disable autocomplete — browser should not remember card data */
    el.setAttribute('autocomplete', 'off');
    el.setAttribute('autocorrect', 'off');
    el.setAttribute('autocapitalize', 'off');

    /* Guard paste events on payment fields */
    el.addEventListener('paste', function (e) {
      /* Read pasted text */
      var pasted = (e.clipboardData || window.clipboardData).getData('text');
      /* Check for injection attempts in pasted content */
      if (/<|>|script|javascript/i.test(pasted)) {
        e.preventDefault(); /* Block the paste */
        _logSecEvent('PAYMENT_PASTE_BLOCKED',
          'Suspicious paste attempt on field "' + id + '" was blocked.');
        showToast('Paste blocked for security. Please type your details.');
      }
    });
  });
}


/* ── D3. ANTI-CLICKJACKING ───────────────────────────────────
   If this page is loaded inside an iframe, break out.
   Clickjacking attacks overlay an invisible iframe over a
   fake page to trick users into clicking our buttons
   (e.g. confirming a payment) without knowing.

   This is a client-side supplement to the HTTP header:
     X-Frame-Options: SAMEORIGIN
   which your server should also send.
   ──────────────────────────────────────────────────────────── */
function preventClickjacking() {
  if (window.self !== window.top) {
    /* We are inside an iframe — break out to the top frame */
    _logSecEvent('CLICKJACKING_ATTEMPT',
      'Page was loaded inside an iframe. Breaking out to top frame.');
    try {
      window.top.location = window.self.location;
    } catch (e) {
      /* Cross-origin iframe — we cannot navigate top.
         Hide our content so it cannot be used as a clickjacking target. */
      document.documentElement.style.display = 'none';
    }
  }
}


/* ── D4. RUNTIME XSS / DOM INJECTION GUARD ──────────────────
   Uses a MutationObserver to watch for unexpected <script>
   tags or event-handler attributes being injected into
   the DOM at runtime — a sign of a DOM-based XSS attack.

   Legitimate scripts are loaded via <script src="..."> in
   the <head> — any inline script added dynamically is
   treated as suspicious on pages with payment forms.
   ──────────────────────────────────────────────────────────── */
function watchForDOMInjection() {
  /* Only watch on pages that have payment forms */
  var hasPaymentForm = document.getElementById('pay-modal');
  if (!hasPaymentForm) return;

  var domObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        /* Check if a <script> was injected into the DOM */
        if (node.nodeName === 'SCRIPT' && !node.src) {
          /* Inline script added at runtime — suspicious */
          _logSecEvent('DOM_SCRIPT_INJECTION',
            'An inline <script> was injected into the DOM at runtime. ' +
            'Content: ' + (node.textContent || '').substring(0, 200));
          /* Remove the injected node */
          try { node.parentNode.removeChild(node); } catch (e) { /* ignore */ }
        }

        /* Check for dangerous attributes on injected elements */
        if (node.setAttribute && node.hasAttribute) {
          ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus'].forEach(function (attr) {
            if (node.hasAttribute(attr)) {
              _logSecEvent('DOM_ATTR_INJECTION',
                'An element with event handler "' + attr + '" was injected into the DOM.');
              node.removeAttribute(attr);
            }
          });
        }
      });
    });
  });

  /* Observe the entire document body */
  domObserver.observe(document.body, {
    childList: true,
    subtree:   true,
    attributes: true,
    attributeFilter: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus',
                      'onblur', 'onsubmit', 'onkeypress', 'src', 'href']
  });
}


/* ── D5. SESSION TIMEOUT ─────────────────────────────────────
   Tracks user activity. After TIMEOUT minutes of inactivity
   on a page with a payment form, warns the user. After a
   further CLEAR_SECONDS of inactivity, clears sensitive
   in-memory data (cart, payment state).
   ──────────────────────────────────────────────────────────── */
var _idleTimer   = null;
var _warnTimer   = null;
var _sessionActive = true;

function resetIdleTimer() {
  if (!_sessionActive) return;
  clearTimeout(_idleTimer);
  clearTimeout(_warnTimer);

  /* Start countdown to warning */
  _idleTimer = setTimeout(function () {
    _warnIdleSession();
  }, SEC_CONFIG.SESSION_TIMEOUT_MINUTES * 60 * 1000);
}

function _warnIdleSession() {
  /* Only warn if there's an active payment form */
  if (!document.getElementById('pay-modal')) return;
  showToast('Your session is about to expire for security. Click anywhere to continue.');
  _logSecEvent('SESSION_IDLE_WARNING',
    'User has been inactive for ' + SEC_CONFIG.SESSION_TIMEOUT_MINUTES + ' minutes.');

  /* Start countdown to data clear */
  _warnTimer = setTimeout(function () {
    _clearSessionData();
  }, SEC_CONFIG.SESSION_CLEAR_SECONDS * 1000);
}

function _clearSessionData() {
  /* Clear payment form fields */
  if (typeof _clearPaymentFields === 'function') _clearPaymentFields();

  /* Clear cart if on pharmacy page */
  if (typeof _cart !== 'undefined') {
    _cart = {};
    if (typeof renderCart === 'function') renderCart();
  }

  showToast('Your session has been cleared for security. Please refresh to continue.');
  _logSecEvent('SESSION_CLEARED', 'Session data cleared after inactivity timeout.');
}

function initSessionTimeout() {
  /* Watch for any user interaction to reset the timer */
  ['mousedown', 'mousemove', 'keypress', 'touchstart', 'scroll', 'click']
    .forEach(function (evt) {
      document.addEventListener(evt, resetIdleTimer, { passive: true });
    });
  resetIdleTimer(); /* Start the first timer */
}


/* ── D6. COPY-PASTE PROTECTION ON PAYMENT FIELDS ────────────
   Disables copy from card number field so the number cannot
   be accidentally copied to clipboard during entry and then
   harvested by another tab's clipboard access.
   ──────────────────────────────────────────────────────────── */
function blockCopyOnPaymentFields() {
  var cardNum = document.getElementById('card-num');
  if (!cardNum) return;

  cardNum.addEventListener('copy', function (e) {
    /* Block copy event — card numbers should not go to clipboard */
    e.preventDefault();
    _logSecEvent('CARD_COPY_BLOCKED', 'User attempted to copy card number field.');
  });

  cardNum.addEventListener('cut', function (e) {
    e.preventDefault();
  });
}


/* ──────────────────────────────────────────────────────────────
   ═══════════════════════════════════════════════════════════════
   DETECTION / ATTACK MONITORING SECTION
   ═══════════════════════════════════════════════════════════════
   ────────────────────────────────────────────────────────────── */


/* ── A1. DEVTOOLS DETECTION ──────────────────────────────────
   Opening DevTools is the first step of:
     - Scraping sensitive data from the DOM
     - Inspecting and replaying network requests
     - Patching JavaScript to bypass payment checks
   We detect it and log it. We do NOT block it (that would
   be futile and break legitimate debugging) but on a
   production site you should POST this to your server
   so your team is aware.
   ──────────────────────────────────────────────────────────── */
function detectDevTools() {
  var threshold = 160; /* px — DevTools panel takes this much space */
  var _devToolsOpen = false;

  /* Repeated dimension checks */
  setInterval(function () {
    var widthDiff  = window.outerWidth  - window.innerWidth;
    var heightDiff = window.outerHeight - window.innerHeight;
    var nowOpen    = widthDiff > threshold || heightDiff > threshold;

    if (nowOpen && !_devToolsOpen) {
      _devToolsOpen = true;
      _logSecEvent('DEVTOOLS_OPENED',
        'Browser DevTools were opened. outer:' + window.outerWidth +
        'x' + window.outerHeight + ' inner:' + window.innerWidth +
        'x' + window.innerHeight);
    } else if (!nowOpen && _devToolsOpen) {
      _devToolsOpen = false;
    }
  }, 1000);

  /* Secondary technique: debugger timing trick
     (a debugger statement takes microseconds in normal mode
     but milliseconds when DevTools is open and Sources panel is active) */
  (function _devtoolsTiming() {
    var start = Date.now();
    /* jshint ignore:start */
    debugger; /* eslint-disable-line no-debugger */
    /* jshint ignore:end */
    if (Date.now() - start > 100) {
      _logSecEvent('DEVTOOLS_DEBUGGER_ACTIVE',
        'Debugger appears to be active (Sources panel open).');
    }
  })();
}


/* ── A2. RIGHT-CLICK / KEYBOARD SHORTCUT MONITORING ─────────
   On pages with payment forms, log attempts to open
   DevTools via keyboard shortcuts or the context menu.
   We do NOT prevent the action (that's easily bypassed)
   but we do record the attempt.
   ──────────────────────────────────────────────────────────── */
function monitorInspectAttempts() {
  /* Only monitor on payment pages */
  if (!document.getElementById('pay-modal')) return;

  /* Right-click context menu */
  document.addEventListener('contextmenu', function (e) {
    _logSecEvent('CONTEXT_MENU_ON_PAYMENT_PAGE',
      'Right-click on payment page at element: ' +
      (e.target.tagName || 'unknown'));
  });

  /* Common DevTools keyboard shortcuts */
  document.addEventListener('keydown', function (e) {
    /* F12 — DevTools */
    if (e.key === 'F12') {
      _logSecEvent('KEYBOARD_F12', 'F12 pressed on payment page.');
    }
    /* Ctrl/Cmd + Shift + I — Inspect */
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
      _logSecEvent('KEYBOARD_INSPECT', 'Ctrl+Shift+I pressed on payment page.');
    }
    /* Ctrl/Cmd + Shift + J — Console */
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
      _logSecEvent('KEYBOARD_CONSOLE', 'Ctrl+Shift+J pressed on payment page.');
    }
    /* Ctrl/Cmd + U — View Source */
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
      _logSecEvent('KEYBOARD_VIEW_SOURCE', 'Ctrl+U pressed on payment page.');
    }
  });
}


/* ── A3. INPUT TAMPERING DETECTION ──────────────────────────
   Uses Object.defineProperty to intercept attempts to
   programmatically set the value of payment input fields.
   Attackers using the browser console might try:
     document.getElementById('card-num').value = 'stolen_card';
   This catches that and logs it.
   ──────────────────────────────────────────────────────────── */
function detectInputTampering() {
  var WATCHED_IDS = ['card-num', 'card-exp', 'card-cvv', 'momo-number'];

  WATCHED_IDS.forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;

    /* Save the original native setter AND getter */
    var nativeDescriptor = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype, 'value'
    );
    var nativeSetter = nativeDescriptor.set;
    var nativeGetter = nativeDescriptor.get;

    /* Override value setter/getter */
    Object.defineProperty(el, 'value', {
      set: function (newVal) {
        /* Only log if change did NOT come from normal user input */
        if (!el._userInputActive) {
          _logSecEvent('PAYMENT_FIELD_PROGRAMMATIC_SET',
            'Payment field "' + id + '" was set programmatically with value length: ' +
            String(newVal).length);
        }
        /* Still allow the value change (blocking it would break our own code) */
        nativeSetter.call(el, newVal);
      },
      get: function () {
        /* BUGFIX: always read the real current value through the native
           getter — this used to return undefined, which broke every
           payment form (momoNum.value.trim() would throw). */
        return nativeGetter.call(el);
      },
      configurable: true
    });

    /* Mark when user is actively typing (distinguishes user vs code) */
    el.addEventListener('keydown',  function () { el._userInputActive = true;  });
    el.addEventListener('keyup',    function () { el._userInputActive = false; });
    el.addEventListener('paste',    function () { el._userInputActive = true;  });
    el.addEventListener('input',    function () { el._userInputActive = false; });
  });
}


/* ── A4. RAPID-FIRE FORM SUBMISSION DETECTION ────────────────
   Bots and automated attack tools often submit forms very
   rapidly. Track submission timestamps and flag if more than
   MAX_SUBMISSIONS_PER_MINUTE occur.
   ──────────────────────────────────────────────────────────── */
var _submissionTimestamps = [];

function recordFormSubmission() {
  var now = Date.now();
  _submissionTimestamps.push(now);

  /* Remove timestamps older than 60 seconds */
  _submissionTimestamps = _submissionTimestamps.filter(function (ts) {
    return now - ts < 60000;
  });

  if (_submissionTimestamps.length > SEC_CONFIG.MAX_SUBMISSIONS_PER_MINUTE) {
    _logSecEvent('RAPID_SUBMISSION_DETECTED',
      _submissionTimestamps.length + ' form submissions in the last 60 seconds. ' +
      'Possible bot or automated attack.');
    showToast('Too many submissions detected. Please wait a moment.');
    return false; /* Caller should block this submission */
  }
  return true; /* Submission is within normal rate */
}


/* ── A5. SUSPICIOUS NAVIGATION DETECTION ────────────────────
   Checks if the user arrived at a protected payment page
   directly (e.g. by typing the URL) without going through
   the normal booking funnel. Direct URL access to payment
   pages can indicate:
     - Automated scraping of the payment flow
     - Bookmark/link sharing of deep payment links
     - Session replay attacks
   ──────────────────────────────────────────────────────────── */
function detectSuspiciousNavigation() {
  var currentPath = window.location.pathname;
  var isProtected = SEC_CONFIG.PROTECTED_PATHS.some(function (p) {
    return currentPath.includes(p);
  });

  if (!isProtected) return; /* Not a protected page */

  /* Check if there's a valid referrer from our own site */
  var referrer = document.referrer;
  var ownOrigin = window.location.origin;

  if (!referrer || !referrer.startsWith(ownOrigin)) {
    /* Direct access to protected page from outside the site */
    _logSecEvent('DIRECT_ACCESS_PROTECTED_PAGE',
      'Protected page accessed directly without site referrer. ' +
      'Referrer: "' + (referrer || 'none') + '"');
    /* We do NOT block the access — that would harm real users
       with bookmarks. We log it for review. */
  }
}


/* ── A6. EXPOSE SECURITY REPORT FUNCTION ────────────────────
   In production, call this from your server health-check
   script to POST the log to your security endpoint.

   Example (call from your server monitoring code):
     var report = window.HP_Security.getReport();
     fetch('/api/security-events', { method: 'POST', body: JSON.stringify(report) });
   ──────────────────────────────────────────────────────────── */
window.HP_Security = {
  /* Get all logged security events */
  getReport: function () {
    return {
      session_start: sessionStorage.getItem('hp_sec_session_start') || new Date().toISOString(),
      page:          window.location.href,
      events:        getSecurityLog()
    };
  },
  /* Clear the security log (e.g. after successful POST to server) */
  clearLog: function () {
    _securityLog = [];
    try { sessionStorage.removeItem('hp_sec_log'); } catch (e) { /* ignore */ }
  }
};


/* ──────────────────────────────────────────────────────────────
   INITIALISATION — runs when the page loads
   All defence and detection functions are started here.
   ────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

  /* Record session start time */
  try {
    if (!sessionStorage.getItem('hp_sec_session_start')) {
      sessionStorage.setItem('hp_sec_session_start', new Date().toISOString());
    }
  } catch (e) { /* ignore */ }

  /* ── DEFENCE ── */
  preventClickjacking();       /* D3: Break out of iframes immediately */
  protectPaymentFields();      /* D2: Secure payment input attributes */
  blockCopyOnPaymentFields();  /* D6: Block card number copying */
  watchForDOMInjection();      /* D4: Watch for runtime script injection */
  initSessionTimeout();        /* D5: Start idle session timer */
  detectInputTampering();      /* A3: Watch for programmatic field setting */

  /* Sanitise inputs on every form submit */
  document.querySelectorAll('form').forEach(function (form) {
    form.addEventListener('submit', function () {
      sanitiseAllInputs();
    }, true); /* Capture phase — runs before other submit handlers */
  });

  /* ── DETECTION ── */
  detectDevTools();             /* A1: Watch for DevTools opening */
  monitorInspectAttempts();     /* A2: Log inspect keyboard shortcuts */
  detectSuspiciousNavigation(); /* A5: Check for direct URL access */

  _logSecEvent('SECURITY_MODULE_LOADED',
    'HealthPlus security module initialised on page: ' + window.location.pathname);
});
