// src/api/apiService.ts
import axios from "axios";

// Cria uma instância do Axios com a URL base da nossa API

// Uso local
// const api = axios.create({
//   baseURL: 'http://localhost:5000/api', // A porta do nosso back-end
// });

// Uso na rede
 const api = axios.create({
   baseURL: "http://192.168.18.196:5000/api", // A porta do nosso back-end mudar o IP da máquina na rede
 });

export default api;
