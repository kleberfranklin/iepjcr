const CLASSES = { Aprovado: "ok", Pendente: "pend", Reprovado: "no" };
const ICONES = { Aprovado: "✓", Pendente: "◔", Reprovado: "✕" };

export default function StatusTag({ status }) {
  return <span className={`tag ${CLASSES[status] || "neutral"}`}>{ICONES[status]} {status}</span>;
}
