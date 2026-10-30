import { useMemo, useState } from "react";
import { DIAS_SEMANA, hojeISO } from "../../utils/date";

// Visualização mensal simplificada. As views de semana/dia/ano podem ser
// adicionadas seguindo o mesmo padrão de agrupamento por data ISO.
export default function Calendario({ eventos, onAbrirEvento }) {
  const [referencia, setReferencia] = useState(new Date());
  const ano = referencia.getFullYear();
  const mes = referencia.getMonth();

  const porDia = useMemo(() => {
    const mapa = {};
    eventos.forEach((e) => { (mapa[e.data] ||= []).push(e); });
    return mapa;
  }, [eventos]);

  const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const celulas = useMemo(() => {
    const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();
    const lista = [];
    for (let i = 0; i < primeiroDiaSemana; i++) lista.push(null);
    for (let d = 1; d <= totalDias; d++) lista.push(d);
    return lista;
  }, [ano, mes]);

  return (
    <div>
      <div className="spread">
        <button className="iconbtn" onClick={() => setReferencia(new Date(ano, mes - 1, 1))}>‹</button>
        <h2>{referencia.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</h2>
        <button className="iconbtn" onClick={() => setReferencia(new Date(ano, mes + 1, 1))}>›</button>
      </div>
      <div className="cal">
        {DIAS_SEMANA.map((d) => <div key={d} className="dow">{d}</div>)}
        {celulas.map((dia, i) => {
          const data = dia ? iso(ano, mes, dia) : null;
          const eventosDoDia = data ? porDia[data] || [] : [];
          return (
            <div key={i} className={`day${data === hojeISO() ? " today" : ""}`}>
              {dia && <span className="d">{dia}</span>}
              {eventosDoDia.slice(0, 3).map((e) => (
                <button key={e.id} className="ev" onClick={() => onAbrirEvento(e)}>
                  {e.horaInicio} {e.titulo}
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
