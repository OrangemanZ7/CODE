// frontend/src/components/OrdemDeServicoForm.tsx

import React, { useState, useEffect } from 'react';
// --- ALTERADO AQUI ---
import { getOperationalEquipments, type Equipamento } from '../api/equipamentoService';
import { type CreateOrdemDeServicoData } from '../api/ordemDeServicoService';

interface OrdemDeServicoFormProps {
  onFormSubmit: (data: CreateOrdemDeServicoData) => void;
  onClose: () => void;
}

const OrdemDeServicoForm: React.FC<OrdemDeServicoFormProps> = ({ onFormSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'baixa' as 'baixa' | 'media' | 'alta',
    equipamentoId: '',
  });
  
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipamentos = async () => {
      try {
        // --- ALTERADO AQUI ---
        // Agora chamamos a nova função que retorna um array simples
        const data = await getOperationalEquipments();
        setEquipamentos(data);

        // Pré-seleciona o primeiro equipamento da lista, se houver
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, equipamentoId: data[0]._id }));
        }
      } catch (error) {
        console.error("Não foi possível carregar os equipamentos para o formulário.");
      } finally {
        setLoading(false);
      }
    };
    fetchEquipamentos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.equipamentoId) {
        alert('Por favor, selecione um equipamento.');
        return;
    }
    onFormSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título</label>
        <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
      </div>

      <div className="mb-4">
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição do Problema</label>
        <textarea name="descricao" value={formData.descricao} onChange={handleChange} required rows={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
      </div>

      <div className="mb-4">
        <label htmlFor="equipamentoId" className="block text-sm font-medium text-gray-700">Equipamento</label>
        <select name="equipamentoId" value={formData.equipamentoId} onChange={handleChange} required disabled={loading} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
          {loading ? (
            <option>Carregando...</option>
          ) : equipamentos.length > 0 ? (
            equipamentos.map(equip => (
              <option key={equip._id} value={equip._id}>
                {equip.codigo} - {equip.localizacao}
              </option>
            ))
          ) : (
            <option value="">Nenhum equipamento operacional disponível</option>
          )}
        </select>
      </div>

       <div className="mb-4">
        <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700">Prioridade</label>
        <select name="prioridade" value={formData.prioridade} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
      </div>
      
      <div className="flex justify-end gap-4 mt-6">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">Cancelar</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Abrir Chamado</button>
      </div>
    </form>
  );
};

export default OrdemDeServicoForm;
