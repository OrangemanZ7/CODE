// frontend/src/pages/WorkOrderDetailPage.tsx

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrdemDeServicoById, updateOrdemDeServico, type OrdemDeServico } from '../api/ordemDeServicoService';
import { getTechnicians, type Technician } from '../api/userService';
import Modal from '../components/Modal';

const WorkOrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [os, setOs] = useState<OrdemDeServico | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [selectedPrioridade, setSelectedPrioridade] = useState('');

  const [notification, setNotification] = useState({
    isOpen: false,
    message: '',
    type: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    if (!id) return;

    const fetchAllData = async () => {
      try {
        const osData = await getOrdemDeServicoById(id);
        setOs(osData);
        setSelectedStatus(osData.status);
        setSelectedTechnician(osData.tecnicoResponsavel?._id || '');

        if (auth?.perfil === 'admin' || auth?.perfil === 'tecnico') {
          const techsData = await getTechnicians();
          setTechnicians(techsData);
        }
      } catch (err) {
        setError('Não foi possível carregar os dados.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [id, auth?.perfil]);

  const handleUpdate = async () => {
    if (!id) return;
    try {
      const updatedOs = await updateOrdemDeServico(id, {
        status: selectedStatus,
        prioridade: selectedPrioridade,
        tecnicoId: selectedTechnician,
      });
      setOs(updatedOs);
      setNotification({
        isOpen: true,
        message: 'Ordem de Serviço atualizada com sucesso!',
        type: 'success',
      });
    } catch (error) {
      setNotification({
        isOpen: true,
        message: 'Falha ao atualizar a Ordem de Serviço.',
        type: 'error',
      });
    }
  };
  
  const handleCloseNotification = () => {
    const success = notification.type === 'success';
    setNotification({ ...notification, isOpen: false });
    if (success) {
      navigate('/workorders');
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!os) return <div className="p-8 text-center">Ordem de Serviço não encontrada.</div>;

  const isManager = auth?.perfil === 'admin' || auth?.perfil === 'tecnico';

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <Link to="/workorders" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Voltar</Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Coluna Principal com Detalhes e Histórico */}
        <div className="lg:col-span-2 space-y-8">

          {/* Card de Detalhes da OS */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{os.titulo}</h1>
                    <p className="text-gray-500">Aberta em: {new Date(os.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold">Prioridade: <span className="text-orange-600 capitalize">{os.prioridade}</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-bold border-b pb-2 mb-4">Detalhes do Chamado</h2>
                    <p className="text-gray-700 whitespace-pre-wrap">{os.descricao}</p>
                    
                    <div className="mt-6">
                        <h3 className="font-semibold">Solicitante:</h3>
                        <p>{os.solicitante?.nome || 'N/A'} ({os.solicitante?.email || 'N/A'})</p>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold border-b pb-2 mb-4">Equipamento</h2>
                    <p><span className="font-semibold">Código:</span> {os.equipamento?.codigo}</p>
                    <p><span className="font-semibold">Tipo:</span> {os.equipamento?.tipo}</p>
                    <p><span className="font-semibold">Marca/Modelo:</span> {`${os.equipamento?.marca || ''} ${os.equipamento?.modelo || ''}`.trim() || 'N/A'}</p>
                    <p><span className="font-semibold">Localização:</span> {os.equipamento?.localizacao}</p>
                </div>
            </div>
          </div>

          {/* Card de Histórico de Alterações */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Histórico de Alterações</h2>
            <div className="space-y-4">
              {os.historico && os.historico.length > 0 ? (
                os.historico.slice().reverse().map((item, index) => (
                  <div key={index} className="border-l-4 pl-4 border-gray-200">
                    <p className="font-semibold">{item.acao}</p>
                    <p className="text-sm text-gray-500">
                      Por: {item.usuario} em {new Date(item.data).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Nenhuma alteração registrada.</p>
              )}
            </div>
          </div>
        </div>

        {/* Coluna Lateral de Gerenciamento */}
        {isManager && (
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold border-b pb-2 mb-4">Gerenciar Chamado</h2>
              
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Alterar Status</label>
                <select 
                  id="status" 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm capitalize"
                >
                  <option value="aberto">Aberto</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="aguardando_peca">Aguardando Peça</option>
                  <option value="concluido">Concluído</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700">Alterar Prioridade</label>
                <select 
                  id="prioridade"
                  value={selectedPrioridade}
                  onChange={(e) => setSelectedPrioridade(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm capitalize"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="technician" className="block text-sm font-medium text-gray-700">Atribuir Técnico</label>
                <select 
                  id="technician"
                  value={selectedTechnician}
                  onChange={(e) => setSelectedTechnician(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">Não atribuído</option>
                  {technicians.map(tech => (
                    <option key={tech._id} value={tech._id}>{tech.nome}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleUpdate}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Atualizar Chamado
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Notificação */}
      <Modal
        isOpen={notification.isOpen}
        onClose={handleCloseNotification}
        title={notification.type === 'success' ? 'Sucesso!' : 'Erro!'}
      >
        <div>
          <p className={`text-lg ${notification.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
            {notification.message}
          </p>
          <div className="flex justify-end mt-6">
            <button
              onClick={handleCloseNotification}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WorkOrderDetailPage;
