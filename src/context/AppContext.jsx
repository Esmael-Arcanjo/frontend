import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "@/lib/api";

const Ctx = createContext(null);
const TOKEN_KEY = "mp_access_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get("/mp/auth/me");
      setUser(data);
      return data;
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
      }

      setUser(false);
      return null;
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/mp/auth/login", {
      email,
      password,
    });

    if (data.access_token) {
      localStorage.setItem(TOKEN_KEY, data.access_token);
    }

    setUser(data);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await api.post("/mp/auth/register", payload);

    if (data.access_token) {
      localStorage.setItem(TOKEN_KEY, data.access_token);
    }

    setUser(data);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/mp/auth/logout");
    } catch {
      // A sessão local também precisa ser encerrada
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setUser(false);
    }
  }, []);

  return (
    <Ctx.Provider
      value={{ user, login, register, logout, refresh }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);