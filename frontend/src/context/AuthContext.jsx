import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("iepjcr:token");
    if (!token) { setCarregando(false); return; }
    authApi.me()
      .then(setUsuario)
      .catch(() => localStorage.removeItem("iepjcr:token"))
      .finally(() => setCarregando(false));
  }, []);

  const login = useCallback(async (identificador, senha) => {
    const { token, usuario: u } = await authApi.login(identificador, senha);
    localStorage.setItem("iepjcr:token", token);
    setUsuario(u);
    return u;
  }, []);

  const sair = useCallback(() => {
    localStorage.removeItem("iepjcr:token");
    setUsuario(null);
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, sair, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
