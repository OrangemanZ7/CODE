// src/api/apiService.ts
import axios from 'axios';

// Cria uma instância do Axios com a URL base da nossa API
const api = axios.create({
  baseURL: 'http://192.168.18.21:5000/api', // A porta do nosso back-end
});

export default api;
