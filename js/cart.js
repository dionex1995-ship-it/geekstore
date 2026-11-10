/* ==========================================
   CART — КОРЗИНА (localStorage)
   ========================================== */

let cart = [];

function loadCart() {
  const stored = localStorage.getItem(CONFIG.storageKeys.cart);
  cart = stored ? JSON.parse(stored) : [];
  updateCartCount();
}

function saveCart() {
  localStorage.setItem(CONFIG.storageKeys.cart, JSON.stringify(cart));
  updateCartCount();
  dispatchCartEvent();
}

function updateCartCount() {
  const countEl = document.getElementById('cartCount');
  if (countEl) {
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    countEl.textContent = total;
    countEl.style.display = total > 0 ? 'flex' : 'none';
  }
}

function addToCart(productId, qty = 1) {
  const product = getProductById(productId);
  if (!product) return false;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }
  saveCart();
  showToast('Товар добавлен в корзину', 'success');
  return true;
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  renderCart();
}

function updateQty(productId, qty) {
  if (qty < 1) {
    removeFromCart(productId);
    return;
  }
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.qty = qty;
    saveCart();
    renderCart();
  }
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

function getCartItems() {
  return cart.map(item => {
    const product = getProductById(item.id);
    if (!product) return null;
    return { ...product, qty: item.qty };
  }).filter(Boolean);
}

function getCartTotal() {
  return cart.reduce((sum, item) => {
    const product = getProductById(item.id);
    return product ? sum + product.price * item.qty : sum;
  }, 0);
}

function dispatchCartEvent() {
  window.dispatchEvent(new CustomEvent('cartUpdated'));
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'toast-error' : 'toast-success'}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}