package br.org.iepjcr.security;

import br.org.iepjcr.domain.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.List;

/** Adapta Usuario ao contrato do Spring Security. A autoridade é o perfil
 *  em maiúsculas com prefixo ROLE_, usado nas anotações @PreAuthorize dos controllers. */
public class UsuarioAutenticado extends User {

    private final Usuario usuario;

    public UsuarioAutenticado(Usuario usuario) {
        super(usuario.getId().toString(), usuario.getSenhaHash(), autoridades(usuario));
        this.usuario = usuario;
    }

    private static List<GrantedAuthority> autoridades(Usuario usuario) {
        return List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getPerfil().name()));
    }

    public Usuario getUsuario() {
        return usuario;
    }
}
