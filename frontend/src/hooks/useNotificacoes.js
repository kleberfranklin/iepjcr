import { useCallback, useEffect, useState } from "react";
import { notificacoesApi } from "../api/notificacoesApi";
import { useAuth } from "../context/AuthContext";

// Busca as notificações do usuário logado e expõe o total não lido (para o sininho).
export function useNotificacoes() {
  const { usuario } = useAuth();
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const recarregar = useCallback(() => {
    if (!usuario) return;
    setCarregando(true);
    notificacoesApi.listar()
      .then(setNotificacoes)
      .finally(() => setCarregando(false));
  }, [usuario]);

  useEffect(() => { recarregar(); }, [recarregar]);

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  return { notificacoes, naoLidas, carregando, recarregar };
}
