// backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getTechnicians,
    createUser,
    getUsers,
    updateUser,
    deleteUser 
} = require('../controllers/usuarioController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Rota para o formulário de OS buscar técnicos
router.get('/technicians', protect, authorize('tecnico', 'admin'), getTechnicians);

// --- Novas Rotas de Gerenciamento para Admin ---
router.route('/')
    .get(protect, authorize('admin'), getUsers) // Listar todos os usuários
    .post(protect, authorize('admin'), createUser); // Criar um novo usuário

router.route('/:id')
    .put(protect, authorize('admin'), updateUser) // Atualizar um usuário
    .delete(protect, authorize('admin'), deleteUser); // Deletar um usuário

module.exports = router;