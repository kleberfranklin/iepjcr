import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AppShell from "../components/layout/AppShell";

import LoginView from "../views/LoginView";
import CadastroView from "../views/CadastroView";
import DashboardView from "../views/DashboardView";
import MembrosView from "../views/MembrosView";
import NovoMembroView from "../views/NovoMembroView";
import CarteirinhaView from "../views/CarteirinhaView";
import EventosView from "../views/EventosView";
import CalendarioView from "../views/CalendarioView";
import GruposView from "../views/GruposView";
import UsuariosView from "../views/UsuariosView";
import RelatoriosView from "../views/RelatoriosView";
import NotificacoesView from "../views/NotificacoesView";
import PerfilView from "../views/PerfilView";
import ConfigView from "../views/ConfigView";

// Mapa único de rotas. Cada tela protegida declara a permissão exigida
// (ver src/constants/rbac.js); rotas sem "perm" só exigem estar logado.
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route path="/cadastro" element={<CadastroView />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardView />} />
          <Route path="/calendario" element={<CalendarioView />} />
          <Route path="/eventos" element={<EventosView />} />
          <Route path="/carteirinha" element={<CarteirinhaView />} />
          <Route path="/perfil" element={<PerfilView />} />
          <Route path="/notificacoes" element={<NotificacoesView />} />

          <Route element={<ProtectedRoute perm="membros.ver" />}>
            <Route path="/membros" element={<MembrosView />} />
          </Route>
          <Route element={<ProtectedRoute perm="membros.criar" />}>
            <Route path="/membros/novo" element={<NovoMembroView />} />
          </Route>
          <Route element={<ProtectedRoute perm="membros.editar" />}>
            <Route path="/membros/:id" element={<NovoMembroView />} />
          </Route>

          <Route element={<ProtectedRoute perm="grupos.ver" />}>
            <Route path="/grupos" element={<GruposView />} />
          </Route>

          <Route element={<ProtectedRoute perm="usuarios.ver" />}>
            <Route path="/usuarios" element={<UsuariosView />} />
          </Route>

          <Route element={<ProtectedRoute perm="relatorios.ver" />}>
            <Route path="/relatorios" element={<RelatoriosView />} />
          </Route>

          {/* Configurações: liberado só para quem tem "config.ver"
              (Administrador — Pastor(a) fica de fora por regra de negócio). */}
          <Route element={<ProtectedRoute perm="config.ver" />}>
            <Route path="/config" element={<ConfigView />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
