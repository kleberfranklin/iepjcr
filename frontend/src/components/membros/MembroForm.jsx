import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import Select from "../common/Select";
import { ESCOLARIDADE, ESTADO_CIVIL, CARGOS, UFS } from "../../constants/domain";
import { maskCPF, maskCEP, maskTelefone } from "../../utils/masks";
import { validarMembro } from "../../utils/validators";
import { idade } from "../../utils/date";
import { cepApi } from "../../api/cepApi";
import { usePermissions } from "../../hooks/usePermissions";

const VAZIO = {
  foto: "", nome: "", nascimento: "", naturalidade: "", rg: "", cpf: "", celular: "", email: "",
  profissao: "", escolaridade: "", estadoCivil: "", pai: "", profPai: "", mae: "", profMae: "",
  conjuge: "", profConjuge: "", filhos: [], cep: "", endereco: "", numeroEnd: "", complemento: "",
  bairro: "", cidade: "", uf: "", batismo: "", pastor: "", cargo: "Membro",
  dizimista: false, ofertante: false
};

// Formulário completo de cadastro/edição de membro (regras do documento de requisitos).
export default function MembroForm({ inicial, onSalvar, onCancelar }) {
  const { can } = usePermissions();
  const [form, setForm] = useState(inicial ? { ...VAZIO, ...inicial } : VAZIO);
  const [erros, setErros] = useState({});
  const [buscandoCep, setBuscandoCep] = useState(false);

  const set = (campo, valor) => {
    setForm((f) => ({ ...f, [campo]: valor }));
    setErros((e) => ({ ...e, [campo]: undefined }));
  };

  const onFoto = (e) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = () => set("foto", leitor.result);
    leitor.readAsDataURL(arquivo);
  };

  const buscarCep = async () => {
    const cepLimpo = form.cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;
    setBuscandoCep(true);
    try {
      const dados = await cepApi.buscar(form.cep);
      setForm((f) => ({ ...f, ...dados }));
    } catch {
      // Falha na consulta: segue com preenchimento manual (regra do documento).
    } finally {
      setBuscandoCep(false);
    }
  };

  const addFilho = () => set("filhos", [...form.filhos, { nome: "", nascimento: "" }]);
  const setFilho = (i, campo, valor) =>
    set("filhos", form.filhos.map((f, j) => (j === i ? { ...f, [campo]: valor } : f)));
  const removerFilho = (i) => set("filhos", form.filhos.filter((_, j) => j !== i));

  const salvar = () => {
    const e = validarMembro(form);
    setErros(e);
    if (Object.keys(e).length === 0) onSalvar(form);
  };

  return (
    <div>
      <fieldset>
        <legend>1. Identificação</legend>
        <div className="row" style={{ alignItems: "flex-start", gap: 20 }}>
          <div>
            <div className="foto-preview">
              {form.foto ? <img src={form.foto} alt="Foto do membro" /> : <span>Foto 3x4<br />ou 2x2</span>}
            </div>
            <label className="btn tonal" style={{ marginTop: 8 }}>
              {form.foto ? "Trocar" : "Enviar"}
              <input type="file" accept="image/*" onChange={onFoto} style={{ display: "none" }} />
            </label>
            {erros.foto && <div className="err">{erros.foto}</div>}
          </div>
          <div style={{ flex: 1, minWidth: 260 }} className="cols-2">
            <Input label="Nome completo" required value={form.nome}
              onChange={(e) => set("nome", e.target.value)} error={erros.nome} />
            <Input label="Data de nascimento" required type="date" value={form.nascimento}
              onChange={(e) => set("nascimento", e.target.value)} error={erros.nascimento}
              hint={form.nascimento && !erros.nascimento ? `${idade(form.nascimento)} anos` : ""} />
          </div>
        </div>
        <div className="cols">
          <Input label="Naturalidade" required value={form.naturalidade}
            onChange={(e) => set("naturalidade", e.target.value)} placeholder="Cidade/UF" error={erros.naturalidade} />
          <Input label="RG" value={form.rg} onChange={(e) => set("rg", e.target.value)} />
          <Input label="CPF" required value={form.cpf}
            onChange={(e) => set("cpf", maskCPF(e.target.value))} error={erros.cpf} />
          <Input label="Telefone celular" required value={form.celular}
            onChange={(e) => set("celular", maskTelefone(e.target.value))} error={erros.celular} />
          <Input label="E-mail" type="email" value={form.email}
            onChange={(e) => set("email", e.target.value)} error={erros.email} />
          <Input label="Profissão" value={form.profissao} onChange={(e) => set("profissao", e.target.value)} />
          <Select label="Escolaridade" value={form.escolaridade}
            onChange={(e) => set("escolaridade", e.target.value)} options={ESCOLARIDADE} />
          <Select label="Estado civil" value={form.estadoCivil}
            onChange={(e) => set("estadoCivil", e.target.value)} options={ESTADO_CIVIL} />
        </div>
      </fieldset>

      <fieldset>
        <legend>2. Família</legend>
        <div className="cols">
          <Input label="Nome do pai" value={form.pai} onChange={(e) => set("pai", e.target.value)} />
          <Input label="Profissão do pai" value={form.profPai} onChange={(e) => set("profPai", e.target.value)} />
          <Input label="Nome da mãe" value={form.mae} onChange={(e) => set("mae", e.target.value)} />
          <Input label="Profissão da mãe" value={form.profMae} onChange={(e) => set("profMae", e.target.value)} />
          <Input label="Nome do cônjuge" required={form.estadoCivil === "Casado"} value={form.conjuge}
            onChange={(e) => set("conjuge", e.target.value)} error={erros.conjuge} />
          <Input label="Profissão do cônjuge" value={form.profConjuge} onChange={(e) => set("profConjuge", e.target.value)} />
        </div>
        <div className="spread">
          <h3>Filhos</h3>
          <Button variant="tonal" size="sm" onClick={addFilho}>+ Adicionar filho(a)</Button>
        </div>
        {form.filhos.map((filho, i) => (
          <div key={i} className="row">
            <Input label={`Nome do filho(a) ${i + 1}`} value={filho.nome}
              onChange={(e) => setFilho(i, "nome", e.target.value)} />
            <Input label="Data de nascimento" type="date" value={filho.nascimento}
              onChange={(e) => setFilho(i, "nascimento", e.target.value)} />
            <button className="iconbtn" onClick={() => removerFilho(i)}>🗑</button>
          </div>
        ))}
      </fieldset>

      <fieldset>
        <legend>3. Endereço</legend>
        <div className="cols">
          <Input label="CEP" value={form.cep} onChange={(e) => set("cep", maskCEP(e.target.value))}
            onBlur={buscarCep} hint={buscandoCep ? "Consultando o CEP…" : "Preenchido automaticamente."} />
          <Input label="Endereço" value={form.endereco} onChange={(e) => set("endereco", e.target.value)} />
          <Input label="Número" value={form.numeroEnd} onChange={(e) => set("numeroEnd", e.target.value)} />
          <Input label="Complemento" value={form.complemento} onChange={(e) => set("complemento", e.target.value)} />
          <Input label="Bairro" value={form.bairro} onChange={(e) => set("bairro", e.target.value)} />
          <Input label="Cidade" value={form.cidade} onChange={(e) => set("cidade", e.target.value)} />
          <Select label="UF" value={form.uf} onChange={(e) => set("uf", e.target.value)} options={UFS} />
        </div>
      </fieldset>

      <fieldset>
        <legend>4. Vida eclesiástica</legend>
        <div className="cols">
          <Input label="Data de batismo" type="date" value={form.batismo} onChange={(e) => set("batismo", e.target.value)} />
          <Input label="Nome do pastor" value={form.pastor} onChange={(e) => set("pastor", e.target.value)} />
          <Select label="Cargo / função" value={form.cargo} onChange={(e) => set("cargo", e.target.value)}
            options={CARGOS} disabled={!can("membros.aprovar")} />
        </div>
        <label className="switch">
          <input type="checkbox" checked={form.dizimista} onChange={(e) => set("dizimista", e.target.checked)} /> Dizimista
        </label>
        <label className="switch">
          <input type="checkbox" checked={form.ofertante} onChange={(e) => set("ofertante", e.target.checked)} /> Ofertante
        </label>
      </fieldset>

      <div className="row" style={{ justifyContent: "flex-end" }}>
        <button className="btn tonal" onClick={onCancelar}>Cancelar</button>
        <button className="btn" onClick={salvar}>{inicial ? "Salvar alterações" : "Enviar para aprovação"}</button>
      </div>
    </div>
  );
}
