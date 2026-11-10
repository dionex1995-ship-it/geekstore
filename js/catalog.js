/* ==========================================
   CATALOG — КАТАЛОГ И ФИЛЬТРЫ
   ========================================== */

let allProducts = [];
let filteredProducts = [];
let currentFilters = { category: '', brand: '', priceMin: '', priceMax: '', inStock: false, search: '' };

async function initCatalog() {
  allProducts = await loadProducts();
  if (allProducts.length === 0) return;
  renderCategories();
function setupSearch(){
  const i=document.getElementById('searchInput'),r=document.getElementById('searchResults'),d=document.getElementById('searchDropdown');
  if(!i)return;
  i.addEventListener('input',e=>{currentFilters.search=e.target.value;applyFilters();
    if(r&&d){const res=searchProducts(e.target.value).slice(0,5);
      if(res.length>0){r.innerHTML=res.map(p=>`<div class="search-result-item" onclick="location='product.html?id=${p.id}'"><div style=\"display:flex;align-items:center;\"><img src=\"${p.image||'images/placeholder.png'}\" onerror=\"this.style.display='none'\"><div><strong>${p.title}</strong><span>${p.price}₽</span></div></div></div>`).join('');d.classList.add('active');}else d.classList.remove('active');}
  });
  document.addEventListener('click',e=>{if(d&&!d.contains(e.target)&&!i.contains(e.target))d.classList.remove('active');});
}
function setupSort(){
  const s=document.getElementById('sortSelect');if(!s)return;
  s.addEventListener('change',e=>{sortProducts(e.target.value);renderProducts();});
}
function sortProducts(c){
  switch(c){case'price-asc':filteredProducts.sort((a,b)=>a.price-b.price);break;case'price-desc':filteredProducts.sort((a,b)=>b.price-a.price);break;case'rating':filteredProducts.sort((a,b)=>b.rating-a.rating);break;}
}
function applyFilters(){
  filteredProducts=allProducts.filter(p=>{
    if(currentFilters.category&&p.category!==currentFilters.category)return false;
    if(currentFilters.brand&&p.brand!==currentFilters.brand)return false;
    if(currentFilters.priceMin&&p.price<parseFloat(currentFilters.priceMin))return false;
    if(currentFilters.priceMax&&p.price>parseFloat(currentFilters.priceMax))return false;
    if(currentFilters.inStock&&!p.inStock)return false;
    if(currentFilters.search){const q=currentFilters.search.toLowerCase();if(!p.title.toLowerCase().includes(q)&&!p.brand.toLowerCase().includes(q))return false;}
    return true;
  });
  const ce=document.getElementById('productsCount');if(ce)ce.textContent=`Найдено: ${filteredProducts.length}`;
  sortProducts(document.getElementById('sortSelect')?.value||'default');renderProducts();
}
function renderProducts(){
  const g=document.getElementById('productsGrid');if(!g)return;
  if(filteredProducts.length===0){g.innerHTML='<div class="empty-state" style="grid-column:1/-1;"><h3>Не найдено</h3><p>Попробуйте другие фильтры.</p></div>';return;}
  g.innerHTML=filteredProducts.map(createProductCard).join('');
}
function createProductCard(p){
  const d=p.oldPrice&&p.oldPrice>p.price?Math.round(((p.oldPrice-p.price)/p.oldPrice)*100):0;
  const sb=p.inStock?'<span class="badge badge-success">В наличии</span>':'<span class="badge badge-danger">Нет в наличии</span>';
  return `<article class="product-card" onclick="location='product.html?id=${p.id}'"><div class="product-image"><img src="${p.image||'images/placeholder.png'}" alt="${p.title}" onerror="this.style.display='none'"><div class="product-badge">${sb}</div>${d>0?`<div class="product-badge" style="background:var(--danger);color:#fff;top:12px;right:12px;left:auto;">-${d}%</div>`:''}<div class="product-actions-overlay"><button class="btn btn-outline btn-sm" onclick="event.stopPropagation();addToCart(${p.id})">В корзину</button></div></div><div class="product-info"><div class="product-brand">${p.brand}</div><div class="product-title">${p.title}</div><div class="product-rating"><div class="stars">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5-Math.floor(p.rating))}</div><span>(${p.reviews||0})</span></div><div class="product-price-row"><div class="product-price">${formatPrice(p.price)}</div>${p.oldPrice&&p.oldPrice>p.price?`<div class="product-old-price">${formatPrice(p.oldPrice)}</div>`:''}${d>0?`<div class="product-discount">-${d}%</div>`:''}</div><div class="product-stock ${p.inStock?'in-stock':'out-of-stock'}">${p.inStock?'В наличии':'Нет в наличии'}</div><button class="btn-add-to-cart" onclick="event.stopPropagation();addToCart(${p.id})">${p.inStock?'В корзину':'Нет в наличии'}</button></div></article>`;
}
window.addToCart=addToCart;
function renderCategories(){
  const g=document.getElementById('categoriesGrid');if(!g)return;
  const cats=getUniqueCategories(allProducts);
  const n={smartphones:'Смартфоны',laptops:'Ноутбуки',tablets:'Планшеты',headphones:'Наушники',accessories:'Аксессуары'};
  g.innerHTML=cats.map(c=>`<a href="index.html?cat=${c}" class="card" style="padding:20px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px;color:var(--text-primary);"><div style="width:48px;height:48px;background:var(--accent-bg);border-radius:var(--border-radius-sm);display:flex;align-items:center;justify-content:center;font-size:20px;">📱</div><div style="font-weight:600;font-size:14px;">${n[c]||c}</div></a>`).join('');
}
function renderCategoryFilters(){
  const c=document.getElementById('categoryFilters');if(!c)return;
  const cats=getUniqueCategories(allProducts);
  const n={smartphones:'Смартфоны',laptops:'Ноутбуки',tablets:'Планшеты',headphones:'Наушники',accessories:'Аксессуары'};
  c.innerHTML=cats.map(c=>`<label class="filter-checkbox"><input type="checkbox" value="${c}" onchange="filterByCategory(this)"><span>${n[c]||c}</span></label>`).join('');
}
function renderBrandFilters(){
  const c=document.getElementById('brandFilters');if(!c)return;
  c.innerHTML=getUniqueBrands(allProducts).map(b=>`<label class="filter-checkbox"><input type="checkbox" value="${b}" onchange="filterByBrand(this)"><span>${b}</span></label>`).join('');
}
function filterByCategory(cb){currentFilters.category=cb.checked?cb.value:'';applyFilters();}
function filterByBrand(cb){currentFilters.brand=cb.checked?cb.value:'';applyFilters();}
function setupFilters(){
  const min=document.getElementById('priceMin'),max=document.getElementById('priceMax'),stock=document.getElementById('filterInStock'),reset=document.getElementById('resetFilters');
  if(min)min.addEventListener('input',e=>{currentFilters.priceMin=e.target.value;applyFilters();});
  if(max)max.addEventListener('input',e=>{currentFilters.priceMax=e.target.value;applyFilters();});
  if(stock)stock.addEventListener('change',e=>{currentFilters.inStock=e.target.checked;applyFilters();});
  if(reset)reset.addEventListener('click',resetFilters);
}
function resetFilters(){
  currentFilters={category:'',brand:'',priceMin:'',priceMax:'',inStock:false,search:''};
  document.getElementById('priceMin')?.value='';document.getElementById('priceMax')?.value='';
  document.getElementById('filterInStock')?.checked=false;
  document.querySelectorAll('#categoryFilters input,#brandFilters input').forEach(i=>i.checked=false);
  document.getElementById('searchInput')?.value='';applyFilters();
}
  renderCategoryFilters();
  renderBrandFilters();
  setupFilters();
  setupSearch();
  setupSort();
  renderProducts();
}