import { useEffect, useState } from "react";
import { relatoriosApi } from "../api/relatoriosApi";

export default function RelatoriosView() {
  const [porGrupo, setPorGrupo] = useState([]);
  const [faixaEtaria, setFaixaEtaria] = useState([]);

  useEffect(() => {
    relatoriosApi.membrosPorGrupo().then(setPorGrupo);
    relatoriosApi.faixaEtaria().then(setFaixaEtaria);
  }, []);

  return (
    <div className="cols-2">
      <div className="card">
        <h3>Membros por grupo</h3>
        {porGrupo.map((g) => (
          <div key={g.grupo} className="spread"><span>{g.grupo}</span><b>{g.total}</b></div>
        ))}
      </div>
      <div className="card">
        <h3>Faixa etária</h3>
        {faixaEtaria.map((f) => (
          <div key={f.faixa} className="spread"><span>{f.faixa}</span><b>{f.total}</b></div>
        ))}
      </div>
    </div>
  );
}
