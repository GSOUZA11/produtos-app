const API = 'http://localhost:3000/api/products';

const form = document.getElementById('product-form');
const formTitle = document.getElementById('form-title');
const cancelBtn = document.getElementById('cancel-btn');
const productsList = document.getElementById('products-list');
const loading = document.getElementById('loading');
const empty = document.getElementById('empty');
const searchInput = document.getElementById('search');

let editingId = null;
let allProducts = [];

async function loadProducts() {
  loading.style.display = 'block';
  empty.style.display = 'none';
  productsList.innerHTML = '';
  const res = await fetch(API);
  allProducts = await res.json();
  loading.style.display = 'none';
  updateStats(allProducts);
  renderList(allProducts);
}

function updateStats(products) {
  document.getElementById('stat-total').textContent = products.length;
  const totalQty = products.reduce((s, p) => s + p.quantity, 0);
  const totalVal = products.reduce((s, p) => s + p.price * p.quantity, 0);
  document.getElementById('stat-qty').textContent = totalQty;
  document.getElementById('stat-valor').textContent = 'R$ ' + totalVal.toFixed(2);
  document.getElementById('badge-count').textContent = products.length + ' itens';
}

function renderList(products) {
  productsList.innerHTML = '';
  if (products.length === 0) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  products.forEach(renderCard);
}

function getInitials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function renderCard(p) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="product-avatar">${getInitials(p.name)}</div>
    <div class="product-info">
      <h3>${p.name}</h3>
      <p>${p.description || 'Sem descrição'}</p>
    </div>
    <div class="product-meta">
      <span class="price">R$ ${Number(p.price).toFixed(2)}</span>
      <span class="qty-badge">Estoque: ${p.quantity}</span>
    </div>
    <div class="product-actions">
      <button class="btn btn-edit" onclick="editProduct(${p.id})">✏️ Editar</button>
      <button class="btn btn-delete" onclick="deleteProduct(${p.id})">🗑️ Excluir</button>
    </div>
  `;
  productsList.appendChild(card);
}

searchInput.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase();
  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(q) ||
    (p.description || '').toLowerCase().includes(q)
  );
  renderList(filtered);
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    name: document.getElementById('name').value,
    description: document.getElementById('description').value,
    price: parseFloat(document.getElementById('price').value),
    quantity: parseInt(document.getElementById('quantity').value),
  };
  if (editingId) {
    await fetch(`${API}/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    showToast('✅ Produto atualizado!', 'success');
    resetForm();
   } else {
    await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    showToast('✅ Produto cadastrado!', 'success');
  }
  form.reset();
  await loadProducts();
});

async function editProduct(id) {
  const res = await fetch(`${API}/${id}`);
  const p = await res.json();
  editingId = id;
  formTitle.textContent = 'Editar Produto';
  document.getElementById('name').value = p.name;
  document.getElementById('description').value = p.description || '';
  document.getElementById('price').value = p.price;
  document.getElementById('quantity').value = p.quantity;
  cancelBtn.style.display = 'inline-flex';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteProduct(id) {
  if (!confirm('Tem certeza que deseja excluir este produto?')) return;
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  showToast('🗑️ Produto excluído!', 'error');
  loadProducts();
}

cancelBtn.addEventListener('click', resetForm);

function resetForm() {
  editingId = null;
  form.reset();
  formTitle.textContent = 'Novo Produto';
  cancelBtn.style.display = 'none';
}

function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show ' + type;
  setTimeout(() => toast.className = 'toast', 2800);
}

loadProducts();