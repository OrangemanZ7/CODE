// src/models/Equipamento.js

const mongoose = require('mongoose');

const equipamentoSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      required: [true, 'O código de identificação é obrigatório.'],
      unique: true,
      trim: true, // Remove espaços em branco do início e do fim
    },
    tipo: {
      type: String,
      required: [true, 'O tipo do equipamento é obrigatório.'],
      enum: ['Desktop', 'Notebook', 'Projetor', 'Impressora', 'Monitor', 'Outro'],
    },
    marca: {
      type: String,
      required: false,
    },
    modelo: {
      type: String,
      required: false,
    },
    localizacao: {
      type: String,
      required: [true, 'A localização é obrigatória.'],
    },
    status: {
      type: String,
      required: true,
      enum: ['operacional', 'em_manutencao', 'descartado'],
      default: 'operacional',
    },
    dataCompra: { type: Date },
    fimGarantia: { type: Date },
  },
  {
    timestamps: true,
  }
);

equipamentoSchema.pre('save', function (next) {
  // Se a data de compra for modificada e não houver data de fim de garantia explícita,
  // calcula a garantia para 12 meses.
  if (this.isModified('dataCompra') && this.dataCompra && !this.fimGarantia) {
    const dataCompra = new Date(this.dataCompra);
    this.fimGarantia = new Date(dataCompra.setMonth(dataCompra.getMonth() + 12));
  }
  next();
});

const Equipamento = mongoose.model('Equipamento', equipamentoSchema);

module.exports = Equipamento;
