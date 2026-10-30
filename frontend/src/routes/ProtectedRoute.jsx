import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePermissions } from "../hooks/usePermissions";

// Bloqueia rotas para quem não está logado e, opcionalmente, para quem
// não tem a tela liberada pelo RBAC (perm = ex. "membros.ver").
export default function ProtectedRoute({ perm }) {
  const { usuario, carregando } = useAuth();
  const { can } = usePermissions();

  if (carregando) return <div className="loading-screen">Carregando…</div>;
  if (!usuario) return <Navigate to="/login" replace />;
  if (perm && !can(perm)) return <Navigate to="/" replace />;

  return <Outlet />;
}
