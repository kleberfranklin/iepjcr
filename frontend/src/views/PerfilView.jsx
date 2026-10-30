import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { usuariosApi } from "../api/usuariosApi";
import { useSnackbar } from "../hooks/useSnackbar";

export default function PerfilView() {
  const { usuario } = useAuth();
  const { notificar } = useSnackbar();
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  const trocarSenha = async () => {
    if (novaSenha.length < 6) return notificar("A nova senha precisa de ao menos 6 caracteres.");
    await usuariosApi.trocarSenha(senhaAtual, novaSenha);
    setSenhaAtual(""); setNovaSenha("");
    notificar("Senha alterada.");
  };

  return (
    <div className="grid">
      <div className="card">
        <h2>{usuario?.nome}</h2>
        <div className="muted">{usuario?.perfil}</div>
      </div>
      <div className="card">
        <h3>Trocar senha</h3>
        <input type="password" placeholder="Senha atual" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} />
        <input type="password" placeholder="Nova senha" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
        <button className="btn" onClick={trocarSenha}>Salvar nova senha</button>
      </div>
    </div>
  );
}
