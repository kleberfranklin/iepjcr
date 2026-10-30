import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { usePermissions } from "../../hooks/usePermissions";
import { ITENS_NAVEGACAO } from "./Sidebar";
import Modal from "../common/Modal";

// Barra inferior (mobile). Mostra até 4 telas fixas + "Mais" com o restante,
// para nunca esconder telas de perfis com muito acesso (Administrador/Pastor).
export default function BottomNav() {
  const { telas } = usePermissions();
  const [maisAberto, setMaisAberto] = useState(false);
  const location = useLocation();

  const visiveis = ITENS_NAVEGACAO.filter((i) => telas.includes(i.id));
  const principais = visiveis.length > 5 ? visiveis.slice(0, 4) : visiveis;
  const restantes = visiveis.length > 5 ? visiveis.slice(4) : [];

  return (
    <>
      <nav className="bottomnav">
        {principais.map((item) => (
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
        {restantes.length > 0 && (
          <button className="railitem" onClick={() => setMaisAberto(true)}>
            <span className="ic">⋯</span>
            <span>Mais</span>
          </button>
        )}
      </nav>

      {maisAberto && (
        <Modal titulo="Menu" onFechar={() => setMaisAberto(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {visiveis.map((item) => (
              <NavLink
                key={item.id}
                to={item.rota}
                end={item.rota === "/"}
                onClick={() => setMaisAberto(false)}
                className="btn text"
                style={{
                  width: "100%", justifyContent: "flex-start", gap: 12,
                  fontSize: 16, padding: "12px 8px",
                  fontWeight: location.pathname === item.rota ? 700 : 500
                }}
              >
                <span style={{ fontSize: 19 }}>{item.icone}</span>
                {item.rotulo}
              </NavLink>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}
