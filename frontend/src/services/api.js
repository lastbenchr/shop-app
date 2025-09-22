import axios from "axios";
const base = import.meta.env.VITE_API_URL || "http://192.168.1.3:5000/api";
const api = axios.create({ baseURL: base });
export default api;
