// src/api/equipamentoService.ts
import api from './apiService';

// Define a "forma" de um objeto Equipamento para o TypeScript
export interface Equipamento {
    _id: string;
    codigo: string;
    tipo: string;
    marca?: string;
    modelo?: string;
    localizacao: string;
    status: 'operacional' | 'em_manutencao' | 'descartado';
    createdAt: string;
    updatedAt: string;
    dataCompra?: string;
    fimGarantia?: string;
}

export interface PaginatedEquipamentos {
  equipamentos: Equipamento[];
  page: number;
  pages: number;
  total: number;
}

export interface EquipamentoFilters {
  tipo?: string;
  status?: string;
  localizacao?: string;
  page?: number;
}

type CreateEquipamentoData = Omit<Equipamento, '_id' | 'createdAt' | 'updatedAt' | 'status'>;
type UpdateEquipamentoData = Partial<Omit<Equipamento, '_id' | 'createdAt' | 'updatedAt'>>;

// Função que busca a lista de todos os equipamentos na API
export const getEquipamentos = async (filters: EquipamentoFilters = {}): Promise<PaginatedEquipamentos> => {
  try {
    const response = await api.get('/equipments', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar equipamentos:', error);
    throw error;
  }
};

export const createEquipamento = async (data: CreateEquipamentoData): Promise<Equipamento> => {
  try {
    const response = await api.post('/equipments', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar equipamento:', error);
    throw error;
  }
};

export const updateEquipamento = async (id: string, data: UpdateEquipamentoData): Promise<Equipamento> => {
  try {
    const response = await api.put(`/equipments/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar equipamento ${id}:`, error);
    throw error;
  }
};

export const deleteEquipamento = async (id: string): Promise<void> => {
  try {
    await api.delete(`/equipments/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar equipamento ${id}:`, error);
    throw error;
  }
};

export const getEquipamentoById = async (id: string): Promise<Equipamento> => {
  try {
    const response = await api.get(`/equipments/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar equipamento ${id}:`, error);
    throw error;
  }
};

export const getOperationalEquipments = async (): Promise<Equipamento[]> => {
  try {
    const response = await api.get('/equipments/list/operational');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar lista de equipamentos operacionais:', error);
    throw error;
  }
};
