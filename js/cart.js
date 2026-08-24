/* ============================================================
   HEALTHPLUS PHARACY â€” cart.html logic
   Powers the dedicated Cart page. Reuses the same cart state
   (_cart, renderCart, setCartQty, removeFromCart) defined in
   js/pharmacy.js and the shared store (loadCart/saveCart/
   clearCartShared) in js/auth.js, so a basket started on the
   pharmacy page shows up here and vice-versa.
   Loaded: cart.html only.
   ============================================================ */

/* Full re-render of the Cart page (cart lines + summary + recos).
   Delegates the line-item rendering to pharmacy.js renderCart(), which
   already targets #cart-items / #cart-summary-card / #cart-total-val etc. */
function renderCartPage() {
  if (typeof window.renderCart === 'function') window.renderCart();
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

/* Checkout â€” reuse the same payment modal as the pharmacy flow. */
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
    showToast('Payment confirmed âœ“ â€” Your order is on its way ðŸ›µ');
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
