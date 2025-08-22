// frontend/src/App.tsx

import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EquipamentosPage from './pages/EquipamentosPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import WorkOrdersPage from './pages/WorkOrdersPage';
import WorkOrderDetailPage from './pages/WorkOrderDetailPage';
import UserManagementPage from './pages/UserManagementPage';
import EquipamentoDetailPage from './pages/EquipamentoDetailPage';

function App() {
  return (
    <Routes>
      {/* Rota pública para a página de login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Agrupador para todas as rotas que precisam de autenticação */}
      <Route element={<ProtectedRoute />}>
        {/* Agrupador para todas as páginas que devem ter o layout principal (header, etc.) */}
        <Route element={<Layout />}>
          
          {/* A rota raiz da área logada redireciona para o dashboard */}
          <Route path="/" element={<Navigate to="/equipamentos" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />          
          <Route path="/equipamentos" element={<EquipamentosPage />} />
          <Route path="/equipamentos/:id" element={<EquipamentoDetailPage />} />
          <Route path="/workorders" element={<WorkOrdersPage />} />
          <Route path="/workorders/:id" element={<WorkOrderDetailPage />} />
          <Route path="/users" element={<UserManagementPage />} />
          
          {/* Outras páginas protegidas podem ser adicionadas aqui no futuro */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;