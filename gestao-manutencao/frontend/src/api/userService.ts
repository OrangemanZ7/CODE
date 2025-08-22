// frontend/src/api/userService.ts

import api from './apiService';

// Tipagem para a lista completa de usuários (página de gerenciamento)
export interface User {
    _id: string;
    nome: string;
    email: string;
    perfil: 'admin' | 'tecnico' | 'funcionario';
}

// Tipagem para a lista de técnicos (usada no dropdown da OS)
export interface Technician {
    _id: string;
    nome: string;
}

// --- FUNÇÕES ---

// Função para buscar técnicos e admins para o dropdown
export const getTechnicians = async (): Promise<Technician[]> => {
    try {
        const response = await api.get('/users/technicians');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar técnicos:', error);
        throw error;
    }
}

// Função para buscar todos os usuários para a página de gerenciamento
export const getUsers = async (): Promise<User[]> => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
    }
};

// Função para criar um novo usuário
export const createUser = async (userData: any): Promise<User> => {
    try {
        const response = await api.post('/users', userData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
    }
};

// Função para atualizar um usuário
export const updateUser = async (id: string, userData: any): Promise<User> => {
    try {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        throw error;
    }
};

// Função para deletar um usuário
export const deleteUser = async (id: string): Promise<void> => {
    try {
        await api.delete(`/users/${id}`);
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        throw error;
    }
};
