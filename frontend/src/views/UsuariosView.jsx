import { useEffect, useState } from "react";
import { usuariosApi } from "../api/usuariosApi";
import Avatar from "../components/common/Avatar";

export default function UsuariosView() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => { usuariosApi.listar().then(setUsuarios); }, []);

  return (
    <div className="tbl-wrap">
      <table>
        <thead><tr><th>Usuário</th><th>Perfil</th><th>Situação</th></tr></thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td><div className="cellname"><Avatar nome={u.nome} tamanho={34} /><b>{u.nome}</b></div></td>
              <td>{u.perfil}</td>
              <td>{u.ativo ? "Ativo" : "Inativo"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
