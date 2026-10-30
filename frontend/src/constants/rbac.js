// Regras de acesso por perfil (espelha PERMS do backend / enum Perfil.java).
// "*" = acesso total a todas as ações daquele recurso.
export const PERMISSOES = {
  Administrador: ["*"],
  "Pastor(a)": [
    "membros.ver", "membros.criar", "membros.editar", "membros.aprovar",
    "eventos.*", "grupos.*", "grupos.lider",
    "usuarios.ver", "usuarios.editar",
    "relatorios.ver", "notificacoes.enviar"
  ],
  "Secretário(a)": [
    "membros.ver", "membros.criar", "membros.editar", "membros.aprovar",
    "eventos.*", "grupos.ver", "relatorios.ver", "notificacoes.enviar"
  ],
  "Líder": [
    "membros.ver", "eventos.ver", "eventos.criar",
    "grupos.ver", "grupos.editarProprio", "relatorios.ver"
  ],
  Membro: ["eventos.ver", "grupos.ver", "carteirinha.propria", "perfil.editar"]
};

// Telas que aparecem na navegação por perfil. Usado pelo Sidebar/BottomNav.
export const TELAS_POR_PERFIL = {
  Administrador: ["dashboard", "calendario", "eventos", "carteirinha", "membros", "grupos", "usuarios", "relatorios", "notificacoes", "perfil", "config"],
  "Pastor(a)": ["dashboard", "calendario", "eventos", "carteirinha", "membros", "grupos", "usuarios", "relatorios", "notificacoes", "perfil"],
  "Secretário(a)": ["dashboard", "calendario", "eventos", "carteirinha", "membros", "grupos", "relatorios", "notificacoes", "perfil"],
  "Líder": ["dashboard", "calendario", "eventos", "carteirinha", "grupos", "relatorios", "notificacoes", "perfil"],
  Membro: ["dashboard", "calendario", "eventos", "carteirinha", "notificacoes", "perfil"]
};

export function pode(perfil, permissao) {
  const lista = PERMISSOES[perfil] || [];
  if (lista.includes("*") || lista.includes(permissao)) return true;
  const [area] = permissao.split(".");
  return lista.includes(`${area}.*`);
}
