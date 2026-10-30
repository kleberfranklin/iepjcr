function iniciais(nome = "?") {
  return nome.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

export default function Avatar({ nome, foto, tamanho = 36 }) {
  return (
    <div className="avatar" style={{ width: tamanho, height: tamanho, fontSize: tamanho * 0.34 }}>
      {foto ? <img src={foto} alt="" /> : iniciais(nome)}
    </div>
  );
}
