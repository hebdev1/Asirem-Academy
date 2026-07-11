/**
 * Material Symbols Outlined icon. The font is loaded once in the admin layout.
 * Usage: <Icon name="hub" size={22} />
 */
export function Icon({
  name,
  size = 20,
  className,
  style,
}: {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={className ? `msym ${className}` : "msym"}
      style={{ fontSize: size, ...style }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
