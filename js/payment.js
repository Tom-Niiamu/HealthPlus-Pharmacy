/* ============================================================
   HEALTHPLUS PHARMACY
   File: js/payment.js
   Purpose: Handles all payment flows across the site.
            Covers the payment modal (MoMo + card tabs),
            network selection, amount display, and
            post-payment confirmation callbacks.
   Loaded: order-online.html only.
           <script src="js/payment.js" defer>
   ============================================================ */

/* ── MODULE STATE ────────────────────────────────────────────
   These variables track the current payment session.
   They are reset each time openPayModal() is called.
   ──────────────────────────────────────────────────────────── */

/* Which page triggered the modal: 'order' */
var _payContext = 'order';

/* Currently selected mobile money network name */
var _selectedNetwork = 'MTN MoMo';

/* Callback function to run after payment is confirmed.
   Set by openPayModal() so each page can define its own action. */
var _onPaymentConfirmed = null;


/* ── OPEN PAYMENT MODAL ───────────────────────────────────────
   Shows the payment modal and populates the amount display.

   Parameters
     ctx      : string — 'order'
     amount   : number — total in GHS (e.g. 152)
     onConfirm: function — called when user confirms payment
   ──────────────────────────────────────────────────────────── */
function openPayModal(ctx, amount, onConfirm) {
  _payContext           = ctx || 'order';
  _onPaymentConfirmed   = onConfirm || null;

  /* Build a display string like "GHS 152" */
  var amtStr = 'GHS ' + (amount || 0).toFixed(0);

  /* Update subtitle copy based on context */
  var subEl = document.getElementById('pay-modal-sub');
  if (subEl) {
    subEl.textContent = 'Pay securely before your order is dispatched.';
  }

  /* Populate both MoMo and card amount displays */
  var momoAmt = document.getElementById('pay-amount-momo');
  var cardAmt = document.getElementById('pay-amount-card');
  if (momoAmt) momoAmt.textContent = 'Amount: ' + amtStr;
  if (cardAmt) cardAmt.textContent = 'Amount: ' + amtStr;

  /* Reset to MoMo tab by default each time modal opens */
  switchPayTab('momo', document.querySelector('.pay-tab'));

  /* Show the overlay */
  var overlay = document.getElementById('pay-modal');
  if (overlay) overlay.classList.add('open');
  syncModalScrollLock();
}


/* ── CLOSE PAYMENT MODAL ─────────────────────────────────────
   Hides the modal and clears sensitive input fields.
   Always clears card and MoMo inputs on close for security —
   we never leave payment data sitting in the DOM.
   ──────────────────────────────────────────────────────────── */
function closePayModal() {
  var overlay = document.getElementById('pay-modal');
  if (overlay) overlay.classList.remove('open');
  syncModalScrollLock();

  /* Security: clear all payment input fields on close */
  _clearPaymentFields();
}


/* ── SWITCH PAYMENT TAB ──────────────────────────────────────
   Toggles between the MoMo and Card tab panels.

   Parameters
     tab : string — 'momo' | 'card'
     el  : element — the clicked .pay-tab button (gets .active)
   ──────────────────────────────────────────────────────────── */
function switchPayTab(tab, el) {
  /* Deactivate all tabs */
  document.querySelectorAll('.pay-tab').forEach(function (t) {
    t.classList.remove('active');
  });
  /* Deactivate all panels */
  document.querySelectorAll('.pay-panel').forEach(function (p) {
    p.classList.remove('active');
  });

  /* Activate the clicked tab */
  if (el) el.classList.add('active');

  /* Activate the matching panel */
  var panel = document.getElementById('panel-' + tab);
  if (panel) panel.classList.add('active');
}


/* ── SELECT MOBILE NETWORK ───────────────────────────────────
   Called when user clicks one of the network buttons
   (MTN MoMo, Telecel Cash, AirtelTigo).
   Marks clicked button as selected and stores the name.
   ──────────────────────────────────────────────────────────── */
function selectNetwork(btn, name) {
  /* Remove selection from all network buttons */
  document.querySelectorAll('.net-btn').forEach(function (b) {
    b.classList.remove('sel');
  });
  /* Select the clicked one */
  btn.classList.add('sel');
  /* Store network name for use in confirmPayment() */
  _selectedNetwork = name || btn.textContent.trim();
}


/* ── CONFIRM PAYMENT ─────────────────────────────────────────
   Validates the chosen payment method's input fields,
   simulates payment processing, then fires the callback.

   Parameters
     method : string — 'momo' | 'card'
   ──────────────────────────────────────────────────────────── */
function confirmPayment(method) {
  /* Safety check — modal must be open */
  var modal = document.getElementById('pay-modal');
  if (!modal || !modal.classList.contains('open')) {
    console.warn('[Payment] Modal not open when confirmPayment called');
    return;
  }
  if (method === 'momo') {
    /* Validate MoMo number field */
    var momoNum = document.getElementById('momo-number');
    if (!momoNum || !momoNum.value.trim()) {
      showToast('Please enter your MoMo number.');
      return;
    }
    /* Validate MoMo number length (Ghana numbers are 10 digits) */
    var digits = momoNum.value.replace(/\D/g, '');
    if (digits.length < 10) {
      showToast('Please enter a valid 10-digit MoMo number.');
      return;
    }
    showToast('Payment prompt sent to ' + momoNum.value.trim() +
      ' via ' + _selectedNetwork + '. Approve on your phone!');

  } else if (method === 'card') {
    /* Validate card number */
    var cardNum = document.getElementById('card-num');
    if (!cardNum || cardNum.value.replace(/\s/g, '').length < 16) {
      showToast('Please enter a valid 16-digit card number.');
      return;
    }
    /* Validate expiry */
    var cardExp = document.getElementById('card-exp');
    if (!cardExp || cardExp.value.trim().length < 4) {
      showToast('Please enter a valid expiry date (MM / YY).');
      return;
    }
    /* Validate CVV */
    var cardCvv = document.getElementById('card-cvv');
    if (!cardCvv || cardCvv.value.trim().length < 3) {
      showToast('Please enter your 3-digit CVV.');
      return;
    }
    showToast('Processing card payment securely…');
  }

  /* Close modal and clear fields */
  closePayModal();

  /* Fire the confirmation callback after a short delay
     to simulate network round-trip */
  setTimeout(function () {
    showToast('Payment confirmed ✓');
    if (typeof _onPaymentConfirmed === 'function') {
      _onPaymentConfirmed();
    }
  }, 2000);
}


/* ── INTERNAL: CLEAR PAYMENT FIELDS ─────────────────────────
   Wipes all sensitive payment inputs from the DOM.
   Called automatically on modal close.
   SECURITY: Ensures no card/MoMo data lingers in input fields
   after the modal is dismissed.
   ──────────────────────────────────────────────────────────── */
function _clearPaymentFields() {
  var fields = [
    'momo-number', 'momo-name',
    'card-num', 'card-exp', 'card-cvv', 'card-name'
  ];
  fields.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.value = '';
  });

  /* Reset network selection to MTN MoMo (default) */
  var firstNet = document.querySelector('.net-btn');
  if (firstNet) {
    document.querySelectorAll('.net-btn').forEach(function (b) {
      b.classList.remove('sel');
    });
    firstNet.classList.add('sel');
    _selectedNetwork = 'MTN MoMo';
  }
}


/* ── CLOSE MODAL ON OVERLAY CLICK ────────────────────────────
   Clicking the dark backdrop area (outside the modal box)
   also closes the modal — standard UX behaviour.
   ──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  var overlay = document.getElementById('pay-modal');
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      /* Only close if the click was on the overlay itself,
         not on the modal box inside it */
      if (e.target === overlay) {
        closePayModal();
      }
    });
  }

  /* ESC key also closes the modal */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closePayModal();
    }
  });
});
