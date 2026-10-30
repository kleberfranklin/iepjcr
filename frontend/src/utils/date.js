export const hojeISO = () => new Date().toISOString().slice(0, 10);

export function idade(nascimentoISO) {
  if (!nascimentoISO) return null;
  const nasc = new Date(`${nascimentoISO}T00:00:00`);
  const hoje = new Date();
  let a = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) a--;
  return a;
}

export function formatarData(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export const MESES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];
export const DIAS_SEMANA = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
