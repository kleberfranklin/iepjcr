export default function Input({ label, required, error, hint, ...inputProps }) {
  return (
    <div className={`field${error ? " bad" : ""}`}>
      <label>{label}{required && <span className="req"> *</span>}</label>
      <input {...inputProps} />
      {error ? <span className="err">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </div>
  );
}
