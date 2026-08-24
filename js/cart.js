/* ============================================================
   HEALTHPLUS PHARACY — cart.html logic
   Powers the dedicated Cart page. Reuses the same cart state
   (_cart, renderCart, setCartQty, removeFromCart) defined in
   js/pharmacy.js and the shared store (loadCart/saveCart/
   clearCartShared) in js/auth.js, so a basket started on the
   pharmacy page shows up here and vice-versa.
   Loaded: cart.html only.
   ============================================================ */

/* A small "frequently bought together" list. Kept light so the
   page works on its own; items already in the cart are skipped. */
var CART_RECOS = [
  { name: 'Paracetamol 500mg',        price: 15,  img: '', meta: 'Pain relief' },
  { name: 'Oral Rehydration Salts',   price: 12,  img: '', meta: 'Hydration' },
  { name: 'Vitamin C 500mg',          price: 25,  img: '', meta: 'Immunity' },
  { name: 'Digital Thermometer',      price: 40,  img: '', meta: 'Device' }
];

/* Renders the recommendations row (skips items already in cart). */
function renderCartRecos() {
  var grid     = document.getElementById('rec-grid');
  var section  = document.getElementById('rec-section');
  if (!grid) return;
  var inCart   = Object.keys(window._cart || {});
  var recs     = CART_RECOS.filter(function (r) { return inCart.indexOf(r.name) === -1; }).slice(0, 4);
  if (recs.length === 0) { if (section) section.style.display = 'none'; return; }
  if (section) section.style.display = 'block';
  grid.innerHTML = recs.map(function (r) {
    var safe = r.name.replace(/'/g, "\'");
    return '<div class="rec-card">' +
      '<div class="rec-thumb">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 20.5 3 13l1.5-1.5 6 6 13-13L25 5z"/></svg>' +
      '</div>' +
      '<h4>' + r.name + '</h4>' +
      '<p>' + (r.meta || '') + '</p>' +
      '<button class="btn-outline btn-sm" onclick="addRecoToCart(\'' + safe + '\',' + r.price + ')">+ Add · GHS ' + r.price + '</button>' +
    '</div>';
  }).join('');
}

/* Add a recommended item to the shared cart (reuses pharmacy.js addToCart
   if available, otherwise falls back to the shared store directly). */
function addRecoToCart(name, price) {
  if (typeof window.addToCart === 'function') {
    window.addToCart(name, price, '', '');
  } else {
    var cart = loadCart();
    if (!cart[name]) cart[name] = { price: price, qty: 1, img: '', meta: '' };
    else cart[name].qty += 1;
    saveCart(cart);
  }
  showToast(name + ' added to cart ✓');
  renderCartPage();
}

/* Full re-render of the Cart page (cart lines + summary + recos).
   Delegates the line-item rendering to pharmacy.js renderCart(), which
   already targets #cart-items / #cart-summary-card / #cart-total-val etc. */
function renderCartPage() {
  if (typeof window.renderCart === 'function') window.renderCart();
  renderCartRecos();
  updateCartBadgeAll();
}

/* Empty the whole cart (with confirm). */
function clearCartNow() {
  if (!confirm('Remove all items from your cart?')) return;
  clearCartShared();
  if (typeof window._cart !== 'undefined') window._cart = {};
  renderCartPage();
  showToast('Cart emptied');
}

/* Checkout — reuse the same payment modal as the pharmacy flow. */
function startCartCheckout() {
  if (typeof window._cart === 'undefined' || Object.keys(window._cart).length === 0) {
    showToast('Your cart is empty.');
    return;
  }
  var total = getCartTotal();
  var user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  if (!user) {
    showToast('Please sign in to check out.');
    if (typeof openAuthModal === 'function') openAuthModal();
    return;
  }
  openPayModal('order', total, function () {
    showToast('Payment confirmed ✓ — Your order is on its way 🛵');
    clearCartShared();
    if (typeof window._cart !== 'undefined') window._cart = {};
    renderCartPage();
  });
}

document.addEventListener('DOMContentLoaded', function () {
  /* Make sure we start from the persisted basket. */
  if (typeof window._cart !== 'undefined') window._cart = loadCart();
  renderCartPage();
});
