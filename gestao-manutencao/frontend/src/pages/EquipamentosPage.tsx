// frontend/src/pages/DashboardPage.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getEquipamentos,
  createEquipamento,
  updateEquipamento,
  deleteEquipamento,
  type Equipamento,
} from "../api/equipamentoService";
import Modal from "../components/Modal";
import EquipamentoForm from "../components/EquipamentoForm";

const EquipamentosPage = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [equipamentoEmEdicao, setEquipamentoEmEdicao] =
    useState<Equipamento | null>(null);

  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroLocalizacao, setFiltroLocalizacao] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEquipamentos = async () => {
    setLoading(true);
    setError(null);
    try {
      const filtrosParaApi = {
        tipo: filtroTipo || undefined,
        status: filtroStatus || undefined,
        localizacao: filtroLocalizacao || undefined,
        page: page,
      };
      const data = await getEquipamentos(filtrosParaApi);
      setEquipamentos(data.equipamentos);
      setTotalPages(data.pages);
    } catch (err) {
      setError("Não foi possível carregar os equipamentos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipamentos();
  }, [filtroTipo, filtroStatus, filtroLocalizacao, page]);

  const handleOpenModal = (equipamento: Equipamento | null = null) => {
    setEquipamentoEmEdicao(equipamento);
    setIsFormModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsFormModalOpen(false);
    setEquipamentoEmEdicao(null);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (equipamentoEmEdicao) {
        await updateEquipamento(equipamentoEmEdicao._id, formData);
        setNotification({
          isOpen: true,
          message: "Equipamento atualizado com sucesso!",
          type: "success",
        });
      } else {
        await createEquipamento(formData);
        setNotification({
          isOpen: true,
          message: "Equipamento cadastrado com sucesso!",
          type: "success",
        });
      }
      fetchEquipamentos();
      handleCloseModal();
    } catch (error: any) {
      setNotification({
        isOpen: true,
        message:
          "Erro ao salvar equipamento: " +
          (error.response?.data?.message || "Erro desconhecido"),
        type: "error",
      });
    }
  };

  const handleDeletarEquipamento = async (id: string) => {
    if (window.confirm("Tem certeza que deseja deletar este equipamento?")) {
      try {
        await deleteEquipamento(id);
        setNotification({
          isOpen: true,
          message: "Equipamento deletado com sucesso!",
          type: "success",
        });
        fetchEquipamentos();
      } catch (error) {
        setNotification({
          isOpen: true,
          message: "Falha ao deletar equipamento.",
          type: "error",
        });
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const limparFiltros = () => {
    setFiltroTipo("");
    setFiltroStatus("");
    setFiltroLocalizacao("");
    setPage(1);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "em_manutencao":
        return "bg-yellow-200 text-yellow-800";
      case "operacional":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Equipamentos</h1>
        {(auth?.perfil === "admin" || auth?.perfil === "tecnico") && (
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Cadastrar Equipamento
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-wrap items-center gap-x-6 gap-y-4">
        <span className="font-semibold">Filtrar por:</span>
        <input
          type="text"
          placeholder="Buscar por localização..."
          value={filtroLocalizacao}
          onChange={(e) => {
            setFiltroLocalizacao(e.target.value);
            setPage(1);
          }}
          className="border-gray-300 rounded-md shadow-sm p-2"
        />
        <select
          value={filtroTipo}
          onChange={(e) => {
            setFiltroTipo(e.target.value);
            setPage(1);
          }}
          className="border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="">Todos os Tipos</option>
          <option>Desktop</option>
          <option>Notebook</option>
          <option>Projetor</option>
          <option>Impressora</option>
          <option>Monitor</option>
          <option>Outro</option>
        </select>
        <select
          value={filtroStatus}
          onChange={(e) => {
            setFiltroStatus(e.target.value);
            setPage(1);
          }}
          className="border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="">Todos os Status</option>
          <option value="operacional">Operacional</option>
          <option value="em_manutencao">Em Manutenção</option>
          <option value="descartado">Descartado</option>
        </select>
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
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white hidden md:table">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-2 px-4 text-left">Código</th>
                    <th className="py-2 px-4 text-left">Tipo</th>
                    <th className="py-2 px-4 text-left">Localização</th>
                    <th className="py-2 px-4 text-left">Data de Compra</th>
                    <th className="py-2 px-4 text-left">Fim da Garantia</th>
                    <th className="py-2 px-4 text-left">Status</th>
                    {(auth?.perfil === "admin" ||
                      auth?.perfil === "tecnico") && (
                      <th className="py-2 px-4 text-left">Ações</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {equipamentos.length > 0 ? (
                    equipamentos.map((equip) => (
                      <tr
                        key={equip._id}
                        className="border-b hover:bg-gray-100"
                        onClick={() => navigate(`/equipamentos/${equip._id}`)}
                      >
                        <td className="py-2 px-4 font-medium">
                          {equip.codigo}
                        </td>
                        <td className="py-2 px-4">{equip.tipo}</td>
                        <td className="py-2 px-4">{equip.localizacao}</td>
                        <td className="py-2 px-4">
                          {equip.dataCompra
                            ? new Date(equip.dataCompra).toLocaleDateString(
                                "pt-BR",
                                { timeZone: "UTC" }
                              )
                            : "N/A"}
                        </td>
                        <td className="py-2 px-4">
                          {equip.fimGarantia
                            ? new Date(equip.fimGarantia).toLocaleDateString(
                                "pt-BR",
                                { timeZone: "UTC" }
                              )
                            : "N/A"}
                        </td>
                        <td className="py-2 px-4">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              equip.status === "operacional"
                                ? "bg-green-200 text-green-800"
                                : equip.status === "em_manutencao"
                                ? "bg-yellow-200 text-yellow-800"
                                : "bg-red-200 text-red-800"
                            }`}
                          >
                            {equip.status.replace("_", " ")}
                          </span>
                        </td>
                        {(auth?.perfil === "admin" ||
                          auth?.perfil === "tecnico") && (
                          <td className="py-2 px-4">
                            <button
                              onClick={() => handleOpenModal(equip)}
                              className="text-blue-600 hover:text-blue-800 font-semibold mr-4"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() =>
                                handleDeletarEquipamento(equip._id)
                              }
                              className="text-red-600 hover:text-red-800 font-semibold"
                            >
                              Deletar
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={auth?.perfil === "funcionario" ? 4 : 5}
                        className="py-4 px-4 text-center text-gray-500"
                      >
                        Nenhum equipamento encontrado com os filtros atuais.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="grid grid-cols-1 gap-4 md:hidden">
                {equipamentos.map((equip) => (
                  <div
                    key={equip._id}
                    className="bg-gray-50 p-4 rounded-lg shadow"
                    onClick={() => navigate(`/equipamentos/${equip._id}`)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-bold text-lg">{equip.codigo}</p>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(
                          equip.status
                        )}`}
                      >
                        {equip.status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-semibold">Tipo:</span>{" "}
                        {equip.tipo}
                      </p>
                      <p>
                        <span className="font-semibold">Localização:</span>{" "}
                        {equip.localizacao}
                      </p>
                    </div>
                    {(auth?.perfil === "admin" ||
                      auth?.perfil === "tecnico") && (
                      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(equip);
                          }}
                          className="text-blue-600 font-semibold"
                        >
                          Editar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletarEquipamento(equip._id);
                          }}
                          className="text-red-600 font-semibold"
                        >
                          Deletar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {equipamentos.length === 0 && (
              <p className="py-4 px-4 text-center text-gray-500">
                Nenhum equipamento encontrado com os filtros atuais.
              </p>
            )}

            {equipamentos.length > 0 && totalPages > 1 && (
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
        isOpen={isFormModalOpen}
        onClose={handleCloseModal}
        title={
          equipamentoEmEdicao
            ? "Editar Equipamento"
            : "Cadastrar Novo Equipamento"
        }
      >
        <EquipamentoForm
          initialData={equipamentoEmEdicao}
          onFormSubmit={handleFormSubmit}
          onClose={handleCloseModal}
        />
      </Modal>

      <Modal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        title={notification.type === "success" ? "Sucesso!" : "Erro!"}
      >
        <div>
          <p
            className={`text-lg ${
              notification.type === "success"
                ? "text-green-700"
                : "text-red-700"
            }`}
          >
            {notification.message}
          </p>
          <div className="flex justify-end mt-6">
            <button
              onClick={() =>
                setNotification({ ...notification, isOpen: false })
              }
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

export default EquipamentosPage;
