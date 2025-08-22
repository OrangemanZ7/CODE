// src/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Tenta conectar ao MongoDB usando a URI do nosso arquivo .env    
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Se a conexão for bem-sucedida, exibe uma mensagem no console
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    // Se houver um erro, exibe o erro e encerra o processo
    console.error(`Erro na conexão com o MongoDB: ${error.message}`);
    process.exit(1); // Encerra a aplicação com falha
  }
};

module.exports = connectDB;