package br.org.iepjcr.service;

import br.org.iepjcr.repository.GrupoRepository;
import br.org.iepjcr.repository.MembroRepository;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class RelatorioService {

    private final MembroRepository membroRepository;
    private final GrupoRepository grupoRepository;

    public RelatorioService(MembroRepository membroRepository, GrupoRepository grupoRepository) {
        this.membroRepository = membroRepository;
        this.grupoRepository = grupoRepository;
    }

    /** Implementação de referência: em produção, troque por consultas às views
     *  vw_resumo_membros / vw_membros_por_grupo / vw_faixa_etaria (V1__schema.sql)
     *  via @Query nativa, evitando carregar entidades inteiras. */
    public Map<String, Long> resumoMembros() {
        long total = membroRepository.count();
        return Map.of("total", total);
    }
}
