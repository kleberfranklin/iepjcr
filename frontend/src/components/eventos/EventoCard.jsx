import { formatarData } from "../../utils/date";

export default function EventoCard({ evento, grupo, onAbrir }) {
  const [, mes, dia] = evento.data.split("-");
  return (
    <div className="card evento-card">
      <div className="date-badge"><b>{dia}</b><span>{mes}</span></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="row">
          <b>{evento.titulo}</b>
          <span className="tag neutral">{grupo ? grupo.nome : "Todos os membros"}</span>
        </div>
        <div className="muted">
          {evento.horaInicio}–{evento.horaFim} · {evento.igreja}
          {evento.endereco ? ` · ${evento.endereco}` : ""}
        </div>
      </div>
      <button className="btn text" onClick={() => onAbrir(evento)}>Abrir</button>
    </div>
  );
}
