package br.org.iepjcr.security;

import br.org.iepjcr.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UserDetailsServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    /** O "username" do Spring Security aqui é o ID (UUID) do usuário, extraído do JWT. */
    @Override
    public UserDetails loadUserByUsername(String usuarioId) throws UsernameNotFoundException {
        var usuario = usuarioRepository.findById(UUID.fromString(usuarioId))
            .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
        if (!usuario.isAtivo()) {
            throw new UsernameNotFoundException("Usuário desativado");
        }
        return new UsuarioAutenticado(usuario);
    }
}
