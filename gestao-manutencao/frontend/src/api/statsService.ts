// frontend/src/api/statsService.ts
import api from './apiService';

export interface DashboardStats {
    totalEquipamentos: number;
    equipamentosEmManutencao: number;
    osAbertas: number;
    osPrioridadeAlta: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    try {
        const response = await api.get('/stats/dashboard');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar estatísticas do dashboard:", error);
        throw error;
    }
};
