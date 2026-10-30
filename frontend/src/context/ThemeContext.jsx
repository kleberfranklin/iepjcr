import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(() => localStorage.getItem("iepjcr:tema") || "auto");

  useEffect(() => {
    localStorage.setItem("iepjcr:tema", tema);
    if (tema === "auto") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = tema;
  }, [tema]);

  return (
    <ThemeContext.Provider value={{ tema, setTema }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme deve ser usado dentro de <ThemeProvider>");
  return ctx;
}
