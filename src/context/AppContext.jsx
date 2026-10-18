import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { api, errMsg, TOKEN_KEY } from "@/lib/api";
import { translator, localeMeta } from "@/lib/i18n";
import { useAppStore } from "@/store/appStore";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [projects, setProjects] = useState([]);

  const {
    projectId,
    setProjectId,
    theme,
    setTheme,
    locale,
    setLocale,
  } = useAppStore();

  const t = useMemo(() => translator(locale), [locale]);
  const meta = useMemo(() => localeMeta(locale), [locale]);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = meta.rtl ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [meta, locale]);

  const loadWorkspace = useCallback(async () => {
    try {
      const [orgRes, projRes] = await Promise.all([
        api.get("/organization"),
        api.get("/projects"),
      ]);

      const projectsList = Array.isArray(projRes.data)
        ? projRes.data
        : [];

      setOrganization(orgRes.data);
      setProjects(projectsList);

      const stored = useAppStore.getState().projectId;

      if (!projectsList.find((p) => p.id === stored)) {
        setProjectId(projectsList[0]?.id || null);
      }
    } catch (err) {
      console.error("Erro ao carregar workspace:", err);
      setProjects([]);
    }
  }, [setProjectId]);

  const login = useCallback(
    async (email, password) => {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      if (data.access_token) {
        localStorage.setItem(TOKEN_KEY, data.access_token);
      }

      setUser(data);
      await loadWorkspace();

      return data;
    },
    [loadWorkspace]
  );

  const register = useCallback(
    async (payload) => {
      const { data } = await api.post("/auth/register", payload);

      if (data.access_token) {
        localStorage.setItem(TOKEN_KEY, data.access_token);
      }

      setUser(data);
      await loadWorkspace();

      return data;
    },
    [loadWorkspace]
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // A sessão no servidor pode já ter expirado.
    } finally {
      localStorage.removeItem(TOKEN_KEY);

      setUser(false);
      setOrganization(null);
      setProjects([]);
      setProjectId(null);
    }
  }, [setProjectId]);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const { data } = await api.get("/auth/me");

        if (!active) return;

        setUser(data);
        await loadWorkspace();
      } catch (err) {
        if (!active) return;

        if (err?.response?.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
        }

        setUser(false);
        setOrganization(null);
        setProjects([]);
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, [loadWorkspace]);

  const project = Array.isArray(projects)
    ? projects.find((p) => p.id === projectId) ||
      projects[0] ||
      null
    : null;

  const services = organization?.services || [];

  const value = {
    user,
    organization,
    projects,
    project,
    projectId: project?.id || null,
    services,
    setProjectId,
    login,
    register,
    logout,
    loadWorkspace,
    t,
    locale,
    setLocale,
    meta,
    theme,
    setTheme,
    errMsg,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error("useApp must be used inside AppProvider");
  }

  return ctx;
}