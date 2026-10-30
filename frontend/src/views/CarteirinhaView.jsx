import { useEffect, useState } from "react";
import { membrosApi } from "../api/membrosApi";
import Carteirinha from "../components/carteirinha/Carteirinha";

export default function CarteirinhaView() {
  const [dados, setDados] = useState(null);

  useEffect(() => { membrosApi.minhaCarteirinha().then(setDados); }, []);

  if (!dados) return <p>Carregando…</p>;
  return <Carteirinha membro={dados.membro} grupos={dados.grupos} />;
}
