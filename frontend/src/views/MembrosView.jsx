import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { membrosApi } from "../api/membrosApi";
import MembroTable from "../components/membros/MembroTable";
import EmptyState from "../components/common/EmptyState";

export default function MembrosView() {
  const navigate = useNavigate();
  const [membros, setMembros] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    membrosApi.listar(busca ? { busca } : {}).then(setMembros);
  }, [busca]);

  return (
    <div>
      <div className="row">
        <input placeholder="Buscar por nome ou CPF" value={busca} onChange={(e) => setBusca(e.target.value)} />
        <button className="btn" onClick={() => navigate("/membros/novo")}>+ Novo cadastro</button>
      </div>
      {membros.length === 0
        ? <EmptyState icone="🔍" titulo="Nenhum membro encontrado" texto="Ajuste a busca." />
        : <MembroTable membros={membros} onAbrir={(m) => navigate(`/membros/${m.id}`)} />}
    </div>
  );
}
