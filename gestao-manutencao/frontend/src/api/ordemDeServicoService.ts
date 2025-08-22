// frontend/src/api/ordemDeServicoService.ts

import api from './apiService';

// Interfaces para tipagem dos dados que virão da API

// Note como definimos os campos que virão "populados" do back-end
interface UsuarioPopulado {
  _id: string;
  nome: string;
  email: string;
}

interface EquipamentoPopulado {
  _id: string;
  codigo: string;
  tipo: string;
  marca: string;
  modelo: string;
  localizacao: string;
}

// Type para os dados que o formulário enviará
export interface CreateOrdemDeServicoData {
  titulo: string;
  descricao: string;
  prioridade: 'baixa' | 'media' | 'alta';
  equipamentoId: string;
}

// Interface para um item do histórico
export interface HistoricoItem {
  usuario: string;
  acao: string;
  data: string;
}

export interface OrdemDeServico {
  _id: string;
  titulo: string;
  descricao: string;
  status: 'aberto' | 'em_andamento' | 'aguardando_peca' | 'concluido' | 'cancelado';
  prioridade: 'baixa' | 'media' | 'alta';
  solicitante: UsuarioPopulado;
  equipamento: EquipamentoPopulado;
  tecnicoResponsavel?: UsuarioPopulado;
  createdAt: string;
  updatedAt: string;
  historico: HistoricoItem[];
}

export interface UpdateOrdemDeServicoData {
  status?: string;
  prioridade?: string;
  tecnicoId?: string;
}

export interface PaginatedOrdensDeServico {
  ordens: OrdemDeServico[];
  page: number;
  pages: number;
  total: number;
}

export interface OrdemDeServicoFilters {
  status?: string;
  prioridade?: string;
  page?: number;
  hideCompleted?: boolean;
}

export const getOrdensDeServico = async (filters: OrdemDeServicoFilters = {}): Promise<PaginatedOrdensDeServico> => {
  try {
    const response = await api.get('/workorders', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar ordens de serviço:', error);
    throw error;
  }
};

export const getOrdemDeServicoById = async (id: string): Promise<OrdemDeServico> => {
  try {
    const response = await api.get(`/workorders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar ordem de serviço ${id}:`, error);
    throw error;
  }
};

export const createOrdemDeServico = async (data: CreateOrdemDeServicoData): Promise<OrdemDeServico> => {
  try {
    const response = await api.post('/workorders', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar ordem de serviço:', error);
    throw error;
  }
};

export const updateOrdemDeServico = async (id: string, data: UpdateOrdemDeServicoData): Promise<OrdemDeServico> => {
    try {
        const response = await api.put(`/workorders/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar OS ${id}:`, error);
        throw error;
    }
};

export const getHistoryForEquipment = async (equipmentId: string): Promise<OrdemDeServico[]> => {
  try {
    const response = await api.get(`/workorders/history/${equipmentId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar histórico para o equipamento ${equipmentId}:`, error);
    throw error;
  }
};



