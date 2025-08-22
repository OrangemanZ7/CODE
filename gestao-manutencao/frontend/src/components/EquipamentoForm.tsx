// src/components/EquipamentoForm.tsx
import React, { useState, useEffect } from 'react';
import { type Equipamento } from '../api/equipamentoService';

type EquipamentoFormData = Omit<Equipamento, '_id' | 'createdAt' | 'updatedAt' | 'status'>;

interface EquipamentoFormProps {
  initialData?: Equipamento | null; // <-- Prop opcional para dados iniciais
  onFormSubmit: (data: EquipamentoFormData) => void;
  onClose: () => void;
}

const EquipamentoForm: React.FC<EquipamentoFormProps> = ({ initialData, onFormSubmit, onClose }) => {
  const [formData, setFormData] = useState<EquipamentoFormData>({
    codigo: '',
    tipo: 'Desktop',
    marca: '',
    modelo: '',
    localizacao: '',
    dataCompra: ''
  });

  // useEffect para preencher o formulário quando os dados iniciais mudam
  useEffect(() => {
    if (initialData) {
      setFormData({
        codigo: initialData.codigo,
        tipo: initialData.tipo,
        marca: initialData.marca || '',
        modelo: initialData.modelo || '',
        localizacao: initialData.localizacao,
        // Formata a data para o formato YYYY-MM-DD que o input[type=date] precisa
        dataCompra: initialData.dataCompra ? new Date(initialData.dataCompra).toISOString().split('T')[0] : '',
      });
    } else {
        // Limpa o formulário ao criar
        setFormData({ codigo: '', tipo: 'Desktop', marca: '', modelo: '', localizacao: '', dataCompra: '' });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFormSubmit(formData);
  };
  return (
    <form onSubmit={handleSubmit}>
      {/* Campo Código */}
      <div className="mb-4">
        <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">Código</label>
        <input type="text" name="codigo" id="codigo" value={formData.codigo} onChange={handleChange} required className="mt-1 block w-full border-gray-900 border-b rounded-md shadow-sm p-2" />
      </div>
      {/* Campo Tipo */}
      <div className="mb-4">
        <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">Tipo</label>
        <select name="tipo" id="tipo" value={formData.tipo} onChange={handleChange} required className="mt-1 block w-full border-gray-900 border-b rounded-md shadow-sm p-2">
          <option>Desktop</option>
          <option>Notebook</option>
          <option>Projetor</option>
          <option>Impressora</option>
          <option>Monitor</option>
          <option>Outro</option>
        </select>
      </div>
      {/* Outros campos de texto */}
      <div className="mb-4">
        <label htmlFor="marca" className="block text-sm font-medium text-gray-700">Marca</label>
        <input type="text" name="marca" id="marca" value={formData.marca} onChange={handleChange} className="mt-1 block w-full border-gray-900 border-b rounded-md shadow-sm p-2" />
      </div>
       <div className="mb-4">
        <label htmlFor="localizacao" className="block text-sm font-medium text-gray-700">Localização</label>
        <input type="text" name="localizacao" id="localizacao" value={formData.localizacao} onChange={handleChange} required className="mt-1 block w-full border-gray-900 border-b rounded-md shadow-sm p-2" />
      </div>
      <div className="mb-4">
        <label htmlFor="dataCompra" className="block text-sm font-medium text-gray-700">Data de Compra</label>
        <input 
          type="date" 
          name="dataCompra" 
          id="dataCompra" 
          value={formData.dataCompra} 
          onChange={handleChange} 
          className="mt-1 block w-full border-gray-900 border-b rounded-md shadow-sm focus:ring-0 p-2" 
        />
      </div>
      {/* Botões */}
      <div className="flex justify-end gap-4 mt-6">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">Cancelar</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Salvar</button>
      </div>
    </form>
  );
};

export default EquipamentoForm;
