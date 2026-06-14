// Decorative gold gradient rule between page sections — matches the accent line
// at the top of the Footer so every section is separated consistently.
export default function SectionDivider() {
  return (
    <div
      aria-hidden="true"
      className="h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-40)] to-transparent"
    />
  );
}
