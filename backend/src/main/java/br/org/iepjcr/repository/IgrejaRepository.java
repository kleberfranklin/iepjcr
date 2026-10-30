package br.org.iepjcr.repository;

import br.org.iepjcr.domain.Igreja;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface IgrejaRepository extends JpaRepository<Igreja, UUID> { }
