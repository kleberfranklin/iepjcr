import { useEffect, useRef } from "react";
import { formatarData } from "../../utils/date";

// Reproduz o modelo do cartão físico da igreja (frente e verso).
export default function Carteirinha({ membro, grupos = [] }) {
  const qrRef = useRef(null);

  useEffect(() => {
    if (!membro || membro.status !== "Aprovado" || !qrRef.current || !window.QRCode) return;
    qrRef.current.innerHTML = "";
    // eslint-disable-next-line no-new
    new window.QRCode(qrRef.current, {
      text: `https://iepjcr.org/validar/${membro.numero}`,
      width: 132, height: 132
    });
  }, [membro]);

  if (!membro) return <p className="muted">Carteirinha indisponível.</p>;
  if (membro.status !== "Aprovado") {
    return <p className="muted">O cadastro está em análise. A carteirinha aparece aqui após a aprovação.</p>;
  }

  return (
    <div className="carteira">
      <div className="idcard">
        <div className="topo">
          <div className="logo"><img src="/logo-igreja.png" alt="IEPJCR" /></div>
          <div className="photo">{membro.foto && <img src={membro.foto} alt="" />}</div>
        </div>
        <p className="cert">
          Certificamos que o(a) portador(a) deste, foi batizado(a) por imersão em nome do Pai,
          do Filho e do Espírito Santo, em {formatarData(membro.batismo)}.
        </p>
        <div className="campo"><b>CARGO MINISTERIAL</b><span>{membro.cargo}</span></div>
        <div className="selo">
          <div ref={qrRef} />
          <div>
            <div className="muted">REGISTRO Nº</div>
            <div className="num">{membro.numero}</div>
          </div>
        </div>
      </div>

      <div className="idcard">
        <div className="campo"><b>Nome</b><span>{membro.nome}</span></div>
        <div className="campo"><b>Endereço</b><span>{membro.endereco}, {membro.numeroEnd}</span></div>
        <div className="campo"><b>Pai</b><span>{membro.pai}</span></div>
        <div className="campo"><b>Mãe</b><span>{membro.mae}</span></div>
        <div className="campo"><b>Est. Civil</b><span>{membro.estadoCivil}</span></div>
      </div>

      {grupos.length > 0 && (
        <div>
          <h3>Grupos</h3>
          <div className="row">{grupos.map((g) => <span key={g.id} className="tag neutral">{g.nome}</span>)}</div>
        </div>
      )}
    </div>
  );
}
