// src/controllers/equipamentoController.js

const Equipamento = require('../models/Equipamento');

// @desc    Criar novo equipamento
// @route   POST /api/equipments
// @access  Private (Técnico, Admin)
const criarEquipamento = async (req, res) => {
  const { codigo, tipo, marca, modelo, localizacao, status, dataCompra } = req.body;

  const dadosParaCriar = {
    codigo, tipo, marca, modelo, localizacao
  };

  if (dataCompra) {
    dadosParaCriar.dataCompra = dataCompra;
  }

  try {
    const equipamentoExiste = await Equipamento.findOne({ codigo });
    if (equipamentoExiste) {
      return res.status(400).json({ message: 'Já existe um equipamento com este código.' });
    }

    const equipamento = await Equipamento.create(dadosParaCriar);

    res.status(201).json(equipamento);
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor: ' + error.message });
  }
};

// @desc    Listar todos os equipamentos
// @route   GET /api/equipments
// @access  Private (Autenticado)
const listarEquipamentos = async (req, res) => {
  try {
    // --- LÓGICA DE PAGINAÇÃO ---
    const limit = 10; // Itens por página
    const page = Number(req.query.page) || 1;

    // --- LÓGICA DE FILTRO ---
    const filtro = {};
    const { tipo, status, localizacao } = req.query;

    if (tipo) {
      filtro.tipo = tipo;
    }
    if (status) {
      filtro.status = status;
    }
    // Para localização, usamos uma regex para buscar textos que "contenham" a string
    if (localizacao) {
      filtro.localizacao = { $regex: localizacao, $options: 'i' }; // 'i' para case-insensitive
    }

    // Contamos o total de documentos que correspondem ao filtro
    const total = await Equipamento.countDocuments(filtro);

    // Buscamos a página específica de documentos
    const equipamentos = await Equipamento.find(filtro)
      .limit(limit)
      .skip(limit * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      equipamentos,
      page,
      pages: Math.ceil(total / limit),
      total,
    });

  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor: ' + error.message });
  }
};

// @desc    Buscar equipamento por ID
// @route   GET /api/equipments/:id
// @access  Private (Autenticado)
const buscarEquipamentoPorId = async (req, res) => {
    try {
        const equipamento = await Equipamento.findById(req.params.id);

        if (equipamento) {
            res.json(equipamento);
        } else {
            res.status(404).json({ message: 'Equipamento não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor: ' + error.message });
    }
};

// @desc    Atualizar um equipamento
// @route   PUT /api/equipments/:id
// @access  Private (Técnico, Admin)
const atualizarEquipamento = async (req, res) => {
    try {
        const equipamento = await Equipamento.findById(req.params.id);

        if (equipamento) {
            equipamento.codigo = req.body.codigo || equipamento.codigo;
            equipamento.tipo = req.body.tipo || equipamento.tipo;
            equipamento.marca = req.body.marca || equipamento.marca;
            equipamento.modelo = req.body.modelo || equipamento.modelo;
            equipamento.localizacao = req.body.localizacao || equipamento.localizacao;
            equipamento.status = req.body.status || equipamento.status;
            if (req.body.dataCompra !== undefined) {
              equipamento.dataCompra = req.body.dataCompra || null;
            }
            if (!equipamento.dataCompra) {
              equipamento.fimGarantia = null;
            }

            const equipamentoAtualizado = await equipamento.save();
            res.json(equipamentoAtualizado);
        } else {
            res.status(404).json({ message: 'Equipamento não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor: ' + error.message });
    }
};

// @desc    Deletar um equipamento
// @route   DELETE /api/equipments/:id
// @access  Private (Técnico, Admin)
const deletarEquipamento = async (req, res) => {
    try {
        const equipamento = await Equipamento.findById(req.params.id);

        if (equipamento) {
            await equipamento.deleteOne(); // ou .remove() em versões mais antigas do Mongoose
            res.json({ message: 'Equipamento removido com sucesso.' });
        } else {
            res.status(404).json({ message: 'Equipamento não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor: ' + error.message });
    }
};

// @desc    Listar todos os equipamentos operacionais para formulários
// @route   GET /api/equipments/list/operational
// @access  Private
const listarEquipamentosOperacionais = async (req, res) => {
  try {
    const equipamentos = await Equipamento.find({ status: 'operacional' }).sort({ codigo: 1 });
    res.json(equipamentos);
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor: ' + error.message });
  }
};

module.exports = {
  criarEquipamento,
  listarEquipamentos,
  buscarEquipamentoPorId,
  atualizarEquipamento,
  deletarEquipamento,
  listarEquipamentosOperacionais
};
