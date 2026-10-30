package br.org.iepjcr.controller;

import br.org.iepjcr.service.RelatorioService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/relatorios")
@PreAuthorize("hasAnyRole('ADMINISTRADOR','PASTOR','SECRETARIO','LIDER')")
public class RelatorioController {

    private final RelatorioService relatorioService;

    public RelatorioController(RelatorioService relatorioService) {
        this.relatorioService = relatorioService;
    }

    @GetMapping("/membros/resumo")
    public Map<String, Long> resumoMembros() {
        return relatorioService.resumoMembros();
    }
}
