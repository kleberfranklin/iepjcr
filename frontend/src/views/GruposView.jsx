import { useEffect, useState } from "react";
import { gruposApi } from "../api/gruposApi";
import { usePermissions } from "../hooks/usePermissions";

export default function GruposView() {
  const { can } = usePermissions();
  const [grupos, setGrupos] = useState([]);

  useEffect(() => { gruposApi.listar().then(setGrupos); }, []);

  return (
    <div className="grid">
      {grupos.map((g) => (
        <div key={g.id} className="card">
          <div className="spread">
            <div>
              <h3>{g.nome}</h3>
              <div className="muted">{g.membros?.length || 0} membro(s) · líder: {g.lider?.nome || "sem líder"}</div>
            </div>
            {can("grupos.lider") && <button className="btn tonal">Gerenciar</button>}
          </div>
        </div>
      ))}
    </div>
  );
}
