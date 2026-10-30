import { useState } from "react";
import Input from "../common/Input";
import Select from "../common/Select";
import { hojeISO } from "../../utils/date";

export default function EventoForm({ inicial, grupos, igrejas, onSalvar, onCancelar }) {
  const [form, setForm] = useState(inicial || {
    titulo: "", data: hojeISO(), horaInicio: "19:00", horaFim: "21:00",
    igreja: igrejas?.[0] || "", grupoId: "", endereco: "", descricao: ""
  });
  const [erros, setErros] = useState({});

  const set = (campo, valor) => {
    setForm((f) => ({ ...f, [campo]: valor }));
    setErros((e) => ({ ...e, [campo]: undefined }));
  };

  const salvar = () => {
    const e = {};
    if (!form.titulo.trim()) e.titulo = "Informe o título do evento.";
    if (!form.data) e.data = "Informe a data.";
    if (!form.horaInicio) e.horaInicio = "Informe a hora de início.";
    if (form.horaFim && form.horaFim <= form.horaInicio) e.horaFim = "O término deve ser depois do início.";
    setErros(e);
    if (Object.keys(e).length === 0) onSalvar(form);
  };

  return (
    <div>
      <Input label="Título" required value={form.titulo}
        onChange={(ev) => set("titulo", ev.target.value)} error={erros.titulo} />
      <div className="cols">
        <Input label="Data" required type="date" value={form.data}
          onChange={(ev) => set("data", ev.target.value)} error={erros.data} />
        <Input label="Hora de início" required type="time" value={form.horaInicio}
          onChange={(ev) => set("horaInicio", ev.target.value)} error={erros.horaInicio} />
        <Input label="Hora de término" type="time" value={form.horaFim}
          onChange={(ev) => set("horaFim", ev.target.value)} error={erros.horaFim} />
      </div>
      <div className="cols">
        <Select label="Igreja" value={form.igreja} onChange={(ev) => set("igreja", ev.target.value)} options={igrejas} />
        <Select label="Grupo convidado" value={form.grupoId} onChange={(ev) => set("grupoId", ev.target.value)}
          placeholder="Todos os membros"
          options={grupos.map((g) => ({ value: g.id, label: g.nome }))}
          hint="Os membros do grupo recebem a notificação." />
      </div>
      <Input label="Endereço" value={form.endereco} onChange={(ev) => set("endereco", ev.target.value)} />
      <div className="field">
        <label>Descrição</label>
        <textarea rows={3} value={form.descricao} onChange={(ev) => set("descricao", ev.target.value)} />
      </div>
      <div className="row" style={{ justifyContent: "flex-end" }}>
        <button className="btn tonal" onClick={onCancelar}>Cancelar</button>
        <button className="btn" onClick={salvar}>{inicial ? "Salvar evento" : "Criar e notificar"}</button>
      </div>
    </div>
  );
}
