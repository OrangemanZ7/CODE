// src/models/Usuario.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'O nome é obrigatório.'],
    },
    email: {
      type: String,
      required: [true, 'O email é obrigatório.'],
      unique: true, // Garante que não hajam dois emails iguais
      lowercase: true,
    },
    senha: {
      type: String,
      required: [true, 'A senha é obrigatória.'],
      select: false, // Não retorna a senha em consultas por padrão
    },
    perfil: {
      type: String,
      required: true,
      enum: ['funcionario', 'tecnico', 'admin'], // Apenas estes valores são permitidos
      default: 'funcionario',
    },
  },
  {
    timestamps: true, // Adiciona os campos createdAt e updatedAt automaticamente
  }
);

// Adiciona um método ao schema para comparar a senha enviada com a senha no banco
usuarioSchema.methods.matchPassword = async function (enteredPassword) {
  // 'this.senha' refere-se à senha do documento do usuário encontrado
  return await bcrypt.compare(enteredPassword, this.senha);
};

// Middleware (hook) do Mongoose que é executado ANTES de salvar o documento
usuarioSchema.pre('save', async function (next) {
  // Se a senha não foi modificada, pula para o próximo middleware
  if (!this.isModified('senha')) {
    next();
  }

  // Gera o "salt" e faz o hash da senha
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
