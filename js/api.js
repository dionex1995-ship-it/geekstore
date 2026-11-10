/* ==========================================
   API — РАБОТА С ТОВАРАМИ (products.json)
   ========================================== */

let productsCache = null;

async function loadProducts() {
  if (productsCache) return productsCache;
  try {
    const response = await fetch('data/products.json');
    if (!response.ok) throw new Error('Не удалось загрузить товары');
    productsCache = await response.json();
    return productsCache;
  } catch (error) {
    console.error(error);
    return [];
  }
}

function getProductById(id) {
  const products = productsCache || [];
  return products.find(p => p.id === parseInt(id)) || null;
}

function getProductsByCategory(category) {
  const products = productsCache || [];
  return products.filter(p => p.category === category);
}

function searchProducts(query) {
  const products = productsCache || [];
  const q = query.toLowerCase();
  return products.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );
}

function getUniqueCategories(products) {
  return [...new Set(products.map(p => p.category))];
}

function getUniqueBrands(products) {
  return [...new Set(products.map(p => p.brand))];
}

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}