package br.org.iepjcr.dto.response;

import br.org.iepjcr.domain.Membro;
import java.time.LocalDate;
import java.util.UUID;

public record MembroResponse(
    UUID id, String numero, String foto, String nome, LocalDate nascimento,
    String cpf, String celular, String cargo, String igreja, String status
) {
    public static MembroResponse de(Membro m) {
        return new MembroResponse(
            m.getId(), m.getNumeroMembro(), m.getFotoUrl(), m.getNome(), m.getDataNascimento(),
            m.getCpf(), m.getCelular(), m.getCargo().name(),
            m.getIgreja() != null ? m.getIgreja().getNome() : null,
            m.getStatus().name()
        );
    }
}
