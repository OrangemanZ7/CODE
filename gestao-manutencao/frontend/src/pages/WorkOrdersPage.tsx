// frontend/src/pages/WorkOrdersPage.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getOrdensDeServico,
  createOrdemDeServico,
  type OrdemDeServico,
  type CreateOrdemDeServicoData,
} from "../api/ordemDeServicoService";
import Modal from "../components/Modal";
import OrdemDeServicoForm from "../components/OrdemDeServicoForm";

const WorkOrdersPage = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ordens, setOrdens] = useState<OrdemDeServico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados dos filtros
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroPrioridade, setFiltroPrioridade] = useState("");
  const [hideCompleted, setHideCompleted] = useState(true);

  // Estados da paginação
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrdens = async () => {
      setLoading(true);
      setError(null);
      try {
        const filtrosParaApi = {
          status: filtroStatus || undefined,
          prioridade: filtroPrioridade || undefined,
          hideCompleted: hideCompleted,
          page: page,
        };
        const data = await getOrdensDeServico(filtrosParaApi);
        setOrdens(data.ordens);
        setTotalPages(data.pages);
      } catch (err) {
        setError("Não foi possível carregar as ordens de serviço.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrdens();
  }, [filtroStatus, filtroPrioridade, page, hideCompleted]);

  const handleFormSubmit = async (formData: CreateOrdemDeServicoData) => {
    try {
      const novaOS = await createOrdemDeServico(formData);
      // Ao criar, limpa os filtros e volta para a primeira página para ver a nova OS
      setFiltroStatus("");
      setFiltroPrioridade("");
      setHideCompleted(true);
      setPage(1);
      // Adiciona a nova OS à lista (será atualizada de qualquer forma pelo useEffect)
      setOrdens((prev) => [novaOS, ...prev]);
      setIsModalOpen(false);
    } catch (error: any) {
      alert(
        "Erro ao abrir Ordem de Serviço: " +
          (error.response?.data?.message || "Erro desconhecido")
      );
    }
  };

  const limparFiltros = () => {
    setFiltroStatus("");
    setFiltroPrioridade("");
    setHideCompleted(true);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "aberto":
        return "bg-blue-200 text-blue-800";
      case "em_andamento":
        return "bg-yellow-200 text-yellow-800";
      case "concluido":
        return "bg-green-200 text-green-800";
      case "cancelado":
        return "bg-gray-200 text-gray-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Ordens de Serviço</h1>
        {auth && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Abrir Nova OS
          </button>
        )}
      </div>

      {/* --- PAINEL DE FILTROS COMPLETO E CORRIGIDO --- */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-wrap items-center gap-x-8 gap-y-4">
        <span className="font-semibold">Filtrar por:</span>
        {/* Filtro de Status */}
        <div>
          <label htmlFor="filtro-status" className="sr-only">
            Status
          </label>
          <select
            id="filtro-status"
            value={filtroStatus}
            onChange={(e) => {
              setFiltroStatus(e.target.value);
              setPage(1);
            }} // Reseta a página ao mudar o filtro
            className="border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500"
          >
            <option value="">Todos os Status</option>
            <option value="aberto">Aberto</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="aguardando_peca">Aguardando Peça</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
        {/* Filtro de Prioridade */}
        <div>
          <label htmlFor="filtro-prioridade" className="sr-only">
            Prioridade
          </label>
          <select
            id="filtro-prioridade"
            value={filtroPrioridade}
            onChange={(e) => {
              setFiltroPrioridade(e.target.value);
              setPage(1);
            }} // Reseta a página ao mudar o filtro
            className="border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500"
          >
            <option value="">Todas as Prioridades</option>
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
        </div>

        {/* Checkbox para ocultar concluídas */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hide-completed"
            checked={hideCompleted}
            onChange={(e) => {
              setHideCompleted(e.target.checked);
              setPage(1);
            }} // Reseta a página ao mudar o filtro
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="hide-completed"
            className="ml-2 block text-sm text-gray-900"
          >
            Ocultar concluídas/canceladas
          </label>
        </div>

        <button
          onClick={limparFiltros}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Limpar Filtros
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="overflow-x-auto hidden md:block">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-2 px-4 text-left">Título</th>
                    <th className="py-2 px-4 text-left">Equipamento</th>
                    <th className="py-2 px-4 text-left">Solicitante</th>
                    <th className="py-2 px-4 text-left">Status</th>
                    <th className="py-2 px-4 text-left">Prioridade</th>
                    <th className="py-2 px-4 text-left">Técnico Atribuído</th>
                    <th className="py-2 px-4 text-left">Data Abertura</th>
                  </tr>
                </thead>
                <tbody>
                  {ordens.length > 0 && (
                    ordens.map((os) => (
                      <tr
                        key={os._id}
                        className="border-b hover:bg-gray-100 cursor-pointer"
                        onClick={() => navigate(`/workorders/${os._id}`)}
                      >
                        <td className="py-2 px-4 font-medium">{os.titulo}</td>
                        <td className="py-2 px-4">
                          {os.equipamento?.codigo || (
                            <span className="text-sm text-red-600">
                              Equipamento Deletado
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-4">
                          {os.solicitante?.nome || (
                            <span className="text-sm text-red-600">
                              Usuário Deletado
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-4 capitalize">
                          {os.status.replace("_", " ")}
                        </td>
                        <td className="py-2 px-4 capitalize">
                          {os.prioridade}
                        </td>
                        <td className="py-2 px-4">
                          {os.tecnicoResponsavel?.nome || (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="py-2 px-4">
                          {new Date(os.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 gap-4 md:hidden">
              {ordens.map((os) => (
                <div
                  key={os._id}
                  className="bg-gray-50 p-4 rounded-lg shadow"
                  onClick={() => navigate(`/workorders/${os._id}`)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-lg truncate">{os.titulo}</p>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(
                        os.status
                      )}`}
                    >
                      {os.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-semibold">Equipamento:</span>{" "}
                      {os.equipamento?.codigo}
                    </p>
                    <p>
                      <span className="font-semibold">Prioridade:</span>{" "}
                      <span className="capitalize">{os.prioridade}</span>
                    </p>
                    <p>
                      <span className="font-semibold">Técnico:</span>{" "}
                      {os.tecnicoResponsavel?.nome || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500 pt-2">
                      Aberta em: {new Date(os.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {ordens.length === 0 && (
              <p className="py-4 px-4 text-center text-gray-500">
                Nenhuma ordem de serviço encontrada com os filtros atuais.
              </p>
            )}

            {ordens.length > 0 && totalPages > 1 && (
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span>
                  Página {page} de {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Abrir Nova Ordem de Serviço"
      >
        <OrdemDeServicoForm
          onFormSubmit={handleFormSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default WorkOrdersPage;
