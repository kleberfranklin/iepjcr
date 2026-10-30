import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { eventosApi } from "../api/eventosApi";
import { gruposApi } from "../api/gruposApi";
import EventoCard from "../components/eventos/EventoCard";
import EmptyState from "../components/common/EmptyState";
import { usePermissions } from "../hooks/usePermissions";

export default function EventosView() {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const [eventos, setEventos] = useState([]);
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    eventosApi.listar().then(setEventos);
    gruposApi.listar().then(setGrupos);
  }, []);

  const grupoDe = (id) => grupos.find((g) => g.id === id);

  return (
    <div>
      {can("eventos.criar") && (
        <div className="row" style={{ justifyContent: "flex-end" }}>
          <button className="btn" onClick={() => navigate("/eventos/novo")}>+ Novo evento</button>
        </div>
      )}
      {eventos.length === 0
        ? <EmptyState icone="🗓" titulo="Nenhum evento aqui" texto="Cadastre um evento para avisar os membros." />
        : eventos.map((e) => (
            <EventoCard key={e.id} evento={e} grupo={grupoDe(e.grupoId)} onAbrir={() => navigate(`/eventos/${e.id}`)} />
          ))}
    </div>
  );
}
