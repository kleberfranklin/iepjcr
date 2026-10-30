import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ titulo, onFechar, largo = false, children }) {
  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && onFechar();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onFechar]);

  return createPortal(
    <div className="modal-scrim" onClick={(e) => e.target === e.currentTarget && onFechar()}>
      <div className="modal" style={largo ? { maxWidth: 760 } : undefined}>
        <div className="modal-head">
          <h2>{titulo}</h2>
          <button className="iconbtn" onClick={onFechar} aria-label="Fechar">✕</button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
