// src/models/OrdemDeServico.js

const mongoose = require('mongoose');

const historicoSchema = new mongoose.Schema({
  data: { type: Date, default: Date.now },
  usuario: { type: String, required: true },
  acao: { type: String, required: true },
});

const ordemDeServicoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'O título da OS é obrigatório.'],
    },
    descricao: {
      type: String,
      required: [true, 'A descrição do problema é obrigatória.'],
    },
    status: {
      type: String,
      required: true,
      enum: ['aberto', 'em_andamento', 'aguardando_peca', 'concluido', 'cancelado'],
      default: 'aberto',
    },
    prioridade: {
      type: String,
      required: true,
      enum: ['baixa', 'media', 'alta'],
      default: 'baixa',
    },
    // --- Relacionamentos ---
    equipamento: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Equipamento', // Referencia o model 'Equipamento'
    },
    solicitante: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Usuario', // Referencia o model 'Usuario'
    },
    tecnicoResponsavel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario', // Também referencia 'Usuario'
    },
    historico: [historicoSchema],
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt
  }
);

const OrdemDeServico = mongoose.model('OrdemDeServico', ordemDeServicoSchema);

module.exports = OrdemDeServico;
