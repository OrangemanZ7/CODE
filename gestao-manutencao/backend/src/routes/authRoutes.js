// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { loginUsuario } = require('../controllers/usuarioController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/login', loginUsuario);

// Rota para verificar o perfil do usuário logado (exemplo)
router.get('/me', protect, (req, res) => {
    res.status(200).json(req.usuario);
});

module.exports = router;