/**
 * ExtractedMessage  —  Step 2 of the decode flow.
 *
 * A read-only display area for the extracted secret message.
 * Shows a placeholder when decoding hasn't happened yet,
 * a live "decoding…" shimmer while in progress,
 * and the final message + timestamp once complete.
 *
 * Props:
 *   message    {string}   – The extracted plaintext (empty string until decoded)
 *   decoding   {boolean}  – True while decode is in progress
 *   done       {boolean}  – True once decode is complete
 *   timestamp  {string}   – Human-readable decode timestamp (e.g. "Wednesday, January 28, 2026 at 4:04 AM WAT")
 */
export default function ExtractedMessage({ message, decoding, done, timestamp }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Message box */}
      <div
        style={{
          position: "relative",
          background: "rgba(10,20,40,0.5)",
          border: `1px solid ${done ? "rgba(201,168,76,0.3)" : "#1c3a5e"}`,
          borderRadius: 8,
          padding: "14px 14px 36px",
          minHeight: 130,
          transition: "border-color 0.3s",
          overflow: "hidden",
        }}
      >
        {decoding && !done ? (
          /* Shimmer / in-progress state */
          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 4 }}>
            {[100, 75, 88, 55].map((w, i) => (
              <div
                key={i}
                style={{
                  height: 11,
                  borderRadius: 4,
                  width: `${w}%`,
                  background: "linear-gradient(90deg, #1c3454 25%, #2a4a72 50%, #1c3454 75%)",
                  backgroundSize: "200% 100%",
                  animation: `shimmer 1.4s ${i * 0.15}s infinite linear`,
                }}
              />
            ))}
            <style>{`
              @keyframes shimmer {
                from { background-position: 200% 0; }
                to   { background-position: -200% 0; }
              }
            `}</style>
          </div>
        ) : done && message ? (
          /* Extracted message text */
          <p
            style={{
              fontSize: 13,
              color: "#c8d8ee",
              lineHeight: 1.75,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              margin: 0,
              fontFamily: "monospace",
            }}
          >
            {message}
          </p>
        ) : (
          /* Placeholder */
          <p style={{ fontSize: 13, color: "#334e68", fontStyle: "italic", margin: 0 }}>
            Extracted message will appear here after decoding…
          </p>
        )}

        {/* Copy button — shown when message is ready */}
        {done && message && (
          <CopyButton text={message} />
        )}
      </div>

      {/* Timestamp footer */}
      {done && timestamp && (
        <p
          style={{
            fontSize: 11,
            color: "#4a6a8a",
            marginTop: 8,
            fontFamily: "monospace",
            letterSpacing: "0.01em",
          }}
        >
          Decoded on {timestamp}
        </p>
      )}
    </div>
  );
}

/* ── Copy button ─────────────────────────────────────────────── */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard access may be denied in some environments
    }
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy message"
      style={{
        position: "absolute",
        bottom: 10,
        right: 12,
        display: "flex",
        alignItems: "center",
        gap: 5,
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: 11,
        color: copied ? "#6ee7b7" : "#4a6a8a",
        transition: "color 0.2s",
        padding: 0,
      }}
      onMouseEnter={(e) => { if (!copied) e.currentTarget.style.color = "#c9a84c"; }}
      onMouseLeave={(e) => { if (!copied) e.currentTarget.style.color = "#4a6a8a"; }}
    >
      {copied ? (
        <>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

// useState is needed for CopyButton — import at top of file
import { useState } from "react";
