const express = require('express'); //importa as dependencias necessárias
const cors = require('cors');
const path = require('path');
require('./database'); // importa o banco de dados
const productsRouter = require('./routes/products'); //rotas de produtos

const app = express();
const PORT = 3000; 

app.use(cors()); // habilita o CORS 
app.use(express.json()); // aceita JSON no body das requisições
app.use(express.static(path.join(__dirname, 'public'))); // serve arquivos estáticos da pasta public

app.use('/api/products', productsRouter); // usa as rotas de produtos para o endpoint /api/products

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});