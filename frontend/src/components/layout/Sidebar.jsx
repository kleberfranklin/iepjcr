import { NavLink } from "react-router-dom";
import { usePermissions } from "../../hooks/usePermissions";

// Ícone + rótulo de cada tela. A ordem aqui define a ordem no menu.
const ITENS = [
  { id: "dashboard",     rota: "/",              icone: "◈", rotulo: "Painel" },
  { id: "calendario",    rota: "/calendario",     icone: "▦", rotulo: "Calendário" },
  { id: "eventos",       rota: "/eventos",        icone: "★", rotulo: "Eventos" },
  { id: "carteirinha",   rota: "/carteirinha",    icone: "🪪", rotulo: "Carteirinha" },
  { id: "membros",       rota: "/membros",        icone: "☰", rotulo: "Membros" },
  { id: "grupos",        rota: "/grupos",         icone: "◎", rotulo: "Grupos" },
  { id: "usuarios",      rota: "/usuarios",       icone: "⚙", rotulo: "Usuários" },
  { id: "relatorios",    rota: "/relatorios",     icone: "▤", rotulo: "Relatórios" },
  { id: "notificacoes",  rota: "/notificacoes",   icone: "🔔", rotulo: "Notificações" },
  { id: "perfil",        rota: "/perfil",         icone: "◉", rotulo: "Meu perfil" },
  { id: "config",        rota: "/config",         icone: "⚒", rotulo: "Configurações" }
];

export default function Sidebar() {
  const { telas } = usePermissions();
  const visiveis = ITENS.filter((i) => telas.includes(i.id));

  return (
    <aside className="rail">
      <div className="rail-logo">IEPJCR</div>
      <nav>
        {visiveis.map((item) => (
          <NavLink
            key={item.id}
            to={item.rota}
            end={item.rota === "/"}
            className={({ isActive }) => `railitem${isActive ? " active" : ""}`}
          >
            <span className="ic">{item.icone}</span>
            <span>{item.rotulo}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export { ITENS as ITENS_NAVEGACAO };
