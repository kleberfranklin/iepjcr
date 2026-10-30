package br.org.iepjcr.repository;

import br.org.iepjcr.domain.Membro;
import br.org.iepjcr.domain.enums.StatusCadastro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MembroRepository extends JpaRepository<Membro, UUID> {

    Optional<Membro> findByCpf(String cpf);

    Optional<Membro> findByCelular(String celular);

    List<Membro> findByStatus(StatusCadastro status);

    @Query("""
           select m from Membro m
           where (:busca is null or lower(m.nome) like lower(concat('%', :busca, '%'))
                                  or m.cpf like concat('%', :busca, '%'))
             and (:status is null or m.status = :status)
           order by m.nome
           """)
    List<Membro> buscar(@Param("busca") String busca, @Param("status") StatusCadastro status);

    boolean existsByCpf(String cpf);
}
