// frontend/src/pages/EquipamentoDetailPage.tsx

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getEquipamentoById,
  updateEquipamento,
  deleteEquipamento,
  type Equipamento,
} from "../api/equipamentoService";
import {
  getHistoryForEquipment,
  type OrdemDeServico,
} from "../api/ordemDeServicoService";
import Modal from "../components/Modal";
import EquipamentoForm from "../components/EquipamentoForm";

const EquipamentoDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [equipamento, setEquipamento] = useState<Equipamento | null>(null);
  const [historico, setHistorico] = useState<OrdemDeServico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const fetchAllData = async () => {
    if (!id) return;
    // Não seta loading para true aqui para uma atualização mais suave
    try {
      const [equipData, historyData] = await Promise.all([
        getEquipamentoById(id),
        getHistoryForEquipment(id),
      ]);
      setEquipamento(equipData);
      setHistorico(historyData);
    } catch (err) {
      setError("Não foi possível carregar os dados do equipamento.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAllData();
  }, [id]);

  const handleFormSubmit = async (formData: any) => {
    if (!equipamento) return;
    try {
      await updateEquipamento(equipamento._id, formData);
      setNotification({
        isOpen: true,
        message: "Equipamento atualizado com sucesso!",
        type: "success",
      });
      setIsFormModalOpen(false);
      fetchAllData();
    } catch (error: any) {
      setNotification({
        isOpen: true,
        message:
          "Erro ao atualizar equipamento: " +
          (error.response?.data?.message || "Erro desconhecido"),
        type: "error",
      });
    }
  };

  const handleDeletarEquipamento = async () => {
    if (!equipamento) return;
    if (
      window.confirm(
        "Tem certeza que deseja deletar este equipamento? Esta ação não pode ser desfeita."
      )
    ) {
      try {
        await deleteEquipamento(equipamento._id);
        alert("Equipamento deletado com sucesso!");
        navigate("/equipamentos");
      } catch (error) {
        setNotification({
          isOpen: true,
          message: "Falha ao deletar equipamento.",
          type: "error",
        });
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!equipamento)
    return <div className="p-8 text-center">Equipamento não encontrado.</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <Link
          to="/equipamentos"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Voltar
        </Link>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row justify-between md:items-start mb-4">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">
            Ficha do Equipamento: {equipamento.codigo}
          </h1>
          {auth?.perfil === "admin" && (
            <div className="flex gap-4">
              <button
                onClick={() => setIsFormModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Editar
              </button>
              <button
                onClick={handleDeletarEquipamento}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Deletar
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <p>
            <span className="font-semibold">Tipo:</span> {equipamento.tipo}
          </p>
          <p>
            <span className="font-semibold">Localização:</span>{" "}
            {equipamento.localizacao}
          </p>
          <p>
            <span className="font-semibold">Marca:</span>{" "}
            {equipamento.marca || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Modelo:</span>{" "}
            {equipamento.modelo || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            <span className="capitalize font-medium">
              {equipamento.status.replace("_", " ")}
            </span>
          </p>
          <p>
            <span className="font-semibold">Data de Compra:</span>{" "}
            {equipamento.dataCompra
              ? new Date(equipamento.dataCompra).toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                })
              : "N/A"}
          </p>
          <p>
            <span className="font-semibold text-red-600">Fim da Garantia:</span>{" "}
            {equipamento.fimGarantia
              ? new Date(equipamento.fimGarantia).toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                })
              : "N/A"}
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          Histórico de Ordens de Serviço
        </h2>
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
                historico.map((os) => (
                  <tr key={os._id} className="border-b">
                    <td className="py-2 px-4">
                      {new Date(os.createdAt).toLocaleDateString("pt-BR", {
                        timeZone: "UTC",
                      })}
                    </td>
                    <td className="py-2 px-4">{os.titulo}</td>
                    <td className="py-2 px-4 capitalize">
                      {os.status.replace("_", " ")}
                    </td>
                    <td className="py-2 px-4">
                      {os.tecnicoResponsavel?.nome || "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 px-4 text-center text-gray-500"
                  >
                    Nenhum chamado de manutenção registrado para este
                    equipamento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title="Editar Equipamento"
      >
        <EquipamentoForm
          initialData={equipamento}
          onFormSubmit={handleFormSubmit}
          onClose={() => setIsFormModalOpen(false)}
        />
      </Modal>
      <Modal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        title={notification.type === "success" ? "Sucesso" : "Erro"}
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

export default EquipamentoDetailPage;
