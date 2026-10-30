package br.org.iepjcr.controller;

import br.org.iepjcr.dto.request.TrocarSenhaRequest;
import br.org.iepjcr.dto.response.UsuarioResponse;
import br.org.iepjcr.security.UsuarioAutenticado;
import br.org.iepjcr.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // Nunca devolver a entidade Usuario crua: ela carrega senhaHash.
    // Todo retorno passa por UsuarioResponse.
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','PASTOR')")
    public List<UsuarioResponse> listar() {
        return usuarioService.listar().stream().map(UsuarioResponse::de).toList();
    }

    @PatchMapping("/{id}/alternar-ativo")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','PASTOR')")
    public UsuarioResponse alternarAtivo(@PathVariable UUID id, @AuthenticationPrincipal UsuarioAutenticado principal) {
        return UsuarioResponse.de(usuarioService.alternarAtivo(id, principal.getUsuario().getId()));
    }

    @PatchMapping("/me/senha")
    public void trocarSenha(@Valid @RequestBody TrocarSenhaRequest req, @AuthenticationPrincipal UsuarioAutenticado principal) {
        usuarioService.trocarSenha(principal.getUsuario().getId(), req.senhaAtual(), req.novaSenha());
    }
}
