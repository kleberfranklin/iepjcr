import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import BottomNav from "./BottomNav";
import { useNotificacoes } from "../../hooks/useNotificacoes";

const TITULOS = {
  "/": "Painel",
  "/calendario": "Calendário",
  "/eventos": "Eventos",
  "/carteirinha": "Carteirinha digital",
  "/membros": "Membros",
  "/membros/novo": "Cadastro de membro",
  "/grupos": "Grupos",
  "/usuarios": "Usuários",
  "/relatorios": "Relatórios",
  "/notificacoes": "Notificações",
  "/perfil": "Meu perfil",
  "/config": "Configurações"
};

// Layout raiz das telas autenticadas: sidebar (desktop) + topbar + conteúdo + bottomnav (mobile).
export default function AppShell() {
  const location = useLocation();
  const { naoLidas } = useNotificacoes();
  const titulo = TITULOS[location.pathname] || "IEPJCR";

  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <Topbar titulo={titulo} naoLidas={naoLidas} />
        <main className="content">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
