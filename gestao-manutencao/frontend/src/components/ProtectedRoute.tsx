// src/components/ProtectedRoute.tsx (crie a pasta components se não existir)
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { auth } = useAuth();

  // Se o usuário estiver logado, renderiza a página solicitada (Outlet).
  // Se não, redireciona para a página de login.
  return auth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
