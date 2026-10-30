export function cpfValido(cpfStr) {
  const cpf = cpfStr.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += Number(cpf[i]) * (10 - i);
  let d1 = (soma * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== Number(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += Number(cpf[i]) * (11 - i);
  let d2 = (soma * 10) % 11;
  if (d2 === 10) d2 = 0;
  return d2 === Number(cpf[10]);
}

export function emailValido(email) {
  return !email || /^\S+@\S+\.\S+$/.test(email);
}

// Regras do formulário de membro. Retorna { campo: mensagem }.
export function validarMembro(f) {
  const erros = {};
  if (!f.foto) erros.foto = "Anexe uma foto 3x4 ou 2x2.";
  if (!f.nome?.trim()) erros.nome = "Informe o nome completo.";
  else if (f.nome.trim().split(/\s+/).length < 2) erros.nome = "Informe nome e sobrenome.";
  if (!f.nascimento) erros.nascimento = "Informe a data de nascimento.";
  if (!f.naturalidade?.trim()) erros.naturalidade = "Informe a naturalidade.";
  if (!f.cpf) erros.cpf = "Informe o CPF.";
  else if (!cpfValido(f.cpf)) erros.cpf = "CPF inválido.";
  if (!f.celular || f.celular.replace(/\D/g, "").length < 10) erros.celular = "Informe um celular com DDD.";
  if (!emailValido(f.email)) erros.email = "E-mail inválido.";
  if (f.estadoCivil === "Casado" && !f.conjuge?.trim()) {
    erros.conjuge = "Obrigatório quando o estado civil é Casado.";
  }
  return erros;
}
