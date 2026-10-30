package br.org.iepjcr.service;

import br.org.iepjcr.domain.Usuario;
import br.org.iepjcr.exception.BusinessException;
import br.org.iepjcr.exception.ResourceNotFoundException;
import br.org.iepjcr.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    @Transactional
    public Usuario alternarAtivo(UUID id, UUID solicitanteId) {
        if (id.equals(solicitanteId)) {
            throw new BusinessException("Você não pode desativar o próprio acesso.");
        }
        Usuario usuario = obter(id);
        usuario.setAtivo(!usuario.isAtivo());
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public void trocarSenha(UUID usuarioId, String senhaAtual, String novaSenha) {
        Usuario usuario = obter(usuarioId);
        if (!passwordEncoder.matches(senhaAtual, usuario.getSenhaHash())) {
            throw new BusinessException("A senha atual não confere.");
        }
        usuario.setSenhaHash(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);
    }

    private Usuario obter(UUID id) {
        return usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
    }
}
