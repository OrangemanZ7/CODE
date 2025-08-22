// src/routes/ordemDeServicoRoutes.js

const express = require('express');
const router = express.Router();
const {
  abrirOrdemDeServico,
  listarOrdensDeServico,
  atualizarOrdemDeServico,
  buscarOrdemDeServicoPorId,
  getHistoricoPorEquipamento
} = require('../controllers/ordemDeServicoController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/', protect, abrirOrdemDeServico);
router.get('/', protect, listarOrdensDeServico);
router.get('/:id', protect, buscarOrdemDeServicoPorId);
router.get('/history/:equipmentId', protect, getHistoricoPorEquipamento);
router.put('/:id', protect, authorize('tecnico', 'admin'), atualizarOrdemDeServico);

module.exports = router;
