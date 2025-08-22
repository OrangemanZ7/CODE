// backend/seeder.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const Usuario = require('./src/models/Usuario');

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Conecta ao banco de dados
connectDB();

const importData = async () => {
    try {
        // 1. Verifica se já existe um administrador no banco
        const adminExists = await Usuario.findOne({ perfil: 'admin' });

        if (adminExists) {
            console.log('Um administrador já existe no banco de dados. Nenhuma ação foi tomada.');
            process.exit(); // Encerra o script
        }

        // 2. Se não existir, cria o administrador padrão com os dados do .env
        console.log('Nenhum administrador encontrado. Criando usuário admin padrão...');

        await Usuario.create({
            nome: process.env.DEFAULT_ADMIN_NAME,
            email: process.env.DEFAULT_ADMIN_EMAIL,
            senha: process.env.DEFAULT_ADMIN_PASSWORD,
            perfil: 'admin',
        });

        console.log('Administrador padrão criado com sucesso! ✅');
        console.log('Email:', process.env.DEFAULT_ADMIN_EMAIL);
        console.log('Senha:', process.env.DEFAULT_ADMIN_PASSWORD);
        
        process.exit();

    } catch (error) {
        console.error(`Erro ao executar o seeder: ${error.message}`);
        process.exit(1); // Encerra o script com um código de erro
    }
};

// Chama a função para iniciar o processo
importData();
