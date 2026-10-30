import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Avatar from "../common/Avatar";

export default function Topbar({ titulo, naoLidas = 0 }) {
  const { usuario, sair } = useAuth();
  const { tema, setTema } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <h1>{titulo}</h1>
      <button className="iconbtn" title="Notificações" onClick={() => navigate("/notificacoes")}>
        🔔{naoLidas > 0 && <span className="badge">{naoLidas}</span>}
      </button>
      <button
        className="iconbtn"
        title="Alternar tema"
        onClick={() => setTema(tema === "dark" ? "light" : "dark")}
      >
        ◐
      </button>
      <button className="iconbtn" title="Meu perfil" onClick={() => navigate("/perfil")}>
        <Avatar nome={usuario?.nome} tamanho={32} />
      </button>
      <button className="btn text" onClick={sair}>Sair</button>
    </header>
  );
}
