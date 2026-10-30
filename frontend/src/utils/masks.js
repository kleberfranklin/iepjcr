export const onlyDigits = (s = "") => s.replace(/\D/g, "");

export const maskCPF = (v) => {
  v = onlyDigits(v).slice(0, 11);
  return v
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const maskCEP = (v) => {
  v = onlyDigits(v).slice(0, 8);
  return v.replace(/(\d{5})(\d)/, "$1-$2");
};

export const maskTelefone = (v) => {
  v = onlyDigits(v).slice(0, 11);
  return v.length <= 10
    ? v.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2")
    : v.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
};
