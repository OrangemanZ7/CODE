// src/routes/equipamentoRoutes.js

const express = require('express');
const router = express.Router();
const {
  criarEquipamento,
  listarEquipamentos,
  buscarEquipamentoPorId,
  atualizarEquipamento,
  deletarEquipamento,
  listarEquipamentosOperacionais
} = require('../controllers/equipamentoController');

const { protect, authorize } = require('../middlewares/authMiddleware');

// Rotas públicas (apenas precisam de login)
router.get('/', protect, listarEquipamentos);
router.get('/:id', protect, buscarEquipamentoPorId);
router.get('/list/operational', protect, listarEquipamentosOperacionais);

// Rotas restritas para Técnicos e Admins
router.post('/', protect, authorize('tecnico', 'admin'), criarEquipamento);
router.put('/:id', protect, authorize('tecnico', 'admin'), atualizarEquipamento);
router.delete('/:id', protect, authorize('tecnico', 'admin'), deletarEquipamento);

module.exports = router;
