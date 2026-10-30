package br.org.iepjcr.repository;

import br.org.iepjcr.domain.MembroFilho;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface MembroFilhoRepository extends JpaRepository<MembroFilho, UUID> { }
