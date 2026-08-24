/* ============================================================
   HEALTHPLUS PHARMACY
   File: js/auth.js
   Purpose: Customer registration, login, session management,
            shopping cart persistence, checkout flow with
            progress indicators, order management, order
            cancellation, and email confirmation simulation.
   Depends on: js/core.js, js/payment.js
   Loaded: All pages (registration overlay is global)
   ============================================================ */


/* ============================================================
   COUNTRY DATA — All countries with dial codes
   ============================================================ */
var COUNTRIES = [
  { name:'Afghanistan',         code:'AF', dial:'+93'  },
  { name:'Albania',             code:'AL', dial:'+355' },
  { name:'Algeria',             code:'DZ', dial:'+213' },
  { name:'Argentina',           code:'AR', dial:'+54'  },
  { name:'Armenia',             code:'AM', dial:'+374' },
  { name:'Australia',           code:'AU', dial:'+61'  },
  { name:'Austria',             code:'AT', dial:'+43'  },
  { name:'Bahrain',             code:'BH', dial:'+973' },
  { name:'Bangladesh',          code:'BD', dial:'+880' },
  { name:'Belgium',             code:'BE', dial:'+32'  },
  { name:'Benin',               code:'BJ', dial:'+229' },
  { name:'Brazil',              code:'BR', dial:'+55'  },
  { name:'Burkina Faso',        code:'BF', dial:'+226' },
  { name:'Cameroon',            code:'CM', dial:'+237' },
  { name:'Canada',              code:'CA', dial:'+1'   },
  { name:'Chad',                code:'TD', dial:'+235' },
  { name:'China',               code:'CN', dial:'+86'  },
  { name:"Côte d'Ivoire",       code:'CI', dial:'+225' },
  { name:'Denmark',             code:'DK', dial:'+45'  },
  { name:'Egypt',               code:'EG', dial:'+20'  },
  { name:'Ethiopia',            code:'ET', dial:'+251' },
  { name:'Finland',             code:'FI', dial:'+358' },
  { name:'France',              code:'FR', dial:'+33'  },
  { name:'Gambia',              code:'GM', dial:'+220' },
  { name:'Germany',             code:'DE', dial:'+49'  },
  { name:'Ghana',               code:'GH', dial:'+233' },
  { name:'Greece',              code:'GR', dial:'+30'  },
  { name:'Guinea',              code:'GN', dial:'+224' },
  { name:'India',               code:'IN', dial:'+91'  },
  { name:'Indonesia',           code:'ID', dial:'+62'  },
  { name:'Iran',                code:'IR', dial:'+98'  },
  { name:'Iraq',                code:'IQ', dial:'+964' },
  { name:'Ireland',             code:'IE', dial:'+353' },
  { name:'Israel',              code:'IL', dial:'+972' },
  { name:'Italy',               code:'IT', dial:'+39'  },
  { name:'Jamaica',             code:'JM', dial:'+1-876'},
  { name:'Japan',               code:'JP', dial:'+81'  },
  { name:'Jordan',              code:'JO', dial:'+962' },
  { name:'Kenya',               code:'KE', dial:'+254' },
  { name:'Kuwait',              code:'KW', dial:'+965' },
  { name:'Lebanon',             code:'LB', dial:'+961' },
  { name:'Liberia',             code:'LR', dial:'+231' },
  { name:'Libya',               code:'LY', dial:'+218' },
  { name:'Malaysia',            code:'MY', dial:'+60'  },
  { name:'Mali',                code:'ML', dial:'+223' },
  { name:'Mexico',              code:'MX', dial:'+52'  },
  { name:'Morocco',             code:'MA', dial:'+212' },
  { name:'Mozambique',          code:'MZ', dial:'+258' },
  { name:'Netherlands',         code:'NL', dial:'+31'  },
  { name:'New Zealand',         code:'NZ', dial:'+64'  },
  { name:'Niger',               code:'NE', dial:'+227' },
  { name:'Nigeria',             code:'NG', dial:'+234' },
  { name:'Norway',              code:'NO', dial:'+47'  },
  { name:'Oman',                code:'OM', dial:'+968' },
  { name:'Pakistan',            code:'PK', dial:'+92'  },
  { name:'Philippines',         code:'PH', dial:'+63'  },
  { name:'Poland',              code:'PL', dial:'+48'  },
  { name:'Portugal',            code:'PT', dial:'+351' },
  { name:'Qatar',               code:'QA', dial:'+974' },
  { name:'Romania',             code:'RO', dial:'+40'  },
  { name:'Russia',              code:'RU', dial:'+7'   },
  { name:'Rwanda',              code:'RW', dial:'+250' },
  { name:'Saudi Arabia',        code:'SA', dial:'+966' },
  { name:'Senegal',             code:'SN', dial:'+221' },
  { name:'Sierra Leone',        code:'SL', dial:'+232' },
  { name:'Singapore',           code:'SG', dial:'+65'  },
  { name:'Somalia',             code:'SO', dial:'+252' },
  { name:'South Africa',        code:'ZA', dial:'+27'  },
  { name:'South Korea',         code:'KR', dial:'+82'  },
  { name:'South Sudan',         code:'SS', dial:'+211' },
  { name:'Spain',               code:'ES', dial:'+34'  },
  { name:'Sri Lanka',           code:'LK', dial:'+94'  },
  { name:'Sudan',               code:'SD', dial:'+249' },
  { name:'Sweden',              code:'SE', dial:'+46'  },
  { name:'Switzerland',         code:'CH', dial:'+41'  },
  { name:'Syria',               code:'SY', dial:'+963' },
  { name:'Tanzania',            code:'TZ', dial:'+255' },
  { name:'Thailand',            code:'TH', dial:'+66'  },
  { name:'Togo',                code:'TG', dial:'+228' },
  { name:'Tunisia',             code:'TN', dial:'+216' },
  { name:'Turkey',              code:'TR', dial:'+90'  },
  { name:'Uganda',              code:'UG', dial:'+256' },
  { name:'Ukraine',             code:'UA', dial:'+380' },
  { name:'United Arab Emirates',code:'AE', dial:'+971' },
  { name:'United Kingdom',      code:'GB', dial:'+44'  },
  { name:'United States',       code:'US', dial:'+1'   },
  { name:'Venezuela',           code:'VE', dial:'+58'  },
  { name:'Vietnam',             code:'VN', dial:'+84'  },
  { name:'Yemen',               code:'YE', dial:'+967' },
  { name:'Zambia',              code:'ZM', dial:'+260' },
  { name:'Zimbabwe',            code:'ZW', dial:'+263' }
];


/* ============================================================
   SESSION / AUTH STATE
   Stored in sessionStorage (clears when browser closes).
   In production replace with real JWT / server session.
   ============================================================ */

/* ── LOAD SESSION ────────────────────────────────────────────
   Restores the current user from sessionStorage on page load.
   ──────────────────────────────────────────────────────────── */
function loadSession() {
  try {
    var stored = sessionStorage.getItem('hp_user');
    return stored ? JSON.parse(stored) : null;
  } catch (e) { return null; }
}

/* ── SAVE SESSION ────────────────────────────────────────────
   Persists the current user object to sessionStorage.
   ──────────────────────────────────────────────────────────── */
function saveSession(user) {
  try {
    sessionStorage.setItem('hp_user', JSON.stringify(user));
  } catch (e) { /* ignore */ }
}

/* ── CLEAR SESSION ───────────────────────────────────────────
   Logs the user out by removing their session data.
   ──────────────────────────────────────────────────────────── */
function clearSession() {
  try { sessionStorage.removeItem('hp_user'); } catch (e) { /* ignore */ }
  _currentUser = null;
  updateAuthUI();
}

/* The current logged-in user object (null if guest) */
var _currentUser = loadSession();


/* ============================================================
   CUSTOMER REGISTRATION
   ============================================================ */

/* ── OPEN REGISTRATION MODAL ─────────────────────────────────
   Shows the registration/login overlay.
   tab: 'register' | 'login'
   ──────────────────────────────────────────────────────────── */
function openAuthModal(tab) {
  var overlay = document.getElementById('auth-modal');
  if (!overlay) return;
  overlay.classList.add('open');
  switchAuthTab(tab || 'register');
}

/* ── CLOSE AUTH MODAL ────────────────────────────────────────
   Hides the registration/login overlay.
   ──────────────────────────────────────────────────────────── */
function closeAuthModal() {
  var overlay = document.getElementById('auth-modal');
  if (overlay) overlay.classList.remove('open');
}

/* ── SWITCH AUTH TAB ─────────────────────────────────────────
   Switches between Register and Login tabs inside the modal.
   ──────────────────────────────────────────────────────────── */
function switchAuthTab(tab) {
  /* Update tab buttons */
  document.querySelectorAll('.auth-tab-btn').forEach(function (btn) {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  /* Show matching panel, hide others */
  document.querySelectorAll('.auth-panel').forEach(function (panel) {
    panel.style.display = panel.id === 'auth-panel-' + tab ? 'block' : 'none';
  });
}

/* ── POPULATE COUNTRY SELECT ─────────────────────────────────
   Fills the country dropdown with all COUNTRIES entries.
   Called on DOMContentLoaded.
   ──────────────────────────────────────────────────────────── */
function populateCountrySelect() {
  var select = document.getElementById('reg-country');
  if (!select) return;

  /* Default option */
  select.innerHTML = '<option value="">Select your country…</option>';

  COUNTRIES.forEach(function (c) {
    var opt = document.createElement('option');
    opt.value = c.code;
    opt.textContent = c.name + ' (' + c.dial + ')';
    /* Pre-select Ghana for Ghanaian customers */
    if (c.code === 'GH') opt.selected = true;
    select.appendChild(opt);
  });

  /* Update dial code prefix when country changes */
  select.addEventListener('change', function () {
    var chosen = COUNTRIES.find(function (c) { return c.code === select.value; });
    var prefix = document.getElementById('reg-dial-prefix');
    if (prefix && chosen) prefix.textContent = chosen.dial;
  });

  /* Set initial prefix */
  var initial = document.getElementById('reg-dial-prefix');
  if (initial) initial.textContent = '+233';
}

/* ── HANDLE REGISTER ─────────────────────────────────────────
   Validates the registration form and creates a new account.
   In production this should POST to your backend API.
   ──────────────────────────────────────────────────────────── */
function handleRegister(e) {
  e.preventDefault();

  /* Read all fields */
  var firstName   = _val('reg-firstname');
  var lastName    = _val('reg-lastname');
  var email       = _val('reg-email');
  var phone       = _val('reg-phone');
  var country     = _val('reg-country');
  var ghanaCard   = _val('reg-ghana-card');
  var password    = _val('reg-password');
  var passwordC   = _val('reg-password-confirm');
  var dob         = _val('reg-dob');

  /* ── Validation ── */
  if (!firstName || !lastName) {
    return _authError('Please enter your full name.');
  }
  if (!email || !email.includes('@') || !email.includes('.')) {
    return _authError('Please enter a valid email address.');
  }
  if (!phone || phone.replace(/\D/g, '').length < 7) {
    return _authError('Please enter a valid phone number.');
  }
  if (!country) {
    return _authError('Please select your country.');
  }
  if (password.length < 8) {
    return _authError('Password must be at least 8 characters.');
  }
  if (password !== passwordC) {
    return _authError('Passwords do not match.');
  }

  /* ── Generate customer ID ── */
  var customerId = 'HP-' + Date.now().toString(36).toUpperCase();

  /* ── Create user object ── */
  var user = {
    customerId:  customerId,
    firstName:  firstName,
    lastName:   lastName,
    email:      email,
    phone:      phone,
    country:    country,
    ghanaCard:  ghanaCard,
    dob:        dob,
    joinedAt:   new Date().toISOString(),
    orders:     []
  };

  /* ── Persist session ── */
  saveSession(user);
  _currentUser = user;

  /* ── Simulate welcome email ── */
  _simulateEmail({
    to:      email,
    subject: 'Welcome to HealthPlus — Your Customer ID is ' + customerId,
    body:    'Dear ' + firstName + ',\n\nYour HealthPlus account has been created.\n' +
             'Customer ID: ' + customerId + '\n\n' +
             'You can now shop for medicines and health products, and track your orders.'
  });

  closeAuthModal();
  updateAuthUI();
  showToast('Welcome, ' + firstName + '! Your account is ready ✓');
  setTimeout(function() { window.location.href = 'index.html'; }, 1200);

  return false;
}

/* ── HANDLE LOGIN ─────────────────────────────────────────────
   Validates login credentials (simulated — no real backend).
   ──────────────────────────────────────────────────────────── */
function handleLogin(e) {
  e.preventDefault();

  var email    = _val('login-email');
  var password = _val('login-password');

  if (!email || !password) {
    return _authError('Please enter your email and password.');
  }

  /* Simulate login: check if session has a matching account */
  var existing = loadSession();
  if (existing && existing.email === email) {
    _currentUser = existing;
    closeAuthModal();
    updateAuthUI();
    showToast('Welcome back, ' + existing.firstName + '! ✓');
    setTimeout(function() { window.location.href = 'index.html'; }, 1200);
  } else {
    /* Guest fallback — create minimal session */
    _currentUser = { email: email, firstName: 'Guest', customerId: 'GUEST', orders: [] };
    saveSession(_currentUser);
    closeAuthModal();
    updateAuthUI();
    showToast('Logged in as guest ✓');
    setTimeout(function() { window.location.href = 'index.html'; }, 1200);
  }
  return false;
}

/* ── HANDLE GUEST CHECKOUT ───────────────────────────────────
   Allows checkout without registration.
   ──────────────────────────────────────────────────────────── */
function guestCheckout() {
  _currentUser = { firstName: 'Guest', customerId: 'GUEST-' + Date.now(), orders: [], isGuest: true };
  saveSession(_currentUser);
  closeAuthModal();
  /* Proceed to checkout directly */
  var checkoutSection = document.getElementById('checkout-section');
  if (checkoutSection) {
    checkoutSection.style.display = 'block';
    checkoutSection.scrollIntoView({ behavior: 'smooth' });
  }
  showToast('Continuing as guest. Your order details will be sent to your email.');
}

/* ── UPDATE AUTH UI ──────────────────────────────────────────
   Updates nav and page elements to reflect login state.
   ──────────────────────────────────────────────────────────── */
function updateAuthUI() {
  var user = _currentUser;
  var navAuth    = document.getElementById('nav-auth-area');
  var navUser    = document.getElementById('nav-user-area');
  var userNameEl = document.getElementById('nav-user-name');

  if (user) {
    /* Show user name, hide login button */
    if (navAuth) navAuth.style.display = 'none';
    if (navUser) navUser.style.display = 'flex';
    if (userNameEl) userNameEl.textContent = user.firstName;
    /* When signed in the cart icon lives inside the profile area, so
       hide the standalone shop-page cart control (if present). */
    var navCartArea = document.getElementById('nav-cart-area');
    if (navCartArea) navCartArea.style.display = 'none';
  } else {
    /* Show login button, hide user info */
    if (navAuth) navAuth.style.display = 'flex';
    if (navUser) navUser.style.display = 'none';
    /* Signed out: show the standalone shop-page cart control again. */
    var navCartAreaOut = document.getElementById('nav-cart-area');
    if (navCartAreaOut) navCartAreaOut.style.display = 'flex';
  }
}

/* ── GET CURRENT USER ────────────────────────────────────────
   Returns the logged-in user object or null.
   ──────────────────────────────────────────────────────────── */
function getCurrentUser() { return _currentUser; }

/* ── AUTH ERROR ──────────────────────────────────────────────
   Displays a validation error message inside the auth modal.
   ──────────────────────────────────────────────────────────── */
function _authError(msg) {
  var el = document.getElementById('auth-error');
  if (el) {
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(function () { el.style.display = 'none'; }, 4000);
  } else {
    showToast(msg);
  }
  return false;
}

/* ── VALUE HELPER ────────────────────────────────────────────
   Safely reads a trimmed value from an input by id.
   ──────────────────────────────────────────────────────────── */
function _val(id) {
  var el = document.getElementById(id);
  return el ? el.value.trim() : '';
}


/* ============================================================
   SHOPPING CART (persistent across page navigation)
   ============================================================ */

/* ── LOAD CART ───────────────────────────────────────────────
   Restores cart from sessionStorage.
   ──────────────────────────────────────────────────────────── */
function loadCart() {
  try {
    var stored = sessionStorage.getItem('hp_cart');
    return stored ? JSON.parse(stored) : {};
  } catch (e) { return {}; }
}

/* ── SAVE CART ───────────────────────────────────────────────
   Persists cart to sessionStorage.
   ──────────────────────────────────────────────────────────── */
function saveCart(cart) {
  try { sessionStorage.setItem('hp_cart', JSON.stringify(cart)); } catch (e) { /* ignore */ }
}

/* ── UPDATE CART BADGE ───────────────────────────────────────
   Updates the item count badge on the nav cart icon.
   ──────────────────────────────────────────────────────────── */
function updateCartBadge(cart) {
  var badge = document.getElementById('cart-badge');
  if (!badge) return;
  var total = Object.values(cart).reduce(function (sum, item) {
    return sum + item.qty;
  }, 0);
  badge.textContent = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
}

/* Refresh the badge on EVERY page (some pages have more than one
   #cart-badge, e.g. the dedicated cart page). */
function updateCartBadgeAll() {
  var cart = loadCart();
  var total = Object.values(cart).reduce(function (sum, item) {
    return sum + item.qty;
  }, 0);
  document.querySelectorAll('#cart-badge').forEach(function (badge) {
    badge.textContent = total;
    badge.style.display = total > 0 ? 'flex' : 'none';
  });
}

/* Empty the shared cart (called after a successful checkout on cart.html). */
function clearCartShared() {
  saveCart({});
  updateCartBadgeAll();
}


/* ============================================================
   CHECKOUT FLOW WITH PROGRESS INDICATORS
   ============================================================ */

/* Current checkout step (1=Cart, 2=Details, 3=Payment, 4=Confirm) */
var _checkoutStep = 1;

/* ── GO TO CHECKOUT STEP ─────────────────────────────────────
   Navigates to a specific checkout step and updates indicators.
   ──────────────────────────────────────────────────────────── */
function goToCheckoutStep(step) {
  _checkoutStep = step;

  /* Update step indicators */
  document.querySelectorAll('.checkout-step-indicator').forEach(function (el) {
    var s = parseInt(el.dataset.step);
    el.classList.toggle('active',    s === step);
    el.classList.toggle('completed', s < step);
    el.classList.toggle('pending',   s > step);
  });

  /* Show matching panel, hide others */
  document.querySelectorAll('.checkout-panel').forEach(function (panel) {
    panel.style.display = parseInt(panel.dataset.step) === step ? 'block' : 'none';
  });

  /* Scroll checkout section into view */
  var checkoutEl = document.getElementById('checkout-section');
  if (checkoutEl) checkoutEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── NEXT CHECKOUT STEP ──────────────────────────────────────
   Advances to the next step, validating current step first.
   ──────────────────────────────────────────────────────────── */
function nextCheckoutStep() {
  if (_checkoutStep === 1) {
    /* Validate cart is not empty */
    var cart = loadCart();
    if (Object.keys(cart).length === 0) {
      showToast('Your cart is empty. Add items before checking out.');
      return;
    }
  }
  if (_checkoutStep === 2) {
    /* Validate delivery details */
    var name = _val('checkout-name');
    var email = _val('checkout-email');
    var addr  = _val('checkout-address');
    if (!name)  { showToast('Please enter your name.');             return; }
    if (!email) { showToast('Please enter your email address.');    return; }
    if (!addr)  { showToast('Please enter your delivery address.'); return; }
  }
  if (_checkoutStep < 4) goToCheckoutStep(_checkoutStep + 1);
}

/* ── PREVIOUS CHECKOUT STEP ──────────────────────────────────
   Goes back one step in the checkout flow.
   ──────────────────────────────────────────────────────────── */
function prevCheckoutStep() {
  if (_checkoutStep > 1) goToCheckoutStep(_checkoutStep - 1);
}


/* ============================================================
   ORDER MANAGEMENT
   ============================================================ */

/* ── PLACE ORDER ─────────────────────────────────────────────
   Creates an order record, stores it, sends email confirmation,
   and shows the confirmation screen.
   ──────────────────────────────────────────────────────────── */
function placeOrder(cart, deliveryDetails) {
  var orderId = 'HP-ORD-' + Date.now().toString(36).toUpperCase();
  var now     = new Date();

  var order = {
    orderId:    orderId,
    status:     'confirmed',        /* confirmed | preparing | dispatched | delivered | cancelled */
    placedAt:   now.toISOString(),
    estimatedDelivery: new Date(now.getTime() + 45 * 60000).toISOString(),
    items:      Object.entries(cart).map(function (e) {
      return { name: e[0], price: e[1].price, qty: e[1].qty };
    }),
    total:      Object.values(cart).reduce(function (s, i) { return s + i.price * i.qty; }, 0) + 10,
    delivery:   deliveryDetails,
    statusLink: window.location.origin + '/order-status.html?id=' + orderId
  };

  /* Store in sessionStorage under user's orders list */
  var allOrders = _loadAllOrders();
  allOrders.unshift(order);   /* newest first */
  _saveAllOrders(allOrders);

  /* Update user session with order ref */
  if (_currentUser) {
    _currentUser.orders = (_currentUser.orders || []);
    _currentUser.orders.unshift(orderId);
    saveSession(_currentUser);
  }

  /* Send email confirmation */
  _simulateEmail({
    to:      deliveryDetails.email,
    subject: 'HealthPlus Order Confirmed — ' + orderId,
    body:    'Dear ' + (deliveryDetails.name || 'Customer') + ',\n\n' +
             'Your order ' + orderId + ' has been confirmed.\n\n' +
             'Track your order: ' + order.statusLink + '\n\n' +
             'Items:\n' + order.items.map(function (i) {
               return '  - ' + i.name + ' x' + i.qty + ' — GHS ' + (i.price * i.qty);
             }).join('\n') + '\n\n' +
             'Total: GHS ' + order.total + '\n' +
             'Estimated delivery: ' + new Date(order.estimatedDelivery).toLocaleTimeString()
  });

  return order;
}

/* ── CANCEL ORDER ────────────────────────────────────────────
   Marks an order as cancelled if it hasn't been dispatched yet.
   orderId: string
   ──────────────────────────────────────────────────────────── */
function cancelOrder(orderId) {
  var allOrders = _loadAllOrders();
  var order = allOrders.find(function (o) { return o.orderId === orderId; });

  if (!order) {
    showToast('Order not found.');
    return false;
  }
  if (order.status === 'dispatched' || order.status === 'delivered') {
    showToast('This order cannot be cancelled — it is already ' + order.status + '.');
    return false;
  }
  if (order.status === 'cancelled') {
    showToast('This order is already cancelled.');
    return false;
  }

  order.status       = 'cancelled';
  order.cancelledAt  = new Date().toISOString();
  _saveAllOrders(allOrders);

  /* Send cancellation email */
  _simulateEmail({
    to:      (order.delivery || {}).email || '',
    subject: 'HealthPlus Order Cancelled — ' + orderId,
    body:    'Your order ' + orderId + ' has been cancelled as requested.\n' +
             'If you paid online, a refund will be processed within 3–5 business days.'
  });

  showToast('Order ' + orderId + ' has been cancelled.');
  renderOrderHistory();
  return true;
}

/* ── GET ORDER STATUS ────────────────────────────────────────
   Returns the order object for a given orderId.
   ──────────────────────────────────────────────────────────── */
function getOrder(orderId) {
  return (_loadAllOrders()).find(function (o) { return o.orderId === orderId; }) || null;
}

/* ── RENDER ORDER HISTORY ────────────────────────────────────
   Builds the order history UI in the user account area.
   ──────────────────────────────────────────────────────────── */
function renderOrderHistory() {
  var container = document.getElementById('order-history-list');
  if (!container) return;

  var orders = _loadAllOrders();
  if (orders.length === 0) {
    container.innerHTML = '<p class="empty-orders">No orders yet.</p>';
    return;
  }

  /* Status badge colours */
  var statusColors = {
    confirmed:  '#1E8A52',
    preparing:  '#B45309',
    dispatched: '#0B3D3A',
    delivered:  '#1E8A52',
    cancelled:  '#C8442F'
  };

  container.innerHTML = orders.map(function (order) {
    var color = statusColors[order.status] || '#6B8F87';
    var canCancel = (order.status === 'confirmed' || order.status === 'preparing');

    return '<div class="order-history-card">' +
      '<div class="oh-header">' +
        '<div>' +
          '<strong class="oh-id">' + order.orderId + '</strong>' +
          '<span class="oh-date">' + new Date(order.placedAt).toLocaleDateString() + '</span>' +
        '</div>' +
        '<span class="oh-status" style="color:' + color + ';background:' + color + '22">' +
          order.status.charAt(0).toUpperCase() + order.status.slice(1) +
        '</span>' +
      '</div>' +
      '<div class="oh-items">' +
        order.items.map(function (i) {
          return '<span>' + i.name + ' ×' + i.qty + '</span>';
        }).join('') +
      '</div>' +
      '<div class="oh-footer">' +
        '<strong>GHS ' + (order.total || 0).toFixed(0) + '</strong>' +
        '<div class="oh-actions">' +
          '<a href="order-status.html?id=' + order.orderId + '" class="btn-outline btn-sm">Track Order</a>' +
          (canCancel
            ? '<button class="btn-sm" style="background:var(--coral-soft);color:var(--coral-deep);border:none;border-radius:100px;padding:9px 18px;font-weight:700;cursor:pointer;" ' +
              'onclick="cancelOrder(\'' + order.orderId + '\')">Cancel</button>'
            : '') +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

/* Internal order storage helpers */
function _loadAllOrders() {
  try { return JSON.parse(sessionStorage.getItem('hp_orders') || '[]'); } catch (e) { return []; }
}
function _saveAllOrders(orders) {
  try { sessionStorage.setItem('hp_orders', JSON.stringify(orders)); } catch (e) { /* ignore */ }
}


/* ============================================================
   EMAIL CONFIRMATION (simulated)
   In production replace with a real email API call
   (SendGrid, Mailgun, etc.) from your backend.
   ============================================================ */

/* ── SIMULATE EMAIL ──────────────────────────────────────────
   Logs the email to console and shows a toast.
   In production: POST to /api/send-email with these params.
   ──────────────────────────────────────────────────────────── */
function _simulateEmail(opts) {
  console.info('[HealthPlus Email]', opts.subject);
  console.info('  To:', opts.to);
  console.info('  Body preview:', opts.body.substring(0, 120) + '…');

  /* In production, replace the console.info above with:
     fetch('/api/send-email', {
       method: 'POST',
       headers: {'Content-Type':'application/json'},
       body: JSON.stringify(opts)
     }); */
}


/* ============================================================
   ANALYTICS (lightweight — privacy-first)
   Tracks page views and key events without third-party scripts.
   In production POST events to your own analytics endpoint.
   ============================================================ */

/* ── TRACK EVENT ─────────────────────────────────────────────
   Records a user event.
   category: 'page_view' | 'add_to_cart' | 'checkout' | 'registration' etc.
   ──────────────────────────────────────────────────────────── */
function trackEvent(category, action, label) {
  var event = {
    ts:       new Date().toISOString(),
    category: category,
    action:   action,
    label:    label || '',
    page:     window.location.pathname,
    session:  sessionStorage.getItem('hp_session_id') || _initSessionId()
  };

  /* Accumulate events in sessionStorage */
  var events = _loadAnalytics();
  events.push(event);
  if (events.length > 500) events.shift(); /* cap at 500 */
  try { sessionStorage.setItem('hp_analytics', JSON.stringify(events)); } catch (e) { /* ignore */ }

  /* In production: POST to /api/analytics every N events */
  if (events.length % 10 === 0) {
    _flushAnalytics(events);
  }
}

function _loadAnalytics() {
  try { return JSON.parse(sessionStorage.getItem('hp_analytics') || '[]'); } catch (e) { return []; }
}

function _flushAnalytics(events) {
  /* In production, POST events to your server:
     fetch('/api/analytics', {
       method: 'POST',
       body: JSON.stringify(events)
     });
  */
  console.info('[HealthPlus Analytics] ' + events.length + ' events recorded this session.');
}

function _initSessionId() {
  var id = 'sess-' + Math.random().toString(36).substring(2);
  try { sessionStorage.setItem('hp_session_id', id); } catch (e) { /* ignore */ }
  return id;
}

/* ── TRACK PAGE VIEW ─────────────────────────────────────────
   Called automatically on each page load.
   ──────────────────────────────────────────────────────────── */
function trackPageView() {
  trackEvent('page_view', window.location.pathname, document.title);
}


/* ============================================================
   ERROR HANDLING — Global error boundary
   Catches unhandled JS errors and displays a user-friendly
   message instead of a blank/broken page.
   ============================================================ */

/* ── GLOBAL ERROR HANDLER ────────────────────────────────────
   Intercepts uncaught exceptions across the whole site.
   ──────────────────────────────────────────────────────────── */
window.addEventListener('error', function (e) {
  console.error('[HealthPlus Error]', e.message, 'at', e.filename, ':', e.lineno);

  /* Show a non-intrusive toast rather than breaking the page */
  if (typeof showToast === 'function') {
    showToast('Something went wrong. Please refresh or contact support.');
  }

  /* Log to security/error log */
  if (window.HP_Security) {
    /* reuse security log for error tracking */
  }
});

/* ── UNHANDLED PROMISE REJECTION ────────────────────────────
   Catches errors from fetch() and other async code.
   ──────────────────────────────────────────────────────────── */
window.addEventListener('unhandledrejection', function (e) {
  console.error('[HealthPlus Async Error]', e.reason);
  /* Suppress noisy browser console warnings for network errors */
  e.preventDefault();
});


/* ============================================================
   PROMOTIONS & SALE ANNOUNCEMENTS
   ============================================================ */

/* ── SHOW PROMO BANNER ───────────────────────────────────────
   Injects a dismissible top banner for active promotions.
   promos: array of { text, expiry (ISO date string), code }
   ──────────────────────────────────────────────────────────── */
var ACTIVE_PROMOS = [
  {
    text:   '🎉 New customer offer: 10% off your first order — use code FIRST10',
    expiry: '2026-12-31',
    code:   'FIRST10'
  },
  {
    text:   '💊 Free delivery on pharmacy orders over GHS 100 this week!',
    expiry: '2026-12-31',
    code:   'FREEDEL'
  }
];

function showPromoBanner() {
  var banner = document.getElementById('promo-announcement-bar');
  if (!banner) return;

  /* Filter to promos not yet expired */
  var now   = new Date();
  var valid = ACTIVE_PROMOS.filter(function (p) {
    return new Date(p.expiry) > now;
  });

  if (valid.length === 0) { banner.style.display = 'none'; return; }

  /* Rotate through promos every 5 seconds */
  var idx = 0;
  var textEl = banner.querySelector('.promo-bar-text');
  if (textEl) textEl.textContent = valid[0].text;
  banner.style.display = 'block';

  /* Give the promo strip its own space at the very top of the header.
     The CSS uses this class to push the fixed nav + content down by 40px. */
  document.body.classList.add('has-promo-bar');

  if (valid.length > 1) {
    setInterval(function () {
      idx = (idx + 1) % valid.length;
      if (textEl) textEl.textContent = valid[idx].text;
    }, 5000);
  }
}


/* ============================================================
   CUSTOMER REVIEWS & TESTIMONIALS
   ============================================================ */

/* ── SUBMIT REVIEW ───────────────────────────────────────────
   Saves a customer review and re-renders the review list.
   ──────────────────────────────────────────────────────────── */
function submitReview(e) {
  e.preventDefault();

  var rating  = document.querySelector('input[name="review-rating"]:checked');
  var comment = _val('review-comment');
  var name    = _val('review-name') || 'Anonymous Customer';

  if (!rating)  { showToast('Please select a star rating.'); return false; }
  if (!comment) { showToast('Please write a short review.'); return false; }

  var review = {
    id:        Date.now(),
    name:      name,
    rating:    parseInt(rating.value),
    comment:   comment,
    date:      new Date().toLocaleDateString(),
    verified:  !!_currentUser && !_currentUser.isGuest
  };

  /* Store review */
  var reviews = _loadReviews();
  reviews.unshift(review);
  if (reviews.length > 100) reviews.pop();
  try { sessionStorage.setItem('hp_reviews', JSON.stringify(reviews)); } catch (e) { /* ignore */ }

  /* Track event */
  trackEvent('engagement', 'review_submitted', rating.value + '_stars');

  showToast('Thank you for your review! ⭐');
  renderReviews();

  /* Reset form */
  var form = document.getElementById('review-form');
  if (form) form.reset();
  return false;
}

/* ── RENDER REVIEWS ──────────────────────────────────────────
   Displays stored reviews in the reviews container.
   ──────────────────────────────────────────────────────────── */
function renderReviews() {
  var container = document.getElementById('reviews-list');
  if (!container) return;

  var reviews = _loadReviews();
  if (reviews.length === 0) {
    container.innerHTML = '<p class="no-reviews">Be the first to leave a review!</p>';
    return;
  }

  container.innerHTML = reviews.slice(0, 6).map(function (r) {
    var stars = '⭐'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
    return '<div class="review-card">' +
      '<div class="review-header">' +
        '<span class="review-stars">' + stars + '</span>' +
        (r.verified ? '<span class="verified-badge">✓ Verified Buyer</span>' : '') +
      '</div>' +
      '<p class="review-text">' + _escHtml(r.comment) + '</p>' +
      '<div class="review-meta">' +
        '<strong>' + _escHtml(r.name) + '</strong>' +
        '<span>' + r.date + '</span>' +
      '</div>' +
    '</div>';
  }).join('');
}

function _loadReviews() {
  /* Pre-seed with sample reviews on first load */
  var stored;
  try { stored = JSON.parse(sessionStorage.getItem('hp_reviews') || 'null'); } catch (e) { stored = null; }

  if (!stored) {
    stored = [
      { id:1, name:'Abena K.',     rating:5, comment:'Fast delivery and great service! Medicine arrived in 30 minutes.',              date:'June 2026',  verified:true  },
      { id:2, name:'Kofi A.',      rating:5, comment:'Uploading my prescription was so easy, and the pharmacist verified it within the hour.',   date:'May 2026',   verified:true  },
      { id:3, name:'Ama Serwah',   rating:4, comment:'Really convenient. Ordered from abroad and my family got the meds same day.', date:'May 2026',   verified:false },
      { id:4, name:'Emmanuel T.',  rating:5, comment:'Great selection of vitamins and the checkout was quick with Mobile Money.',   date:'April 2026', verified:true  }
    ];
    try { sessionStorage.setItem('hp_reviews', JSON.stringify(stored)); } catch (e) { /* ignore */ }
  }
  return stored;
}

function _escHtml(str) {
  var d = document.createElement('div');
  d.appendChild(document.createTextNode(String(str || '')));
  return d.innerHTML;
}


/* ============================================================
   BROWSER COMPATIBILITY
   Polyfills and feature detection for older browsers
   including Internet Explorer 11 and legacy Edge.
   ============================================================ */

/* ── POLYFILL: Array.prototype.find ─────────────────────────
   IE11 does not support Array.find().
   ──────────────────────────────────────────────────────────── */
if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    for (var i = 0; i < this.length; i++) {
      if (predicate(this[i], i, this)) return this[i];
    }
    return undefined;
  };
}

/* ── POLYFILL: Array.prototype.findIndex ────────────────────
   IE11 does not support Array.findIndex().
   ──────────────────────────────────────────────────────────── */
if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function (predicate) {
    for (var i = 0; i < this.length; i++) {
      if (predicate(this[i], i, this)) return i;
    }
    return -1;
  };
}

/* ── POLYFILL: Array.from ────────────────────────────────────
   IE11 does not support Array.from().
   ──────────────────────────────────────────────────────────── */
if (!Array.from) {
  Array.from = function (iterable) {
    return Array.prototype.slice.call(iterable);
  };
}

/* ── POLYFILL: Object.assign ─────────────────────────────────
   IE11 does not support Object.assign().
   ──────────────────────────────────────────────────────────── */
if (!Object.assign) {
  Object.assign = function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var src = arguments[i];
      if (src) {
        for (var key in src) {
          if (Object.prototype.hasOwnProperty.call(src, key)) {
            target[key] = src[key];
          }
        }
      }
    }
    return target;
  };
}

/* ── POLYFILL: Element.closest ───────────────────────────────
   IE11 does not support Element.closest().
   ──────────────────────────────────────────────────────────── */
if (!Element.prototype.closest) {
  Element.prototype.closest = function (selector) {
    var el = this;
    while (el && el.nodeType === 1) {
      if (el.matches ? el.matches(selector) : el.msMatchesSelector(selector)) return el;
      el = el.parentElement || el.parentNode;
    }
    return null;
  };
}

/* ── POLYFILL: fetch ─────────────────────────────────────────
   IE11 does not support fetch(). Load a polyfill from CDN
   only if needed. Detected via typeof check.
   The HTML pages include this conditional CDN load:
   <!--[if IE]>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/fetch/3.6.2/fetch.min.js"></script>
   <![endif]-->
   ──────────────────────────────────────────────────────────── */


/* ============================================================
   INITIALISATION
   ============================================================ */

/* ── SHOW ACCOUNT MODAL ──────────────────────────────────────
   Displays the user's account details in a modal overlay.
   Called when the user chip in the nav is clicked.
   ──────────────────────────────────────────────────────────── */
function showAccountModal() {
  var user = _currentUser;
  if (!user) { openAuthModal('login'); return; }

  /* Remove any existing modal */
  var old = document.getElementById('account-detail-modal');
  if (old) old.remove();

  /* Build recent orders HTML */
  var orders = _loadAllOrders().slice(0, 5);
  var ordersHtml = orders.length === 0
    ? '<p style="color:var(--sage);font-size:13.5px;padding:14px 0;">No orders yet.</p>'
    : orders.map(function(o) {
        var canCancel = (o.status === 'confirmed' || o.status === 'preparing');
        var statusColors = {confirmed:'#1E8A52',preparing:'#B45309',dispatched:'#0B3D3A',delivered:'#1E8A52',cancelled:'#C8442F'};
        var color = statusColors[o.status] || '#6B8F87';
        return '<div class="order-history-card" style="margin-bottom:10px;">' +
          '<div class="oh-header">' +
            '<div><strong class="oh-id">' + o.orderId + '</strong>' +
            '<span class="oh-date"> · ' + new Date(o.placedAt).toLocaleDateString() + '</span></div>' +
            '<span class="oh-status" style="color:' + color + ';background:' + color + '22;">' + o.status + '</span>' +
          '</div>' +
          '<div class="oh-items">' + (o.items||[]).map(function(i){ return '<span>' + i.name + ' ×' + i.qty + '</span>'; }).join('') + '</div>' +
          '<div class="oh-footer"><strong>GHS ' + (o.total||0) + '</strong>' +
            '<div class="oh-actions">' +
              '<a href="order-status.html?id=' + o.orderId + '" class="btn-outline btn-sm">Track</a>' +
              (canCancel ? '<button class="btn-sm" style="background:var(--coral-soft);color:var(--coral-deep);border:none;border-radius:100px;padding:9px 18px;font-weight:700;cursor:pointer;" onclick="cancelOrder(\'' + o.orderId + '\');showAccountModal();">Cancel</button>' : '') +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('');

  var html =
    '<div id="account-detail-modal" style="position:fixed;inset:0;background:rgba(10,20,18,0.75);backdrop-filter:blur(8px);z-index:3000;display:flex;align-items:center;justify-content:center;padding:20px;" onclick="if(event.target===this)this.remove()">' +
      '<div style="background:#fff;border-radius:20px;width:100%;max-width:540px;max-height:88vh;overflow-y:auto;box-shadow:0 30px 80px rgba(0,0,0,.35);animation:slideUp .3s ease;">' +
        '<div style="background:var(--teal);padding:28px 32px;border-radius:20px 20px 0 0;display:flex;justify-content:space-between;align-items:center;">' +
          '<div>' +
            '<div style="color:rgba(255,255,255,.6);font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">Customer Account</div>' +
            '<div style="color:#fff;font-size:22px;font-weight:700;font-family:var(--font-display);">' + (user.firstName||'') + ' ' + (user.lastName||'') + '</div>' +
            '<div style="color:rgba(255,255,255,.6);font-size:13px;margin-top:2px;">Customer ID: <strong style="color:var(--gold);font-family:monospace;">' + (user.customerId||'—') + '</strong></div>' +
          '</div>' +
          '<button onclick="document.getElementById(\'account-detail-modal\').remove()" style="background:rgba(255,255,255,.15);border:none;color:#fff;width:36px;height:36px;border-radius:50%;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;">×</button>' +
        '</div>' +
        '<div style="padding:28px 32px;">' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:28px;">' +
            '<div style="background:var(--mint);border-radius:12px;padding:16px;">' +
              '<div style="font-size:11px;font-weight:700;color:var(--sage);letter-spacing:.8px;text-transform:uppercase;margin-bottom:4px;">Email</div>' +
              '<div style="font-size:14px;color:var(--ink);font-weight:600;">' + (user.email||'—') + '</div>' +
            '</div>' +
            '<div style="background:var(--mint);border-radius:12px;padding:16px;">' +
              '<div style="font-size:11px;font-weight:700;color:var(--sage);letter-spacing:.8px;text-transform:uppercase;margin-bottom:4px;">Phone</div>' +
              '<div style="font-size:14px;color:var(--ink);font-weight:600;">' + (user.phone||'—') + '</div>' +
            '</div>' +
            '<div style="background:var(--mint);border-radius:12px;padding:16px;">' +
              '<div style="font-size:11px;font-weight:700;color:var(--sage);letter-spacing:.8px;text-transform:uppercase;margin-bottom:4px;">Country</div>' +
              '<div style="font-size:14px;color:var(--ink);font-weight:600;">' + (user.country||'—') + '</div>' +
            '</div>' +
            '<div style="background:var(--mint);border-radius:12px;padding:16px;">' +
              '<div style="font-size:11px;font-weight:700;color:var(--sage);letter-spacing:.8px;text-transform:uppercase;margin-bottom:4px;">Member Since</div>' +
              '<div style="font-size:14px;color:var(--ink);font-weight:600;">' + (user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : '—') + '</div>' +
            '</div>' +
          '</div>' +
          '<div style="margin-bottom:20px;">' +
            '<div style="font-size:14px;font-weight:700;color:var(--teal);margin-bottom:14px;">Recent Orders</div>' +
            ordersHtml +
          '</div>' +
          '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
            '<button onclick="clearSession();document.getElementById(\'account-detail-modal\').remove();showToast(\'Signed out successfully.\');" style="background:var(--coral-soft);color:var(--coral-deep);border:none;border-radius:100px;padding:11px 22px;font-weight:700;cursor:pointer;font-family:var(--font-body);font-size:13.5px;">Sign Out</button>' +
            '<a href="order-online.html" style="background:var(--teal);color:#fff;border-radius:100px;padding:11px 22px;font-weight:700;font-size:13.5px;display:inline-flex;align-items:center;">Order Medicine</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  document.body.insertAdjacentHTML('beforeend', html);
}

document.addEventListener('DOMContentLoaded', function () {
  /* Restore auth state */
  _currentUser = loadSession();
  updateAuthUI();

  /* Populate country dropdown if present */
  populateCountrySelect();

  /* Show promo announcement banner */
  showPromoBanner();

  /* Track page view */
  trackPageView();

  /* Render reviews if on a page that has the reviews section */
  renderReviews();
  renderOrderHistory();

  /* Auth modal: close on overlay click */
  var authOverlay = document.getElementById('auth-modal');
  if (authOverlay) {
    authOverlay.addEventListener('click', function (e) {
      if (e.target === authOverlay) closeAuthModal();
    });
  }

  /* Wire up auth tab buttons */
  document.querySelectorAll('.auth-tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      switchAuthTab(btn.dataset.tab);
    });
  });

  /* Wire up registration form */
  var regForm = document.getElementById('registration-form');
  if (regForm) regForm.addEventListener('submit', handleRegister);

  /* Wire up login form */
  var loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  /* Wire up review form */
  var reviewForm = document.getElementById('review-form');
  if (reviewForm) reviewForm.addEventListener('submit', submitReview);

  /* Update cart badge from storage (all badges on the page) */
  updateCartBadgeAll();

  /* A/B testing: assign variant if not already set */
  if (!sessionStorage.getItem('hp_ab_variant')) {
    var variant = Math.random() < 0.5 ? 'A' : 'B';
    sessionStorage.setItem('hp_ab_variant', variant);
    trackEvent('ab_test', 'variant_assigned', variant);
    /* Apply variant-specific class to body for CSS targeting */
    document.body.classList.add('ab-variant-' + variant);
  } else {
    document.body.classList.add('ab-variant-' + sessionStorage.getItem('hp_ab_variant'));
  }
});
