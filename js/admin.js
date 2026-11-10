/* ==========================================
   ADMIN — АДМИН-ПАНЕЛЬ
   ========================================== */

let adminProducts = [];
let editingId = null;

async function initAdmin() {
  await loadProducts();
  adminProducts = [...(productsCache || [])];
  renderAdminTable();
  setupAdminEvents();
}

function renderAdminTable() {
  const t = document.getElementById('adminTableBody');
  if (!t) return;
  const n = { smartphones: 'Смартфоны', laptops: 'Ноутбуки', tablets: 'Планшеты', headphones: 'Наушники', accessories: 'Аксессуары' };
  t.innerHTML = adminProducts.map(p => `
    <tr>
      <td><img src="${p.image || 'images/placeholder.png'}" class="product-image-tiny" onerror="this.style.display='none'"></td>
      <td>${p.title}</td><td>${p.brand}</td><td>${n[p.category] || p.category}</td>
      <td>${formatPrice(p.price)}</td><td>${p.inStock ? 'Есть' : 'Нет'}</td>
      <td><button class="btn-edit" onclick="editProduct(${p.id})" title="Ред.">✏️</button>
      <button class="btn-delete" onclick="deleteProduct(${p.id})" title="Уд.">🗑️</button></td>
    </tr>`).join('');
}

function setupAdminEvents() {
  const oa = document.getElementById('openAddForm');
  const ce = document.getElementById('cancelEdit');
  const pf = document.getElementById('productForm');
  const db = document.getElementById('deleteProduct');
  const as = document.getElementById('adminSearch');
  const ac = document.getElementById('adminCategoryFilter');
  if (oa) oa.addEventListener('click', openAddForm);
  if (ce) ce.addEventListener('click', cancelEditForm);
  if (db) db.addEventListener('click', () => deleteProduct(editingId));
  if (pf) pf.addEventListener('submit', e => { e.preventDefault(); saveProduct(); });
  if (as) as.addEventListener('input', e => filterAdmin(e.target.value));
  if (ac) ac.addEventListener('change', e => filterAdminCategories(e.target.value));
  if (ac) {
    const cats = [...new Set(adminProducts.map(p => p.category))];
    const n = { smartphones: 'Смартфоны', laptops: 'Ноутбуки', tablets: 'Планшеты', headphones: 'Наушники', accessories: 'Аксессуары' };
    ac.innerHTML = '<option value="">Все</option>' + cats.map(c => `<option value="${c}">${n[c] || c}</option>`).join('');
  }
}

function openAddForm() {
  editingId = null;
  document.getElementById('adminForm').style.display = 'block';
  document.getElementById('productForm').reset();
  document.getElementById('deleteProduct').style.display = 'none';
  document.querySelector('#adminForm h2').textContent = 'Добавить товар';
}

function editProduct(id) {
  const p = adminProducts.find(x => x.id === id);
  if (!p) return;
  editingId = id;
  document.getElementById('productId').value = p.id;
  document.getElementById('editTitle').value = p.title;
  document.getElementById('editBrand').value = p.brand;
  document.getElementById('editCategory').value = p.category;
  document.getElementById('editPrice').value = p.price;
  document.getElementById('editOldPrice').value = p.oldPrice || '';
  document.getElementById('editStock').value = p.stock || 0;
  document.getElementById('editRating').value = p.rating || 4.5;
  document.getElementById('editDescription').value = p.description || '';
  document.getElementById('editImage').value = p.image || '';
  document.getElementById('editSpecs').value = JSON.stringify(p.specs || {}, null, 2);
  document.getElementById('adminForm').style.display = 'block';
  document.querySelector('#adminForm h2').textContent = 'Редактировать товар';
  document.getElementById('deleteProduct').style.display = 'inline-block';
}

function cancelEditForm() {
  document.getElementById('adminForm').style.display = 'none';
  editingId = null;
}

function saveProduct() {
  const pd = {
    id: editingId || Date.now(),
    title: document.getElementById('editTitle').value,
    brand: document.getElementById('editBrand').value,
    category: document.getElementById('editCategory').value,
    price: parseInt(document.getElementById('editPrice').value) || 0,
    oldPrice: parseInt(document.getElementById('editOldPrice').value) || null,
    stock: parseInt(document.getElementById('editStock').value) || 0,
    rating: parseFloat(document.getElementById('editRating').value) || 4.5,
    description: document.getElementById('editDescription').value,
    image: document.getElementById('editImage').value || 'images/placeholder.png',
    specs: JSON.parse(document.getElementById('editSpecs').value || '{}'),
    reviews: 0,
    inStock: (parseInt(document.getElementById('editStock').value) || 0) > 0
  };
  if (editingId) {
    const i = adminProducts.findIndex(x => x.id === editingId);
    if (i >= 0) adminProducts[i] = pd;
  } else adminProducts.push(pd);
  productsCache = adminProducts;
  localStorage.setItem(CONFIG.storageKeys.products, JSON.stringify(adminProducts));
  renderAdminTable();
  cancelEditForm();
  showToast('Сохранено', 'success');
}

function deleteProduct(id) {
  if (!confirm('Удалить товар?')) return;
  adminProducts = adminProducts.filter(x => x.id !== id);
  productsCache = adminProducts;
  localStorage.setItem(CONFIG.storageKeys.products, JSON.stringify(adminProducts));
  renderAdminTable();
  cancelEditForm();
  showToast('Удалено', 'success');
}

function filterAdmin(q) {
  document.querySelectorAll('#adminTableBody tr').forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(q.toLowerCase()) ? '' : 'none';
  });
}
function filterAdminCategories(cat) {
  document.querySelectorAll('#adminTableBody tr').forEach(r => {
    r.style.display = !cat || r.textContent.includes(cat) ? '' : 'none';
  });
}
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;