const API = 'http://localhost:3000/api/products';

const form = document.getElementById('product-form');
const formTitle = document.getElementById('form-title');
const cancelBtn = document.getElementById('cancel-btn');
const productsList = document.getElementById('products-list');
const loading = document.getElementById('loading');
const empty = document.getElementById('empty');

let editingId = null;

// Carrega produtos
async function loadProducts() {
  loading.style.display = 'block';
  empty.style.display = 'none';
  productsList.innerHTML = '';
  const res = await fetch(API);
  const products = await res.json();
  loading.style.display = 'none';
  if (products.length === 0) { empty.style.display = 'block'; return; }
  products.forEach(renderCard);
}

// Renderiza card
function renderCard(p) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="product-info">
      <h3>${p.name}</h3>
      ${p.description ? `<p>${p.description}</p>` : ''}
      <div class="product-meta">
        <span class="price">R$ ${Number(p.price).toFixed(2)}</span>
        <span class="qty">Estoque: ${p.quantity}</span>
      </div>
    </div>
    <div class="product-actions">
      <button class="btn btn-edit" onclick="editProduct(${p.id})">Editar</button>
      <button class="btn btn-delete" onclick="deleteProduct(${p.id})">Excluir</button>
    </div>
  `;
  productsList.appendChild(card);
}

// Salvar produto
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
    showToast('Produto atualizado!');
    resetForm();
  } else {
    await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    showToast('Produto cadastrado!');
  }
  form.reset();
  loadProducts();
});

// Editar produto
async function editProduct(id) {
  const res = await fetch(`${API}/${id}`);
  const p = await res.json();
  editingId = id;
  formTitle.textContent = 'Editar Produto';
  document.getElementById('name').value = p.name;
  document.getElementById('description').value = p.description || '';
  document.getElementById('price').value = p.price;
  document.getElementById('quantity').value = p.quantity;
  cancelBtn.style.display = 'inline-block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Excluir produto
async function deleteProduct(id) {
  if (!confirm('Tem certeza que deseja excluir este produto?')) return;
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  showToast('Produto excluído!');
  loadProducts();
}

// Cancelar edição
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
  editingId = null;
  form.reset();
  formTitle.textContent = 'Novo Produto';
  cancelBtn.style.display = 'none';
}

// Toast
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// Inicializa
loadProducts();
