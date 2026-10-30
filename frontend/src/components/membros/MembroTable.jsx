import Avatar from "../common/Avatar";
import StatusTag from "../common/StatusTag";
import { idade } from "../../utils/date";

export default function MembroTable({ membros, onAbrir }) {
  return (
    <div className="tbl-wrap">
      <table>
        <thead>
          <tr><th>Nº</th><th>Membro</th><th>Cargo</th><th>Igreja</th><th>Situação</th><th /></tr>
        </thead>
        <tbody>
          {membros.map((m) => (
            <tr key={m.id}>
              <td className="num">{m.numero}</td>
              <td>
                <div className="cellname">
                  <Avatar nome={m.nome} foto={m.foto} tamanho={34} />
                  <div>
                    <b>{m.nome}</b>
                    <div className="muted">{idade(m.nascimento)} anos · {m.celular}</div>
                  </div>
                </div>
              </td>
              <td>{m.cargo}</td>
              <td>{m.igreja}</td>
              <td><StatusTag status={m.status} /></td>
              <td><button className="btn text" onClick={() => onAbrir(m)}>Abrir</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
