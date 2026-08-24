/* ============================================================
   HEALTHPLUS PHARMACY
   File: js/wire.js
   Purpose: Phase 2 — externalise every inline event handler
            that previously lived in the HTML (onclick/oninput/
            onsubmit/onkeydown) into proper addEventListener
            wiring. This keeps all behaviour in external JS
            files (no JS inside HTML) while preserving every
            function that already exists in core.js / auth.js /
            pharmacy.js / payment.js / ai-assistant.js.

   Strategy:
   - Runs on DOMContentLoaded (defer already guarantees DOM is
     parsed before this file executes).
   - Each binding is wrapped in an `if (el)` null-guard so
     pages that do not contain a given element simply skip it
     (no errors, no duplicate listeners, multi-page safe).
   - Global helpers that live in other files are referenced
     through `window.` so they resolve regardless of script
     include order.
   - We only bind elements that had inline handlers; existing
     addEventListener wiring inside the other JS files is left
     untouched to avoid double-binding.

   Loaded: every page, AFTER the feature scripts (see HTML
   <head>/end-of-body script blocks).
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------------------------
     SAFETY: resolve a global function from window, falling
     back gracefully if it was not defined by another file.
     ---------------------------------------------------------- */
  function fn(name) {
    return function () {
      if (typeof window[name] === 'function') {
        return window[name].apply(null, arguments);
      }
      console.warn('[wire.js] handler "' + name + '" is not defined.');
    };
  }

  /* ----------------------------------------------------------
     1. GLOBAL NAV / CHROME  (present on every page)
     ---------------------------------------------------------- */
  var userChip = document.querySelector('.nav-user-chip');
  if (userChip) userChip.addEventListener('click', fn('showAccountModal'));

  var cartBtn = document.querySelector('.nav-cart-btn');
  if (cartBtn) {
    /* On the shop page a cart dropdown exists — its cart buttons (both the
       logged-out #nav-cart-toggle and the logged-in icon beside the profile
       chip) open that popup. Everywhere else the cart icon navigates to the
       dedicated Cart page. The shop-page binding is handled just below. */
    if (!document.getElementById('cart-dropdown')) {
      cartBtn.addEventListener('click', function () { window.location = 'cart.html'; });
    }
  }

  var hamburger = document.getElementById('hamburger');
  if (hamburger) hamburger.addEventListener('click', fn('toggleNav'));

  /* ----------------------------------------------------------
     2. AI HEALTH ASSISTANT  (floating button + panel)
     ---------------------------------------------------------- */
  var aiFab = document.getElementById('ai-fab-btn');
  if (aiFab) aiFab.addEventListener('click', fn('toggleAIChat'));

  var aiClose = document.querySelector('.ai-chat-close');
  if (aiClose) aiClose.addEventListener('click', fn('toggleAIChat'));

  var aiSend = document.querySelector('.ai-send-btn');
  if (aiSend) aiSend.addEventListener('click', fn('sendAIMessage'));

  /* ----------------------------------------------------------
     3. REGISTER PAGE extras
     ---------------------------------------------------------- */
  var guestLink = document.querySelector('.guest-link a');
  if (guestLink) guestLink.addEventListener('click', fn('guestCheckout'));

  var regCreate = document.querySelector('.register-switch a');
  if (regCreate) {
    regCreate.addEventListener('click', function () {
      fn('switchAuthTab')('register');
      var tab = document.querySelector('[data-tab=register]');
      if (tab) tab.click();
    });
  }

  /* ----------------------------------------------------------
     3b. BLOG newsletter subscribe (blog.html)
     ---------------------------------------------------------- */
  var nlBtn = document.getElementById('nl-subscribe');
  if (nlBtn) nlBtn.addEventListener('click', fn('subscribeNewsletter'));

  /* ----------------------------------------------------------
     4. BLOG category filter  (blog.html — uses data-cat)
     ---------------------------------------------------------- */
  document.querySelectorAll('.cat-chip[data-cat]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      fn('filterBlog')(chip.dataset.cat, chip);
    });
  });

  /* ----------------------------------------------------------
     4b. ORDER-ONLINE quick category chips  (uses data-search-cat)
     ---------------------------------------------------------- */
  document.querySelectorAll('.cat-chip[data-search-cat]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      fn('quickCategorySearch')(chip.dataset.searchCat);
    });
  });

  /* ----------------------------------------------------------
     4c. HOMEPAGE review form (index.html)
     ---------------------------------------------------------- */
  var reviewForm = document.getElementById('review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', function (e) {
      if (typeof window.submitReview === 'function') return window.submitReview(e);
      return true;
    });
  }

  /* ----------------------------------------------------------
     4d. IMAGE fallbacks  (replaces onerror="this.style.display='none'")
         Bound via capture so it still fires for broken images
         that error before this runs.
     ---------------------------------------------------------- */
  document.querySelectorAll('img[onerror]').forEach(function (img) {
    img.removeAttribute('onerror');
  });
  document.addEventListener('error', function (e) {
    var t = e.target;
    if (t && t.tagName === 'IMG') t.style.display = 'none';
  }, true); // capture: image error events do not bubble

  /* ----------------------------------------------------------
     5. ORDER-STATUS page
     ---------------------------------------------------------- */
  var lookupBtn = document.querySelector('#order-lookup-section .btn-primary');
  if (lookupBtn) lookupBtn.addEventListener('click', fn('lookupOrder'));

  var cancelBtn = document.getElementById('cancel-order-btn');
  if (cancelBtn) cancelBtn.addEventListener('click', fn('handleCancelOrder'));

  /* ----------------------------------------------------------
     6. ORDER-ONLINE page — cart dropdown
     ---------------------------------------------------------- */
  /* Both cart buttons on the shop page (logged-out #nav-cart-toggle and the
     logged-in icon beside the profile chip) open the mini-cart popup. */
  document.querySelectorAll('.nav-cart-btn').forEach(function (cartBtnEl) {
    cartBtnEl.addEventListener('click', function (e) { fn('toggleCartDropdown')(e, undefined); });
  });
  var cartClose = document.querySelector('.cart-dropdown-close');
  if (cartClose) {
    cartClose.addEventListener('click', function (e) { fn('toggleCartDropdown')(e, false); });
  }

  /* ----------------------------------------------------------
     7. ORDER-ONLINE page — quick category chips
        (handled in section 4b via .cat-chip[data-search-cat])
     ---------------------------------------------------------- */

  /* ----------------------------------------------------------
     8. ORDER-ONLINE page — frequently-ordered cards
     ---------------------------------------------------------- */
  document.querySelectorAll('.freq-card').forEach(function (card) {
    var minus = card.querySelector('.q-btn:first-of-type');
    var plus  = card.querySelector('.q-btn:last-of-type');
    if (minus) minus.addEventListener('click', function () { fn('changeFreqQty')(minus, -1); });
    if (plus)  plus.addEventListener('click', function () { fn('changeFreqQty')(plus, 1); });
    var addBtn = card.querySelector('.btn-primary');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        var nameEl = card.querySelector('h4');
        var priceEl = card.querySelector('.fc-price');
        var name = nameEl ? nameEl.textContent.trim() : '';
        var price = priceEl ? parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')) : 0;
        fn('addFreqToCart')(name, price, addBtn);
      });
    }
  });

  /* ----------------------------------------------------------
     9. ORDER-ONLINE page — delivery modal + form
     ---------------------------------------------------------- */
  var delClose = document.querySelector('#delivery-section .modal-close');
  if (delClose) delClose.addEventListener('click', fn('closeDeliveryModal'));

  var deliveryForm = document.getElementById('delivery-form');
  if (deliveryForm) {
    deliveryForm.addEventListener('submit', function (e) {
      if (typeof window.handleOrderSubmit === 'function') return window.handleOrderSubmit(e);
      return true;
    });
  }

  var locBtn = document.querySelector('.location-btn');
  if (locBtn) {
    locBtn.addEventListener('click', function () {
      var target = document.getElementById('delivery-location');
      fn('useMyLocation')(target ? target.id : 'delivery-location');
    });
  }

  /* ----------------------------------------------------------
     10. ORDER-ONLINE page — payment modal
     ---------------------------------------------------------- */
  var payClose = document.querySelector('#pay-section .modal-close, .pay-modal .modal-close');
  if (payClose) payClose.addEventListener('click', fn('closePayModal'));

  document.querySelectorAll('.pay-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      fn('switchPayTab')(tab.dataset.tab || tab.textContent.trim().toLowerCase(), tab);
    });
  });

  document.querySelectorAll('.net-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var label = btn.querySelector('span:last-child');
      fn('selectNetwork')(btn, label ? label.textContent.trim() : btn.textContent.trim());
    });
  });

  document.querySelectorAll('.pay-confirm-momo').forEach(function (b) {
    b.addEventListener('click', function () { fn('confirmPayment')('momo'); });
  });
  document.querySelectorAll('.pay-confirm-card').forEach(function (b) {
    b.addEventListener('click', function () { fn('confirmPayment')('card'); });
  });

  var cardNum = document.getElementById('card-num');
  if (cardNum) cardNum.addEventListener('input', function () { fn('fmtCard')(cardNum); });
  var cardExp = document.getElementById('card-exp');
  if (cardExp) cardExp.addEventListener('input', function () { fn('fmtExp')(cardExp); });

  /* ----------------------------------------------------------
     11. ORDER-ONLINE page — rider chat
     ---------------------------------------------------------- */
  var riderMsgBtn = document.querySelector('.courier-btn[title="Message rider"]');
  if (riderMsgBtn) riderMsgBtn.addEventListener('click', fn('openRiderChat'));

  var chatClose = document.querySelector('.chat-close');
  if (chatClose) chatClose.addEventListener('click', fn('closeRiderChat'));

  var chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') fn('sendChatMsg')();
    });
  }
  var chatSend = document.querySelector('.chat-send-btn');
  if (chatSend) chatSend.addEventListener('click', fn('sendChatMsg'));

    /* ----------------------------------------------------------
      11b. DEDICATED CART PAGE actions
      ---------------------------------------------------------- */
    var cartPay = document.getElementById('pay-order-btn');
    if (cartPay) cartPay.addEventListener('click', fn('startCartCheckout'));
    var cartClear = document.getElementById('clear-cart-btn');
    if (cartClear) cartClear.addEventListener('click', fn('clearCartNow'));

  /* ----------------------------------------------------------
     12. REGISTER inline DOB max-date script moved here
     ---------------------------------------------------------- */
  var dob = document.getElementById('reg-dob');
  if (dob) {
    var today = new Date().toISOString().split('T')[0];
    dob.max = today;
    dob.min = '1930-01-01';
  }

  /* ----------------------------------------------------------
     13. ORDER-STATUS inline logic script moved here
     ---------------------------------------------------------- */
  if (document.getElementById('order-status-display') ||
      document.getElementById('lookup-id')) {
    loadOrderStatusLogic();
  }

  /* ----------------------------------------------------------
     ORDER STATUS helper functions (rebuilt externally — were
     previously inline in order-status.html). They drive the
     #order-status-display, timeline, map and cancel button.
     ---------------------------------------------------------- */
  window.lookupOrder = function () {
    var input = document.getElementById('lookup-id');
    var id = input ? input.value.trim() : '';
    if (!id) {
      if (typeof window.toast === 'function') window.toast('Please enter your Order ID.');
      else if (input) input.focus();
      return;
    }
    // Simulated lookup — in production this would call an API.
    var order = {
      id: id,
      placedAt: new Date().toLocaleString(),
      status: 'dispatched',
      eta: 18,
      stage: 'On the way',
      items: [
        { name: 'Paracetamol 500mg', qty: 2, price: 15 },
        { name: 'Amoxicillin 500mg', qty: 1, price: 38 }
      ],
      total: 68
    };
    renderOrderStatus(order);
  };

  window.handleCancelOrder = function () {
    var display = document.getElementById('order-status-display');
    var area = document.getElementById('cancel-order-area');
    if (display) display.style.display = 'none';
    if (area) area.style.display = 'none';
    var lookup = document.getElementById('order-lookup-section');
    if (lookup) lookup.style.display = 'block';
    if (typeof window.toast === 'function') window.toast('Your order has been cancelled.');
  };

  function renderOrderStatus(order) {
    var lookup = document.getElementById('order-lookup-section');
    var display = document.getElementById('order-status-display');
    if (lookup) lookup.style.display = 'none';
    if (display) display.style.display = 'block';

    var setId = document.getElementById('status-order-id');
    if (setId) setId.textContent = order.id;
    var setPlaced = document.getElementById('status-placed-at');
    if (setPlaced) setPlaced.textContent = order.placedAt;

    // Timeline
    var timeline = document.getElementById('order-timeline');
    if (timeline && window.TIMELINE_STEPS) {
      var stepIdx = window.STATUS_STEP[order.status];
      timeline.innerHTML = '';
      window.TIMELINE_STEPS.forEach(function (step, i) {
        var done = stepIdx >= 0 && i <= stepIdx;
        var active = i === stepIdx;
        var row = document.createElement('div');
        row.className = 'timeline-step' + (done ? ' done' : '') + (active ? ' active' : '');
        row.innerHTML =
          '<div class="tl-dot">' + (done ? '✓' : step.icon) + '</div>' +
          '<div class="tl-content"><h4>' + step.label + '</h4><p>' + step.desc + '</p></div>';
        timeline.appendChild(row);
      });
    }

    // Items + total
    var list = document.getElementById('status-items-list');
    if (list) {
      list.innerHTML = '';
      (order.items || []).forEach(function (it) {
        var line = document.createElement('div');
        line.style.cssText = 'display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--mint-mid);font-size:14px;';
        line.innerHTML = '<span>' + it.name + ' × ' + it.qty + '</span><span>GH₵' + (it.price * it.qty) + '</span>';
        list.appendChild(line);
      });
    }
    var total = document.getElementById('status-total');
    if (total) total.textContent = 'GH₵' + order.total;

    // Tracking bar
    var etaText = document.getElementById('status-eta-text');
    if (etaText) etaText.textContent = (order.eta != null ? '~' + order.eta + ' min' : '—');
    var stageText = document.getElementById('status-stage-text');
    if (stageText) stageText.textContent = order.stage || 'Loading status…';
    var fill = document.getElementById('status-progress-fill');
    if (fill) {
      var pct = window.STATUS_STEP[order.status];
      fill.style.width = (pct != null && pct >= 0 ? Math.round((pct / 3) * 100) : 0) + '%';
    }

    // Map (Leaflet) if present
    if (typeof window.L !== 'undefined' && window.RIDER_PATH) {
      var mapEl = document.getElementById('status-map');
      if (mapEl && !mapEl._leaflet_id) {
        var map = window.L.map(mapEl).setView(window.RIDER_PATH[0], 15);
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap'
        }).addTo(map);
        window.L.marker(window.RIDER_PATH[window.RIDER_PATH.length - 1]).addTo(map)
          .bindPopup('Destination');
      }
    }

    // Hide cancel once dispatched
    var area = document.getElementById('cancel-order-area');
    if (area) area.style.display = (order.status === 'dispatched' || order.status === 'delivered') ? 'none' : 'block';
  }

  function loadOrderStatusLogic() {
    /* Rider path through Accra for live map simulation */
    window.RIDER_PATH = [
      [5.621,-0.195],[5.626,-0.190],[5.630,-0.185],[5.634,-0.180],
      [5.636,-0.178],[5.638,-0.175],[5.639,-0.172],[5.640,-0.170]
    ];
    window.STAGES = ['Order confirmed','Pharmacist preparing','Rider collected','On the way','Nearby','Almost there','Arrived'];
    window.ETAS   = [22,18,14,10,7,3,0];

    /* Timeline steps definition */
    window.TIMELINE_STEPS = [
      { key:'confirmed',  icon:'✓', label:'Order Confirmed',      desc:'Your order was received and confirmed.' },
      { key:'preparing',  icon:'💊', label:'Preparing Your Order', desc:'Our pharmacist is picking your items.' },
      { key:'dispatched', icon:'🛵', label:'On the Way',           desc:'Your rider has your package and is heading to you.' },
      { key:'delivered',  icon:'🏠', label:'Delivered',            desc:'Your order has been delivered successfully.' }
    ];

    /* Status to step index mapping */
    window.STATUS_STEP = { confirmed:0, preparing:1, dispatched:2, delivered:3, cancelled:-1 };

    /* Auto-lookup if ?id= is in the URL */
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    if (id) {
      var lookupInput = document.getElementById('lookup-id');
      if (lookupInput) lookupInput.value = id;
      if (typeof window.lookupOrder === 'function') window.lookupOrder();
    }
  }

}); /* end DOMContentLoaded */
