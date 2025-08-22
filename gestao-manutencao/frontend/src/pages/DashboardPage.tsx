// frontend/src/pages/DashboardPage.tsx

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats, type DashboardStats } from '../api/statsService';
import StatCard from '../components/StatCard';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    const { auth } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const statsData = await getDashboardStats();
                setStats(statsData);
            } catch (error) {
                console.error("Falha ao carregar estatísticas do dashboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Bem-vindo, {auth?.nome}!</h1>
                <p className="text-gray-600">Aqui está um resumo do estado atual do sistema.</p>
            </div>

            {loading ? (
                <p>Carregando estatísticas...</p>
            ) : stats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="Total de Equipamentos"
                        value={stats.totalEquipamentos}
                        description="Todos os equipamentos cadastrados"
                    />
                    <StatCard 
                        title="Em Manutenção"
                        value={stats.equipamentosEmManutencao}
                        description="Equipamentos com OS aberta"
                    />
                    <StatCard 
                        title="OS Abertas"
                        value={stats.osAbertas}
                        description="Chamados aguardando conclusão"
                    />
                    <StatCard 
                        title="Prioridade Alta"
                        value={stats.osPrioridadeAlta}
                        description="Chamados abertos e urgentes"
                    />
                </div>
            ) : (
                <p className="text-red-500">Não foi possível carregar as estatísticas.</p>
            )}

            <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Acesso Rápido</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link to="/equipamentos" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                        <h3 className="font-bold text-lg text-blue-600">Gerenciar Equipamentos</h3>
                        <p className="text-gray-600">Ver, adicionar ou editar equipamentos.</p>
                    </Link>
                    <Link to="/workorders" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                        <h3 className="font-bold text-lg text-blue-600">Ver Ordens de Serviço</h3>
                        <p className="text-gray-600">Acompanhar e gerenciar todos os chamados.</p>
                    </Link>
                     <Link to="/users" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                        <h3 className="font-bold text-lg text-blue-600">Gerenciar Usuários</h3>
                        <p className="text-gray-600">Adicionar ou editar contas de usuários.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
