// frontend/src/pages/EquipamentoDetailPage.tsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEquipamentoById, type Equipamento } from '../api/equipamentoService';
import { getHistoryForEquipment, type OrdemDeServico } from '../api/ordemDeServicoService';

const EquipamentoDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  
  const [equipamento, setEquipamento] = useState<Equipamento | null>(null);
  const [historico, setHistorico] = useState<OrdemDeServico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchAllData = async () => {
      try {
        // Busca os dados em paralelo para mais performance
        const [equipData, historyData] = await Promise.all([
          getEquipamentoById(id),
          getHistoryForEquipment(id)
        ]);
        setEquipamento(equipData);
        setHistorico(historyData);
      } catch (err) {
        setError('Não foi possível carregar os dados do equipamento.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!equipamento) return <div className="p-8 text-center">Equipamento não encontrado.</div>;

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
          <Link to="/equipamentos" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Voltar</Link>
      </div>

      {/* Card de Detalhes do Equipamento */}
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl font-bold mb-4">Ficha do Equipamento: {equipamento.codigo}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <p><span className="font-semibold">Tipo:</span> {equipamento.tipo}</p>
          <p><span className="font-semibold">Localização:</span> {equipamento.localizacao}</p>
          <p><span className="font-semibold">Marca:</span> {equipamento.marca || 'N/A'}</p>
          <p><span className="font-semibold">Modelo:</span> {equipamento.modelo || 'N/A'}</p>
          <p><span className="font-semibold">Status:</span> <span className="capitalize font-medium">{equipamento.status.replace('_', ' ')}</span></p>
          <p><span className="font-semibold">Data de Compra:</span> {equipamento.dataCompra ? new Date(equipamento.dataCompra).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/A'}</p>
          <p><span className="font-semibold text-red-600">Fim da Garantia:</span> {equipamento.fimGarantia ? new Date(equipamento.fimGarantia).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/A'}</p>
        </div>
      </div>

      {/* Card do Histórico de Manutenção */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Histórico de Ordens de Serviço</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Data</th>
                <th className="py-2 px-4 text-left">Título</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Técnico</th>
              </tr>
            </thead>
            <tbody>
              {historico.length > 0 ? (
                historico.map(os => (
                  <tr key={os._id} className="border-b">
                    <td className="py-2 px-4">{new Date(os.createdAt).toLocaleDateString()}</td>
                    <td className="py-2 px-4">{os.titulo}</td>
                    <td className="py-2 px-4 capitalize">{os.status.replace('_', ' ')}</td>
                    <td className="py-2 px-4">{os.tecnicoResponsavel?.nome || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                    Nenhum chamado de manutenção registrado para este equipamento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EquipamentoDetailPage;
