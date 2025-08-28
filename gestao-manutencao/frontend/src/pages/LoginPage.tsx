// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import api from '../api/apiService';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  // Estado para guardar os valores dos inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
   const auth = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o recarregamento da página
    
    console.log('Tentando fazer login com:', { email, password });
    
    try {
      // Faz a requisição POST para a rota /auth/login
      const response = await api.post('/auth/login', {
        email,
        senha: password,
      });

      auth.login(response.data);
      navigate('/dashboard');

    } catch (error: any) {
      // Se houver um erro, o Axios o captura aqui
      console.error('Falha no login:', error.response?.data?.message || 'Erro desconhecido');
      alert('Falha no login: ' + (error.response?.data?.message || 'Erro desconhecido'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Gestão de Manutenção
        </h1>
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              autoComplete="new-password"
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="seuemail@escola.com"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="******"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline"
            >
              Entrar
            </button>
          </div>
        </form>
        
      </div>
      <p className='text-gray-400 font-bold text-xl text-center mt-8 mb-4'>GestManApp 1.00</p>
      <p className='text-gray-400 text-xs text-center mb-4'>@ OrangeSoft 2025 - Ricardo Laranjeira</p>
      <div className='flex gap-8 space-between'>
        <Link to="mailto:ricardo.laranjeira.74@gmail.com">
          <p className='text-gray-400 text-xs text-center'>ricardo.laranjeira.74@gmail.com</p>
        </Link>
        <Link to="https://whats.me/+5565996117368">
          <p className='text-gray-400 text-xs text-center'>+55 (65) 99611-7368</p>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
