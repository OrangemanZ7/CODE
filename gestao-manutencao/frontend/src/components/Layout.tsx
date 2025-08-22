// frontend/src/components/Layout.tsx

import { useState } from 'react'; // <-- Importar useState
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  // Estado para controlar se o menu mobile está aberto ou fechado
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    return isActive
      ? 'text-blue-600 font-bold'
      : 'text-gray-600 hover:text-blue-600';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-gray-800">
            <NavLink to="/dashboard">Gestão Escolar TI</NavLink>
          </div>

          {/* Links para telas grandes (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/dashboard" className={getNavLinkClass}>Dashboard</NavLink>
            <NavLink to="/equipamentos" className={getNavLinkClass}>Equipamentos</NavLink>
            <NavLink to="/workorders" className={getNavLinkClass}>Ordens de Serviço</NavLink>
            {auth?.perfil === 'admin' && (
              <NavLink to="/users" className={getNavLinkClass}>Gerenciar Usuários</NavLink>
            )}
            <div className="flex items-center gap-2">
               <span className="text-gray-700">Olá, {auth?.nome}</span>
               <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1 px-3 rounded">
                 Sair
               </button>
            </div>
          </div>
          
          {/* Botão Hambúrguer para telas pequenas (Mobile) */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {/* Ícone de Hambúrguer ou 'X' */}
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
              )}
            </button>
          </div>
        </nav>

        {/* Menu Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/dashboard" className={({isActive}) => `${getNavLinkClass({isActive})} block px-3 py-2 rounded-md text-base font-medium`}>Dashboard</NavLink>
            <NavLink to="/equipamentos" className={({isActive}) => `${getNavLinkClass({isActive})} block px-3 py-2 rounded-md text-base font-medium`}>Equipamentos</NavLink>
            <NavLink to="/workorders" className={({isActive}) => `${getNavLinkClass({isActive})} block px-3 py-2 rounded-md text-base font-medium`}>Ordens de Serviço</NavLink>
            {auth?.perfil === 'admin' && (
              <NavLink to="/users" className={({isActive}) => `${getNavLinkClass({isActive})} block px-3 py-2 rounded-md text-base font-medium`}>Gerenciar Usuários</NavLink>
            )}
            <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="flex items-center px-3">
                    <p className="text-base font-medium text-gray-800">Olá, {auth?.nome}</p>
                </div>
                <div className="mt-3 px-2 space-y-1">
                    <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100">
                        Sair
                    </button>
                </div>
            </div>
          </div>
        )}
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;