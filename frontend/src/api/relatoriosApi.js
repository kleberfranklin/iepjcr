import { http } from "./httpClient";

export const relatoriosApi = {
  resumoMembros: () => http.get("/relatorios/membros/resumo"),
  membrosPorGrupo: () => http.get("/relatorios/membros/por-grupo"),
  faixaEtaria: () => http.get("/relatorios/membros/faixa-etaria"),
  eventos: () => http.get("/relatorios/eventos")
};
