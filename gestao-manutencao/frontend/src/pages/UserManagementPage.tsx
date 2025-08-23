// frontend/src/pages/UserManagementPage.tsx

import { useState, useEffect } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  type User,
} from "../api/userService";
import Modal from "../components/Modal";

// Componente do formulário, definido no mesmo arquivo para simplicidade
const UserForm = ({
  initialData,
  onFormSubmit,
  onClose,
}: {
  initialData?: User | null;
  onFormSubmit: (data: any) => void;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    perfil: "funcionario" as User["perfil"],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome,
        email: initialData.email,
        senha: "", // Senha sempre começa em branco por segurança
        perfil: initialData.perfil,
      });
    } else {
      // Limpa o formulário se estiver criando um novo usuário
      setFormData({ nome: "", email: "", senha: "", perfil: "funcionario" });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação da senha para novos usuários
    if (!initialData && !formData.senha) {
      alert("A senha é obrigatória para novos usuários.");
      return;
    }

    // Se for um usuário existente e a senha estiver em branco, envia os dados sem ela
    if (initialData && !formData.senha) {
      const { senha, ...dataWithoutPassword } = formData;
      onFormSubmit(dataWithoutPassword);
    } else {
      // Para novos usuários ou se a senha foi preenchida na edição
      onFormSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium">Nome</label>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Senha</label>
        <input
          type="password"
          name="senha"
          value={formData.senha}
          onChange={handleChange}
          placeholder={initialData ? "Deixe em branco para não alterar" : ""}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Perfil</label>
        <select
          name="perfil"
          value={formData.perfil}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        >
          <option value="funcionario">Funcionário</option>
          <option value="tecnico">Técnico</option>
          <option value="admin">Administrador</option>
        </select>
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded-md"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Salvar
        </button>
      </div>
    </form>
  );
};

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      alert("Falha ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingUser) {
        await updateUser(editingUser._id, data);
      } else {
        await createUser(data);
      }
      fetchUsers();
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (error: any) {
      alert(
        "Erro ao salvar usuário: " +
          (error.response?.data?.message || "Erro desconhecido")
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja deletar este usuário?")) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (error) {
        alert("Falha ao deletar usuário.");
      }
    }
  };

  const handleOpenModal = (user: User | null = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const getProfileClass = (perfil: string) => {
    switch (perfil) {
      case "admin":
        return "bg-red-200 text-red-800";
      case "tecnico":
        return "bg-yellow-200 text-yellow-800";
      default:
        return "bg-green-200 text-green-800";
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Criar Novo Usuário
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <>
            {/* Tabela para Desktop */}
            <table className="min-w-full hidden md:table">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 text-left">Nome</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Perfil</th>
                  <th className="py-2 px-4 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="py-2 px-4">{user.nome}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">
                      {/* Usando exatamente a mesma estrutura do <span> que funciona */}
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getProfileClass(
                          user.perfil
                        )}`}
                      >
                        {user.perfil}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="text-blue-600 font-semibold mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 font-semibold"
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Lista de Cards para Mobile */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="bg-gray-50 p-4 rounded-lg shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-lg">{user.nome}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getProfileClass(
                        user.perfil
                      )}`}
                    >
                      {user.perfil}
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end gap-4">
                    <button
                      onClick={() => handleOpenModal(user)}
                      className="text-blue-600 font-semibold"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 font-semibold"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {users.length === 0 && (
              <p className="py-4 px-4 text-center text-gray-500">
                Nenhum usuário encontrado.
              </p>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? "Editar Usuário" : "Criar Novo Usuário"}
      >
        <UserForm
          initialData={editingUser}
          onFormSubmit={handleFormSubmit}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default UserManagementPage;
