import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { eventosApi } from "../api/eventosApi";
import { membrosApi } from "../api/membrosApi";
import { relatoriosApi } from "../api/relatoriosApi";
import { useAuth } from "../context/AuthContext";
import { usePermissions } from "../hooks/usePermissions";
import EventoCard from "../components/eventos/EventoCard";
import EmptyState from "../components/common/EmptyState";
import { hojeISO } from "../utils/date";

export default function DashboardView() {
  const { usuario } = useAuth();
  const { can } = usePermissions();
  const navigate = useNavigate();
  const [proximos, setProximos] = useState([]);
  const [pendentes, setPendentes] = useState([]);
  const [resumo, setResumo] = useState(null);

  useEffect(() => {
    eventosApi.listar({ de: hojeISO(), limite: 4 }).then(setProximos);
    relatoriosApi.resumoMembros().then(setResumo);
    if (can("membros.aprovar")) {
      membrosApi.listar({ status: "Pendente" }).then(setPendentes);
    }
  }, [can]);

  return (
    <div className="grid">
      <div>
        <h1>Paz do Senhor, {usuario?.nome?.split(" ")[0]}.</h1>
      </div>

      {resumo && (
        <div className="stats">
          <div className="stat"><div className="v">{resumo.ativos}</div><div className="k">Membros ativos</div></div>
          <div className="stat"><div className="v">{resumo.pendentes}</div><div className="k">Cadastros em análise</div></div>
        </div>
      )}

      <div className="cols-2">
        <div className="card">
          <div className="spread"><h3>Próximos eventos</h3>
            <button className="btn text" onClick={() => navigate("/calendario")}>Ver calendário</button></div>
          {proximos.length === 0
            ? <EmptyState icone="🗓" titulo="Agenda livre" texto="Nenhum evento futuro cadastrado." />
            : proximos.map((e) => (
                <EventoCard key={e.id} evento={e} grupo={e.grupo}
                  onAbrir={() => navigate(`/eventos/${e.id}`)} />
              ))}
        </div>

        {can("membros.aprovar") && (
          <div className="card">
            <div className="spread"><h3>Aguardando sua análise</h3>
              <button className="btn text" onClick={() => navigate("/membros")}>Ver membros</button></div>
            {pendentes.length === 0
              ? <EmptyState icone="✓" titulo="Tudo em dia" texto="Nenhum cadastro aguardando aprovação." />
              : pendentes.map((m) => (
                  <div key={m.id} className="list-item">
                    <b>{m.nome}</b>
                    <button className="btn tonal" onClick={() => navigate(`/membros/${m.id}`)}>Analisar</button>
                  </div>
                ))}
          </div>
        )}
      </div>
    </div>
  );
}
