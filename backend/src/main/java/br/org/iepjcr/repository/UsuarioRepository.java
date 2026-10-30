package br.org.iepjcr.repository;

import br.org.iepjcr.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {

    Optional<Usuario> findByLogin(String login);

    Optional<Usuario> findByEmail(String email);

    /** Login por CPF ou celular: busca pelo membro vinculado ao usuário. */
    Optional<Usuario> findByMembro_CpfOrMembro_Celular(String cpf, String celular);
}
