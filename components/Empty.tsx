export default function Empty({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return <div className={className} style={{ width: size, height: size }} />;
}
