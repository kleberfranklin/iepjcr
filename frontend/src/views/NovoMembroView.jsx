import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { membrosApi } from "../api/membrosApi";
import MembroForm from "../components/membros/MembroForm";
import { useSnackbar } from "../hooks/useSnackbar";

// Mesma tela atende criação (/membros/novo) e edição (/membros/:id/editar).
export default function NovoMembroView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notificar } = useSnackbar();
  const [membro, setMembro] = useState(id ? null : undefined);

  useEffect(() => {
    if (id) membrosApi.obter(id).then(setMembro);
  }, [id]);

  const salvar = async (dados) => {
    if (id) await membrosApi.atualizar(id, dados);
    else await membrosApi.criar(dados);
    notificar(id ? "Dados do membro atualizados." : "Cadastro enviado para aprovação da liderança.");
    navigate("/membros");
  };

  if (id && membro === null) return <p>Carregando…</p>;

  return (
    <div className="card">
      <MembroForm inicial={membro} onSalvar={salvar} onCancelar={() => navigate("/membros")} />
    </div>
  );
}
