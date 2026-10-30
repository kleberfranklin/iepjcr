export default function EmptyState({ icone, titulo, texto, acao }) {
  return (
    <div className="empty">
      <div className="big">{icone}</div>
      <h3>{titulo}</h3>
      <p className="muted">{texto}</p>
      {acao && <div style={{ marginTop: 14 }}>{acao}</div>}
    </div>
  );
}
