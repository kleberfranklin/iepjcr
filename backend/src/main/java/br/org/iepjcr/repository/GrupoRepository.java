package br.org.iepjcr.repository;

import br.org.iepjcr.domain.Grupo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface GrupoRepository extends JpaRepository<Grupo, UUID> {
    List<Grupo> findByMembros_Id(UUID membroId);
    List<Grupo> findByAtivoTrue();
}
