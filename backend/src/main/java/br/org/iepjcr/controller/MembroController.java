package br.org.iepjcr.controller;

import br.org.iepjcr.domain.Membro;
import br.org.iepjcr.domain.enums.StatusCadastro;
import br.org.iepjcr.dto.request.DecisaoAprovacaoRequest;
import br.org.iepjcr.dto.request.MembroRequest;
import br.org.iepjcr.dto.response.CarteirinhaResponse;
import br.org.iepjcr.dto.response.MembroResponse;
import br.org.iepjcr.exception.ResourceNotFoundException;
import br.org.iepjcr.security.UsuarioAutenticado;
import br.org.iepjcr.service.MembroService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/membros")
public class MembroController {

    private final MembroService membroService;

    public MembroController(MembroService membroService) {
        this.membroService = membroService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','PASTOR','SECRETARIO','LIDER')")
    public List<MembroResponse> listar(
        @RequestParam(required = false) String busca,
        @RequestParam(required = false) StatusCadastro status
    ) {
        return membroService.listar(busca, status).stream().map(MembroResponse::de).toList();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','PASTOR','SECRETARIO','LIDER')")
    public MembroResponse obter(@PathVariable UUID id) {
        return MembroResponse.de(membroService.obter(id));
    }

    /** Criação fica aberta a qualquer usuário autenticado — o pré-cadastro público
     *  (Nome + celular) é tratado à parte em AuthController.preCadastro. */
    @PostMapping
    public MembroResponse criar(@Valid @RequestBody MembroRequest req) {
        return MembroResponse.de(membroService.criar(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','PASTOR','SECRETARIO')")
    public MembroResponse atualizar(@PathVariable UUID id, @Valid @RequestBody MembroRequest req) {
        return MembroResponse.de(membroService.atualizar(id, req));
    }

    @PatchMapping("/{id}/aprovar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','PASTOR','SECRETARIO')")
    public MembroResponse aprovar(@PathVariable UUID id) {
        return MembroResponse.de(membroService.aprovar(id));
    }

    @PatchMapping("/{id}/reprovar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','PASTOR','SECRETARIO')")
    public MembroResponse reprovar(@PathVariable UUID id, @RequestBody DecisaoAprovacaoRequest req) {
        return MembroResponse.de(membroService.reprovar(id, req.observacao()));
    }

    /** Cada membro só enxerga a própria carteirinha (regra de negócio: Membro
     *  só acessa Calendário, Eventos e a carteirinha DELE, nunca a de terceiros). */
    @GetMapping("/me/carteirinha")
    public CarteirinhaResponse minhaCarteirinha(@AuthenticationPrincipal UsuarioAutenticado principal) {
        Membro membro = principal.getUsuario().getMembro();
        if (membro == null) throw new ResourceNotFoundException("Usuário não está vinculado a um membro.");
        return CarteirinhaResponse.de(membro, membroService.gruposDoMembro(membro.getId()));
    }
}
