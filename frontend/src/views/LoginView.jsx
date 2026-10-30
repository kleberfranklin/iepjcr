import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/common/Input";

export default function LoginView() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identificador, setIdentificador] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const entrar = async () => {
    try {
      await login(identificador, senha);
      navigate("/");
    } catch (e) {
      setErro(e.message || "CPF/celular ou senha incorretos.");
    }
  };

  return (
    <div className="auth">
      <div className="auth-art">
        <div className="brand"><b>IEPJCR</b><span>Jesus Cristo é a Resposta</span></div>
        <p className="verse">Eu sou o caminho, a verdade e a vida.</p>
      </div>
      <div className="auth-form">
        <div className="auth-box">
          <h1>Entrar</h1>
          <p className="muted">Use seu CPF ou número de celular cadastrado.</p>
          <Input label="CPF ou celular" value={identificador}
            onChange={(e) => setIdentificador(e.target.value)} placeholder="000.000.000-00" />
          <Input label="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
          {erro && <div className="banner error">⚠ {erro}</div>}
          <button className="btn" style={{ width: "100%" }} onClick={entrar}>Entrar</button>
          <Link to="/cadastro" className="btn tonal" style={{ width: "100%", textAlign: "center" }}>
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}
