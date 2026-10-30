import { createContext, useCallback, useContext, useState } from "react";

const SnackbarContext = createContext(null);

export function SnackbarProvider({ children }) {
  const [mensagem, setMensagem] = useState("");

  const notificar = useCallback((texto) => {
    setMensagem(texto);
    setTimeout(() => setMensagem((atual) => (atual === texto ? "" : atual)), 3400);
  }, []);

  return (
    <SnackbarContext.Provider value={{ notificar }}>
      {children}
      {mensagem && <div className="toast">{mensagem}</div>}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error("useSnackbar deve ser usado dentro de <SnackbarProvider>");
  return ctx;
}
