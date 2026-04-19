/**
 * EncodePanel
 * A reusable frosted-glass card wrapper used across the Encode page.
 *
 * Props:
 *   title    {string}    – Gold section heading displayed at the top of the card
 *   children {ReactNode} – Card body content
 */
export default function EncodePanel({ title, children }) {
  return (
    <div
      style={{
        background: "rgba(13,31,60,0.88)",
        border: "1px solid #1c3454",
        borderRadius: 14,
        padding: "22px",
        backdropFilter: "blur(8px)",
      }}
    >
      <h2
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "#c9a84c",
          marginBottom: 16,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
