import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import Input from "../components/common/Input";
import { maskTelefone } from "../utils/masks";

// Pré-cadastro público: só Nome completo + celular. O restante dos dados
// (foto, CPF, endereço etc.) é completado pela secretaria na aprovação.
export default function CadastroView() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [celular, setCelular] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  const enviar = async () => {
    if (nome.trim().split(/\s+/).length < 2) return setErro("Informe nome e sobrenome.");
    if (celular.replace(/\D/g, "").length < 10) return setErro("Informe um celular válido com DDD.");
    setEnviando(true);
    setErro("");
    try {
      await authApi.preCadastro(nome.trim(), celular);
      navigate("/login", { state: { mensagem: "Solicitação enviada! A secretaria vai completar seu cadastro." } });
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth-art">
        <div className="brand"><b>IEPJCR</b><span>Jesus Cristo é a Resposta</span></div>
      </div>
      <div className="auth-form">
        <div className="auth-box">
          <h1>Cadastre-se</h1>
          <p className="muted">A secretaria completa o restante do seu cadastro e libera o acesso.</p>
          <Input label="Nome completo" required value={nome} onChange={(e) => setNome(e.target.value)} />
          <Input label="Número de celular" required value={celular}
            onChange={(e) => setCelular(maskTelefone(e.target.value))} placeholder="(00) 00000-0000" />
          {erro && <div className="banner error">⚠ {erro}</div>}
          <button className="btn" style={{ width: "100%" }} disabled={enviando} onClick={enviar}>
            {enviando ? "Enviando…" : "Enviar solicitação"}
          </button>
        </div>
      </div>
    </div>
  );
}
