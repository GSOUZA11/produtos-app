const Database = require('better-sqlite3'); // importando a bliblioteca para trabalhar com SQLite

const db = new Database('produtos.db'); // cria um banco de dados chamado produtos.db

//Executo um comando SQL para criar a tabela 
db.exec(` 
CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT, --chave prímaria
    nome TEXT NOT NULL,  -- nome do produto
    descricao TEXT,     -- descrição do produto
    price REAL NOT NULL, -- preço do produto
    quantity INTEGER NOT NULL, -- quantidade do produto
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP -- data de criação
);
`);

module.exports = db; //exporta para ser usado em outro arquivo.