package br.org.iepjcr.controller;

import br.org.iepjcr.domain.Evento;
import br.org.iepjcr.dto.request.EventoRequest;
import br.org.iepjcr.security.UsuarioAutenticado;
import br.org.iepjcr.service.EventoService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/eventos")
public class EventoController {

    private final EventoService eventoService;

    public EventoController(EventoService eventoService) {
        this.eventoService = eventoService;
    }

    /** Todo usuário autenticado pode ver eventos — o filtro por visibilidade
     *  (grupo do membro) acontece dentro do service. */
    @GetMapping
    public List<Evento> listar(
        @RequestParam(required = false) LocalDate de,
        @RequestParam(required = false) LocalDate ate,
        @RequestParam(required = false) UUID grupoId,
        @AuthenticationPrincipal UsuarioAutenticado principal
    ) {
        return eventoService.listar(de, ate, grupoId, principal);
    }

    @GetMapping("/{id}")
    public Evento obter(@PathVariable UUID id) {
        return eventoService.obter(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','PASTOR','SECRETARIO','LIDER')")
    public Evento criar(@Valid @RequestBody EventoRequest req) {
        return eventoService.criar(req);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','PASTOR','SECRETARIO','LIDER')")
    public Evento atualizar(@PathVariable UUID id, @Valid @RequestBody EventoRequest req) {
        return eventoService.atualizar(id, req);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','PASTOR','SECRETARIO')")
    public void excluir(@PathVariable UUID id) {
        eventoService.excluir(id);
    }
}
