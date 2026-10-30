package br.org.iepjcr.dto.response;

import br.org.iepjcr.domain.Usuario;
import java.util.UUID;

public record UsuarioResponse(UUID id, String nome, String email, String perfil, UUID membroId) {
    public static UsuarioResponse de(Usuario u) {
        return new UsuarioResponse(
            u.getId(), u.getNome(), u.getEmail(), u.getPerfil().name(),
            u.getMembro() != null ? u.getMembro().getId() : null
        );
    }
}
