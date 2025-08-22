// src/api/apiService.ts
import axios from 'axios';

// Cria uma instância do Axios com a URL base da nossa API
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // A porta do nosso back-end mudar localhost para IP da máquina na rede
});

export default api;
