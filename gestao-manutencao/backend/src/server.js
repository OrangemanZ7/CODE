// src/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Importa arquivos de rotas
const authRoutes = require('./routes/authRoutes');
const equipamentoRoutes = require('./routes/equipamentoRoutes');
const ordemDeServicoRoutes = require('./routes/ordemDeServicoRoutes');
const userRoutes = require('./routes/userRoutes');
const statsRoutes = require('./routes/statsRoutes');

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config({quiet:true});

// Executa a função de conexão com o banco de dados
connectDB();

// Instancia o express na variàvel app
const app = express();

// Inicia o CORS
app.use(cors());

// Middleware para permitir que o Express entenda JSON no corpo das requisições
app.use(express.json());

// Rota de teste para verificar se o servidor está no ar
app.get('/', (req, res) => {
  res.send('API da Gestão de Manutenção está rodando!');
});

// Middleware para usar as rotas de autenticação
// Tudo que estiver em 'authRoutes' será prefixado com '/api/auth'
app.use('/api/auth', authRoutes);

app.use('/api/equipments', equipamentoRoutes);
app.use('/api/workorders', ordemDeServicoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);

// Define a porta a partir do arquivo .env, com um fallback para 5000
const PORT = process.env.PORT || 5000;

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});