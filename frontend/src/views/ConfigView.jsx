import { useTheme } from "../context/ThemeContext";

export default function ConfigView() {
  const { tema, setTema } = useTheme();

  return (
    <div className="card">
      <h3>Aparência</h3>
      <div className="row">
        {["auto", "light", "dark"].map((t) => (
          <button key={t} className={`chip${tema === t ? " on" : ""}`} onClick={() => setTema(t)}>{t}</button>
        ))}
      </div>
    </div>
  );
}
