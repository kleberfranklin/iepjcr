package br.org.iepjcr.repository;

import br.org.iepjcr.domain.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface EventoRepository extends JpaRepository<Evento, UUID> {

    @Query("""
           select e from Evento e
           where (:de is null or e.data >= :de)
             and (:ate is null or e.data <= :ate)
             and (:grupoId is null or e.grupo.id = :grupoId)
           order by e.data, e.horaInicio
           """)
    List<Evento> buscar(@Param("de") LocalDate de, @Param("ate") LocalDate ate, @Param("grupoId") UUID grupoId);

    /** Eventos visíveis a um membro: sem grupo (todos) ou de um grupo ao qual ele pertence. */
    @Query("""
           select e from Evento e
           where e.grupo is null or e.grupo.id in
             (select g.id from Grupo g join g.membros m where m.id = :membroId)
           order by e.data, e.horaInicio
           """)
    List<Evento> buscarVisiveisParaMembro(@Param("membroId") UUID membroId);
}
