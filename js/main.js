/* MAIN — ГЛОБАЛЬНЫЕ ОБРАБОТЧИКИ */
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  loadCart();
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const closeMenu = document.getElementById('closeMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileBtn) mobileBtn.addEventListener('click', () => {
    mobileMenu.style.display = 'block';
    document.body.style.overflow = 'hidden';
  });
  if (closeMenu) closeMenu.addEventListener('click', () => {
    mobileMenu.style.display = 'none';
    document.body.style.overflow = '';
  });
  const authModal = document.getElementById('authModal');
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) authModal.classList.remove('active');
    });
  }
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn && window.location.pathname.endsWith('cart.html') === false) {
    cartBtn.addEventListener('click', () => {
      window.location.href = 'cart.html';
    });
  }
  const loader = document.getElementById('pageLoading');
  if (loader) setTimeout(() => loader.classList.add('fade-out'), 500);
});
if (document.getElementById('productsGrid') || document.getElementById('categoriesGrid')) {
  initCatalog();
}
if (document.getElementById('productTitle')) {
  initProductPage();
}
if (document.getElementById('cartItemsList')) {
  renderCart();
}
function renderCart() {
  const list = document.getElementById('cartItemsList');
  const empty = document.getElementById('emptyCart');
  const content = document.getElementById('cartContent');
  const itemsEl = document.getElementById('summaryItems');
  const totalEl = document.getElementById('summaryTotal');
  if (!list) return;
  const items = getCartItems();
  if (items.length === 0) {
    list.innerHTML = '';
    if (empty) empty.classList.remove('hidden');
    if (content) content.style.display = 'none';
    if (itemsEl) itemsEl.textContent = '0 ₽';
    if (totalEl) totalEl.textContent = '0 ₽';
    return;
  }
  if (empty) empty.classList.add('hidden');
  if (content) content.style.display = 'block';
  const total = getCartTotal();
  list.innerHTML = items.map(item => `
    <div class="cart-item">
      <div class="cart-item-image"><img src="${item.image || 'images/placeholder.png'}" alt="${item.title}" onerror="this.style.display='none'"></div>
      <div class="cart-item-info">
        <div class="cart-item-brand">${item.brand}</div>
        <h3>${item.title}</h3>
        <div class="cart-item-sku">Арт: ${item.id}</div>
      </div>
      <div class="cart-item-qty">
        <div class="qty-control">
          <button onclick="updateQty(${item.id}, ${item.qty - 1})">−</button>
          <input type="number" value="${item.qty}" min="1" onchange="updateQty(${item.id}, this.value)">
          <button onclick="updateQty(${item.id}, ${item.qty + 1})">+</button>
        </div>
      </div>
      <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
      <div class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Удалить">🗑️</div>
    </div>
  `).join('');
  if (itemsEl) itemsEl.textContent = formatPrice(total);
  if (totalEl) totalEl.textContent = formatPrice(total);
}
const orderForm = document.getElementById('orderForm');
if (orderForm) {
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const items = getCartItems();
    if (items.length === 0) {
      showToast('Корзина пуста', 'error');
      return;
    }
    const orderData = {
      name: document.getElementById('orderName').value,
      phone: document.getElementById('orderPhone').value,
      email: document.getElementById('orderEmail').value,
      address: document.getElementById('orderAddress').value,
      comment: document.getElementById('orderComment').value,
      items,
      total: getCartTotal(),
      date: new Date().toISOString()
    };
    localStorage.setItem('geekstore_last_order', JSON.stringify(orderData));
    clearCart();
    showToast('Заказ оформлен! Менеджер свяжется с вами.', 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 1500);
  });
}
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutForm = document.getElementById('checkoutForm');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (checkoutForm) checkoutForm.style.display = checkoutForm.style.display === 'none' ? 'block' : 'none';
  });
}
window.renderCart = renderCart;
window.updateQty = updateQty;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;