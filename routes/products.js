const express = require('express');
const router = express.Router();
const db = require('../database'); // banco de dados

// GET todos os produtos
router.get('/', (req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
  res.json(products);
});

// GET produto por ID
router.get('/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(product);
});

// POST novo produto
router.post('/', (req, res) => {
  const { name, description, price, quantity } = req.body;
  if (!name || price == null || quantity == null) {
    return res.status(400).json({ error: 'Nome, preço e quantidade são obrigatórios' });
  }
  const result = db.prepare('INSERT INTO products (name, description, price, quantity) VALUES (?, ?, ?, ?)').run(name, description, price, quantity);
  const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newProduct);
});

// PUT atualizar produto
router.put('/:id', (req, res) => {
  const { name, description, price, quantity } = req.body;
  const exists = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!exists) return res.status(404).json({ error: 'Produto não encontrado' });
  db.prepare('UPDATE products SET name=?, description=?, price=?, quantity=? WHERE id=?')
    .run(name, description, price, quantity, req.params.id);
  const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE produto
router.delete('/:id', (req, res) => {
  const exists = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!exists) return res.status(404).json({ error: 'Produto não encontrado' });
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ message: 'Produto deletado com sucesso' });
});

module.exports = router; // exporta rotas
