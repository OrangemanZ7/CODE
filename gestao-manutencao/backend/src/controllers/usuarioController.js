// backend/src/controllers/usuarioController.js
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Função para gerar o token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Login
// @route   POST /api/users
// @access  Public
const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await Usuario.findOne({ email }).select('+senha');
    if (usuario && (await usuario.matchPassword(senha))) {
      res.json({
        _id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
        token: generateToken(usuario._id),
      });
    } else {
      res.status(401).json({ message: 'Email ou senha inválidos.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor: ' + error.message });
  }
};

// @desc    Registrar/Criar um novo usuário (Admin)
// @route   POST /api/users
// @access  Private (Admin)
const createUser = async (req, res) => {
    const { nome, email, senha, perfil } = req.body;
    try {
        const usuarioExiste = await Usuario.findOne({ email });
        if (usuarioExiste) {
            return res.status(400).json({ message: 'Usuário já cadastrado com este email.' });
        }
        const usuario = await Usuario.create({ nome, email, senha, perfil });
        // Retorna sem a senha
        res.status(201).json({ _id: usuario._id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor: ' + error.message });
    }
};

// @desc    Listar todos os usuários
// @route   GET /api/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
    try {
        const usuarios = await Usuario.find({}).select('-senha');
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor: ' + error.message });
    }
};

// @desc    Atualizar um usuário
// @route   PUT /api/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (usuario) {
            usuario.nome = req.body.nome || usuario.nome;
            usuario.email = req.body.email || usuario.email;
            usuario.perfil = req.body.perfil || usuario.perfil;
            if (req.body.senha) {
                usuario.senha = req.body.senha;
            }
            const usuarioAtualizado = await usuario.save();
            res.json({ _id: usuarioAtualizado._id, nome: usuarioAtualizado.nome, email: usuarioAtualizado.email, perfil: usuarioAtualizado.perfil });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor: ' + error.message });
    }
};

// @desc    Deletar um usuário
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (usuario) {
            await usuario.deleteOne();
            res.json({ message: 'Usuário removido' });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor: ' + error.message });
    }
};


// Função existente para buscar técnicos
const getTechnicians = async (req, res) => {
    try {
        const technicians = await Usuario.find({ perfil: { $in: ['tecnico', 'admin'] } }).select('nome');
        res.json(technicians);
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor: ' + error.message });
    }
};

// Login e Registro não são mais necessários aqui, pois o registro agora é 'createUser'
module.exports = {
    loginUsuario,
    createUser,
    getUsers,
    updateUser,
    deleteUser,
    getTechnicians,
};