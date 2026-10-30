package br.org.iepjcr.controller;

import br.org.iepjcr.dto.request.ComunicadoRequest;
import br.org.iepjcr.service.NotificacaoService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notificacoes")
public class NotificacaoController {

    private final NotificacaoService notificacaoService;

    public NotificacaoController(NotificacaoService notificacaoService) {
        this.notificacaoService = notificacaoService;
    }

    @PostMapping("/comunicado")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','PASTOR','SECRETARIO')")
    public void enviarComunicado(@Valid @RequestBody ComunicadoRequest req) {
        notificacaoService.enviarComunicado(req.titulo(), req.texto());
    }
}
