package br.org.iepjcr.controller;

import br.org.iepjcr.domain.Grupo;
import br.org.iepjcr.service.GrupoService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/grupos")
public class GrupoController {

    private final GrupoService grupoService;

    public GrupoController(GrupoService grupoService) {
        this.grupoService = grupoService;
    }

    @GetMapping
    public List<Grupo> listar() {
        return grupoService.listar();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','PASTOR')")
    public Grupo criar(@RequestBody Map<String, String> body) {
        return grupoService.criar(body.get("nome"), body.get("descricao"));
    }

    @PatchMapping("/{id}/desabilitar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','PASTOR')")
    public Grupo desabilitar(@PathVariable UUID id) {
        return grupoService.desabilitar(id);
    }

    /** Só Pastor(a) (ou Administrador) promove/remove líder — regra de negócio explícita. */
    @PatchMapping("/{id}/lider")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','PASTOR')")
    public Grupo definirLider(@PathVariable UUID id, @RequestBody Map<String, UUID> body) {
        return grupoService.definirLider(id, body.get("membroId"));
    }

    @PatchMapping("/{id}/membros/{membroId}/alternar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','PASTOR','SECRETARIO','LIDER')")
    public Grupo alternarMembro(@PathVariable UUID id, @PathVariable UUID membroId) {
        return grupoService.alternarMembro(id, membroId);
    }
}
