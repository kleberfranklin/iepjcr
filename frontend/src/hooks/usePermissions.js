import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { pode, TELAS_POR_PERFIL } from "../constants/rbac";

// Hook central de RBAC no front: uso -> const { can, telas } = usePermissions();
export function usePermissions() {
  const { usuario } = useAuth();
  const perfil = usuario?.perfil;

  return useMemo(() => ({
    perfil,
    can: (permissao) => (perfil ? pode(perfil, permissao) : false),
    telas: perfil ? TELAS_POR_PERFIL[perfil] || [] : []
  }), [perfil]);
}
