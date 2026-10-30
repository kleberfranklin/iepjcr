package br.org.iepjcr.repository;

import br.org.iepjcr.domain.SolicitacaoAcesso;
import br.org.iepjcr.domain.enums.StatusSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SolicitacaoAcessoRepository extends JpaRepository<SolicitacaoAcesso, UUID> {
    List<SolicitacaoAcesso> findByStatus(StatusSolicitacao status);
}
