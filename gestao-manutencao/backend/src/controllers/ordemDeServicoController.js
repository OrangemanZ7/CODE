// src/controllers/ordemDeServicoController.js

const OrdemDeServico = require('../models/OrdemDeServico');
const Equipamento = require('../models/Equipamento');
const Usuario = require('../models/Usuario');

// @desc    Abrir uma nova Ordem de Serviço
// @route   POST /api/workorders
// @access  Private (Qualquer usuário logado)
const abrirOrdemDeServico = async (req, res) => {
  const { titulo, descricao, prioridade, equipamentoId } = req.body;

  try {
    const equipamento = await Equipamento.findById(equipamentoId);
    if (!equipamento) {
      return res.status(404).json({ message: 'Equipamento não encontrado.' });
    }

    const os = await OrdemDeServico.create({
      titulo,
      descricao,
      prioridade,
      equipamento: equipamentoId,
      solicitante: req.usuario._id, // ID vem do middleware 'protect'
      historico: [{
        usuario: req.usuario.nome,
        acao: 'Ordem de serviço aberta.',
      }],
    });

    // Atualiza o status do equipamento para "em manutenção"
    equipamento.status = 'em_manutencao';
    await equipamento.save();

    const osCriada = await OrdemDeServico.findById(os._id)
      .populate('equipamento', 'codigo tipo localizacao')
      .populate('solicitante', 'nome email');
    
    res.status(201).json(osCriada);

  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor: ' + error.message });
  }
};

// @desc    Listar Ordens de Serviço
// @route   GET /api/workorders
// @access  Private
const listarOrdensDeServico = async (req, res) => {
  try {
    // --- LÓGICA DE PAGINAÇÃO ---
    const limit = 10; // Itens por página
    const page = Number(req.query.page) || 1; // Página atual, padrão é 1

    // --- LÓGICA DE FILTRO ---
    const filtro = {};

    if (req.usuario.perfil === 'funcionario') {
      filtro.solicitante = req.usuario._id;
    }

    const { status, prioridade, hideCompleted } = req.query;
    if (status) {
      filtro.status = status;
    }
    if (prioridade) {
      filtro.prioridade = prioridade;
    }
    // Novo filtro para o checkbox
    if (hideCompleted === 'true' && !status) { // Só aplica se um status específico não for selecionado
      filtro.status = { $nin: ['concluido', 'cancelado'] };
    }

    // Primeiro, contamos o total de documentos que correspondem ao filtro
    const total = await OrdemDeServico.countDocuments(filtro);

    // Depois, buscamos a página específica de documentos
    const ordens = await OrdemDeServico.find(filtro)
      .limit(limit)
      .skip(limit * (page - 1)) // Pula os documentos das páginas anteriores
      .populate('equipamento', 'codigo tipo localizacao')
      .populate('solicitante', 'nome email')
      .populate('tecnicoResponsavel', 'nome email')
      .sort({ createdAt: -1 });

    // Retornamos os dados junto com as informações de paginação
    res.json({
      ordens,
      page,
      pages: Math.ceil(total / limit), // Calcula o número total de páginas
      total,
    });

  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor: ' + error.message });
  }
};

// @desc    Atualizar uma Ordem de Serviço (atribuir, mudar status, etc.)
// @route   PUT /api/workorders/:id
// @access  Private (Técnico, Admin)
const atualizarOrdemDeServico = async (req, res) => {
    try {
        const { status, tecnicoId, prioridade } = req.body;
        const os = await OrdemDeServico.findById(req.params.id);

        if (!os) {
            return res.status(404).json({ message: 'Ordem de serviço não encontrada.' });
        }
        
        const acaoHistorico = [];

        if (status && status !== os.status) {
            acaoHistorico.push(`Status alterado para "${status.replace('_', ' ')}".`);
            os.status = status;

            const equipamento = await Equipamento.findById(os.equipamento);
            if (equipamento) {
                if (status === 'concluido' || status === 'cancelado') {
                    equipamento.status = 'operacional';
                } else {
                    equipamento.status = 'em_manutencao';
                }
                await equipamento.save();
            }
        }

        if (prioridade && prioridade !== os.prioridade) {
            acaoHistorico.push(`Prioridade alterada para "${prioridade}".`);
            os.prioridade = prioridade;
        }

        if (tecnicoId !== undefined) {
            const tecnicoAnterior = os.tecnicoResponsavel ? os.tecnicoResponsavel.toString() : "";
            
            if (tecnicoId !== tecnicoAnterior) {
                if (tecnicoId) { // Se um ID foi fornecido
                    // --- CORREÇÃO APLICADA AQUI ---
                    const tecnico = await Usuario.findById(tecnicoId);
                    if (tecnico) { // Verifica se o técnico foi encontrado
                        acaoHistorico.push(`Atribuído ao técnico "${tecnico.nome}".`);
                        os.tecnicoResponsavel = tecnicoId;
                    } else {
                        // Opcional: lidar com o caso de um ID inválido. Por agora, apenas não fazemos nada.
                        console.log(`Tentativa de atribuir OS a um técnico inexistente com ID: ${tecnicoId}`);
                    }
                } else { // Se tecnicoId for uma string vazia ("")
                    acaoHistorico.push(`Técnico removido.`);
                    os.tecnicoResponsavel = null;
                }
            }
        }
        
        if (acaoHistorico.length > 0) {
            os.historico.push({
                usuario: req.usuario.nome,
                acao: acaoHistorico.join(' '),
            });
        }
        
        const osAtualizada = await os.save();
        const osPopulada = await OrdemDeServico.findById(osAtualizada._id)
            .populate('equipamento', 'codigo tipo localizacao marca modelo')
            .populate('solicitante', 'nome email')
            .populate('tecnicoResponsavel', 'nome email');
            
        res.json(osPopulada);

    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor: ' + error.message });
    }
};

// @desc    Abrir uma OS
// @route   GET /api/workorders/:id
// @access  Private
const buscarOrdemDeServicoPorId = async (req, res) => {
  try {
    const os = await OrdemDeServico.findById(req.params.id)
      .populate('equipamento', 'codigo tipo localizacao marca modelo')
      .populate('solicitante', 'nome email')
      .populate('tecnicoResponsavel', 'nome email');

    if (!os) {
      return res.status(404).json({ message: 'Ordem de serviço não encontrada.' });
    }

    // Lógica de permissão: Funcionários só podem ver as próprias OS
    if (req.usuario.perfil === 'funcionario' && os.solicitante._id.toString() !== req.usuario._id.toString()) {
        return res.status(403).json({ message: 'Acesso negado.' });
    }

    res.json(os);
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor: ' + error.message });
  }
};

// @desc    Listar o histórico de OS de um equipamento específico
// @route   GET /api/workorders/history/:equipmentId
// @access  Private
const getHistoricoPorEquipamento = async (req, res) => {
  try {
    const historico = await OrdemDeServico.find({ equipamento: req.params.equipmentId })
      .populate('solicitante', 'nome')
      .populate('tecnicoResponsavel', 'nome')
      .sort({ createdAt: -1 });

    res.json(historico);
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor: ' + error.message });
  }
};

module.exports = {
  abrirOrdemDeServico,
  listarOrdensDeServico,
  atualizarOrdemDeServico,
  buscarOrdemDeServicoPorId,
  getHistoricoPorEquipamento
};
