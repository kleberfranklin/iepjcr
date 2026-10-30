import { useNotificacoes } from "../hooks/useNotificacoes";
import { notificacoesApi } from "../api/notificacoesApi";
import { usePermissions } from "../hooks/usePermissions";
import { useState } from "react";

export default function NotificacoesView() {
  const { notificacoes, recarregar } = useNotificacoes();
  const { can } = usePermissions();
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");

  const enviarComunicado = async () => {
    if (!titulo.trim()) return;
    await notificacoesApi.enviarComunicado(titulo, texto);
    setTitulo(""); setTexto(""); recarregar();
  };

  return (
    <div className="grid">
      {can("notificacoes.enviar") && (
        <div className="card">
          <h3>Enviar comunicado</h3>
          <input placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          <textarea placeholder="Mensagem" value={texto} onChange={(e) => setTexto(e.target.value)} />
          <button className="btn" onClick={enviarComunicado}>Enviar a todos</button>
        </div>
      )}
      <div className="card">
        <h3>Suas notificações</h3>
        {notificacoes.map((n) => (
          <div key={n.id} className="list-item">
            <b>{n.titulo}</b>
            <div className="muted">{n.texto}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
