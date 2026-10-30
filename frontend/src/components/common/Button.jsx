// Botão único do app: variant = "filled" | "tonal" | "text" | "danger".
export default function Button({ variant = "filled", size, children, className = "", ...props }) {
  const classes = ["btn", variant !== "filled" ? variant : "", size ? size : "", className]
    .filter(Boolean).join(" ");
  return <button className={classes} {...props}>{children}</button>;
}
