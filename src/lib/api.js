
import axios from "axios";

const base = process.env.REACT_APP_BACKEND_URL;
const TOKEN_KEY = "mp_access_token";

export const api = axios.create({
  baseURL: `${base}/api`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const errMsg = (e) =>
  e?.response?.data?.error?.message ||
  e?.response?.data?.detail ||
  e?.message ||
  "Erro";

export const money = (cents, currency = "BRL") =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format((cents || 0) / 100);