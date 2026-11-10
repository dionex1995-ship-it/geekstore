/* PRODUCT — СТРАНИЦА ТОВАРА */
let currentProduct = null;
async function initProductPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) { window.location.href = 'index.html'; return; }
  await loadProducts();
  currentProduct = getProductById(id);
  if (!currentProduct) {
    document.body.innerHTML = '<div style="text-align:center;padding:50px;">Товар не найден <a href="index.html">Вернуться в каталог</a></div>';
    return;
  }
  renderProduct();
  renderRelatedProducts();
}
function renderProduct() {
  const p = currentProduct;
  document.title = `${p.title} — GEEKSTORE`;
  document.getElementById('productTitle').textContent = p.title;
  document.getElementById('productBrand').textContent = p.brand;
  document.getElementById('productCategoryName').textContent = getCategoryName(p.category);
  document.getElementById('productBreadcrumbTitle').textContent = p.title;
  document.getElementById('productPrice').textContent = formatPrice(p.price);
  document.getElementById('productSku').textContent = `Артикул: ${p.id}`;
  document.getElementById('productDescription').textContent = p.description;
  document.getElementById('productStars').textContent = '★'.repeat(Math.floor(p.rating)) + '☆'.repeat(5 - Math.floor(p.rating));
  document.getElementById('productRatingText').textContent = `(${p.reviews || 0} отзывов)`;
  document.getElementById('productReviews').textContent = `${p.reviews || 0} отзывов`;
  if (p.oldPrice && p.oldPrice > p.price) {
    document.getElementById('productOldPrice').textContent = formatPrice(p.oldPrice);
    document.getElementById('productOldPrice').style.display = 'block';
    const discount = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
    document.getElementById('productDiscount').textContent = `-${discount}%`;
    document.getElementById('productDiscount').style.display = 'block';
  }
  const mainImg = document.getElementById('mainProductImage');
  mainImg.src = p.image || 'images/placeholder.png';
  mainImg.alt = p.title;
  const thumbs = document.getElementById('productThumbs');
  const images = [p.image, ...(p.extraImages || [])].filter(Boolean);
  thumbs.innerHTML = images.map((img, idx) => `
    <div class="product-thumb ${idx === 0 ? 'active' : ''}">
      <img src="${img}" alt="" onclick="selectThumb(${idx})" onerror="this.style.display='none'">
    </div>
  `).join('');
  const specsTable = document.getElementById('productSpecsTable');
  specsTable.innerHTML = Object.entries(p.specs || {}).map(([key, value]) => `<tr><td>${key}</td><td>${value}</td></tr>`).join('');
  document.getElementById('addToCartBtn').addEventListener('click', () => {
    const qty = parseInt(document.getElementById('qtyValue').value || '1');
    addToCart(p.id, qty);
  });
  document.getElementById('qtyPlus').addEventListener('click', () => {
    const input = document.getElementById('qtyValue');
    input.value = Math.min(parseInt(input.value) + 1, 99);
  });
  document.getElementById('qtyMinus').addEventListener('click', () => {
    const input = document.getElementById('qtyValue');
    input.value = Math.max(parseInt(input.value) - 1, 1);
  });
}
function selectThumb(index) {
  const thumbs = document.querySelectorAll('.product-thumb');
  thumbs.forEach(t => t.classList.remove('active'));
  thumbs[index].classList.add('active');
  const img = thumbs[index].querySelector('img');
  if (img) {
    const main = document.getElementById('mainProductImage');
    main.src = img.src;
    main.style.opacity = '0';
    setTimeout(() => { main.style.opacity = '1'; }, 150);
  }
}
async function renderRelatedProducts() {
  const grid = document.getElementById('relatedProductsGrid');
  if (!grid || !currentProduct) return;
  const all = productsCache || [];
  const related = all.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id).slice(0, 4);
  grid.innerHTML = related.map(p => `
    <article class="product-card" onclick="window.location.href='product.html?id=${p.id}'">
      <div class="product-image"><img src="${p.image || 'images/placeholder.png'}" alt="${p.title}" onerror="this.style.display='none'"></div>
      <div class="product-info">
        <div class="product-brand">${p.brand}</div>
        <div class="product-title">${p.title}</div>
        <div class="product-price-row"><div class="product-price">${formatPrice(p.price)}</div></div>
        <button class="btn-add-to-cart" onclick="event.stopPropagation();addToCart(${p.id})">В корзину</button>
      </div>
    </article>
  `).join('');
}
function getCategoryName(cat) {
  const names = { smartphones: 'Смартфоны', laptops: 'Ноутбуки', tablets: 'Планшеты', headphones: 'Наушники', accessories: 'Аксессуары' };
  return names[cat] || cat;
}
window.addToCart = addToCart;