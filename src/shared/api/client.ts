import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const readCookie = (name: string) =>
  document.cookie.split("; ").find((c) => c.startsWith(`${name}=`))?.split("=")[1] || "";

const SESSION_FLAG = "leamse_session";
export const hasSession = () => Boolean(readCookie("csrf_token")) || localStorage.getItem(SESSION_FLAG) === "1";
export const markSession = (on: boolean) => {
  if (on) localStorage.setItem(SESSION_FLAG, "1"); else localStorage.removeItem(SESSION_FLAG);
  csrfMemo = "";
};

let csrfMemo = "";
const SAFE = ["get", "head", "options"];
const getCsrf = async () => {
  const fromCookie = readCookie("csrf_token");
  if (fromCookie) return fromCookie;
  if (!csrfMemo && hasSession()) {
    const { data } = await axios.get(`${BACKEND_URL}/api/v1/auth/csrf`, { withCredentials: true });
    csrfMemo = data.csrf_token || "";
  }
  return csrfMemo;
};

let refreshing: Promise<unknown> | null = null;
const NO_REFRESH = ["/api/v1/auth/refresh", "/api/v1/auth/login", "/api/v1/auth/login/mfa", "/api/v1/auth/register"];

const attach = (instance: AxiosInstance) => {
  instance.interceptors.request.use(async (config) => {
    if (SAFE.includes((config.method || "get").toLowerCase())) return config;
    const csrf = await getCsrf();
    if (csrf) config.headers.set("X-CSRF-Token", csrf);
    return config;
  });
  instance.interceptors.response.use(undefined, async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status !== 401 || !original || original._retry || !hasSession() || NO_REFRESH.some((p) => original.url?.endsWith(p))) {
      throw error;
    }
    original._retry = true;
    refreshing = refreshing || api.post("/api/v1/auth/refresh").then(() => { csrfMemo = ""; })
      .catch((e) => { markSession(false); throw e; }).finally(() => { refreshing = null; });
    await refreshing;
    return instance(original);
  });
  return instance;
};

export const api = attach(axios.create({ baseURL: BACKEND_URL, withCredentials: true }));

export const productApi = (organizationId: string) =>
  attach(axios.create({ baseURL: BACKEND_URL, withCredentials: true, headers: { "X-Organization-Id": organizationId } }));

export const errMsg = (e: unknown): string => {
  const err = e as AxiosError<{ detail?: unknown }>;
  const detail = err?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((d: { msg?: string }) => d.msg?.replace("Value error, ", "")).join(" ");
  if (err?.response?.status === 429) return "Muitas requisições. Aguarde um instante.";
  return "Não foi possível concluir a operação. Tente novamente.";
};
