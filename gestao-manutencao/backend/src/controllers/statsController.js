// backend/src/controllers/statsController.js

const Equipamento = require('../models/Equipamento');
const OrdemDeServico = require('../models/OrdemDeServico');

// @desc    Buscar estatísticas para o dashboard principal
// @route   GET /api/stats/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        // Usamos Promise.all para executar todas as contagens no banco de dados em paralelo
        const [
            totalEquipamentos,
            equipamentosEmManutencao,
            osAbertas,
            osPrioridadeAlta
        ] = await Promise.all([
            Equipamento.countDocuments({}),
            Equipamento.countDocuments({ status: 'em_manutencao' }),
            OrdemDeServico.countDocuments({ status: { $in: ['aberto', 'em_andamento', 'aguardando_peca'] } }),
            OrdemDeServico.countDocuments({ status: 'aberto', prioridade: 'alta' }) // Contando OS abertas com prioridade alta
        ]);

        res.json({
            totalEquipamentos,
            equipamentosEmManutencao,
            osAbertas,
            osPrioridadeAlta,
        });

    } catch (error) {
        res.status(500).json({ message: "Erro no servidor ao buscar estatísticas: " + error.message });
    }
};

module.exports = {
    getDashboardStats,
};
