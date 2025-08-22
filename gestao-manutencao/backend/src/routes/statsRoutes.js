// backend/src/routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/statsController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Protegemos a rota para que apenas usuários logados possam ver
router.get('/dashboard', protect, getDashboardStats);

module.exports = router;
