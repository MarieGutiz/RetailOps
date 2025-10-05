//Create axios instance
import axios from "axios";  

// Base URL of your Spring Boot backend
const API_BASE_URL = "http://localhost:8080/api";


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
}); 

export default api;