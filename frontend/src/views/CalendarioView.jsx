import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { eventosApi } from "../api/eventosApi";
import Calendario from "../components/calendario/Calendario";

export default function CalendarioView() {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);

  useEffect(() => { eventosApi.listar().then(setEventos); }, []);

  return <Calendario eventos={eventos} onAbrirEvento={(e) => navigate(`/eventos/${e.id}`)} />;
}
