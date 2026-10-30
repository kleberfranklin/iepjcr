// Consulta direta ao ViaCEP a partir do navegador (nao passa pelo backend).
export const cepApi = {
  async buscar(cep) {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) throw new Error("CEP invalido");
    const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
    const data = await res.json();
    if (data.erro) throw new Error("CEP nao encontrado");
    return {
      endereco: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      uf: data.uf
    };
  }
};
