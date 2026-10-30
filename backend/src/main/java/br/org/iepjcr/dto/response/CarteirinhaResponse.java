package br.org.iepjcr.dto.response;

import br.org.iepjcr.domain.Grupo;
import br.org.iepjcr.domain.Membro;

import java.util.List;

public record CarteirinhaResponse(MembroResponse membro, List<String> grupos) {
    public static CarteirinhaResponse de(Membro membro, List<Grupo> grupos) {
        return new CarteirinhaResponse(
            MembroResponse.de(membro),
            grupos.stream().map(Grupo::getNome).toList()
        );
    }
}
