export default function Select({ label, required, error, hint, placeholder, options, ...selectProps }) {
  return (
    <div className={`field${error ? " bad" : ""}`}>
      <label>{label}{required && <span className="req"> *</span>}</label>
      <select {...selectProps}>
        <option value="">{placeholder || "Selecione"}</option>
        {options.map((opt) => {
          const value = typeof opt === "string" ? opt : opt.value;
          const rotulo = typeof opt === "string" ? opt : opt.label;
          return <option key={value} value={value}>{rotulo}</option>;
        })}
      </select>
      {error ? <span className="err">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </div>
  );
}
