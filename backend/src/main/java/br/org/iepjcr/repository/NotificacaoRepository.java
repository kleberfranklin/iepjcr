package br.org.iepjcr.repository;

import br.org.iepjcr.domain.Notificacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface NotificacaoRepository extends JpaRepository<Notificacao, UUID> { }
