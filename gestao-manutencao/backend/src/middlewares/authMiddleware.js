// src/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Middleware de AUTENTICAÇÃO
const protect = async (req, res, next) => {
  let token;

  // 1. Verifica se o token está no cabeçalho 'Authorization' e se começa com 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Extrai apenas o token (remove o 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // 3. Verifica se o token é válido usando nosso segredo
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Busca o usuário pelo ID contido no token e anexa ao objeto 'req'
      // Isso tornará os dados do usuário logado acessíveis em qualquer rota protegida
      req.usuario = await Usuario.findById(decoded.id).select('-senha');

      // 5. Passa para o próximo passo da requisição
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Não autorizado, token falhou.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Não autorizado, token não encontrado.' });
  }
};

// Middleware de AUTORIZAÇÃO por perfil
const authorize = (...perfis) => {
  return (req, res, next) => {
    // Este middleware deve rodar DEPOIS do 'protect', então já teremos 'req.usuario'
    if (!perfis.includes(req.usuario.perfil)) {
      return res.status(403).json({ // 403 = Forbidden (Proibido)
        message: `Acesso negado. O perfil '${req.usuario.perfil}' não tem permissão para executar esta ação.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
