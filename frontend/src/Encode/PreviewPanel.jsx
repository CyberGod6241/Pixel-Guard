import EncodePanel from "./EncodePanel";
import { LockIcon, DownloadIcon, SpinnerIcon, InfoIcon, CheckIcon } from "./icons";

/**
 * PreviewPanel  —  Right column of the encode page.
 *
 * Displays:
 *   - A 16:9 image preview (empty state when no image is selected)
 *   - An animated progress bar
 *   - Contextual status hints / success banner
 *   - The primary Encode & Download CTA button
 *   - A metadata strip showing filename + character count
 *
 * Props:
 *   image      {{ url: string, name: string } | null}
 *   message    {string}
 *   progress   {number}   0–100
 *   encoding   {boolean}
 *   done       {boolean}
 *   onEncode   {() => void}
 */
export default function PreviewPanel({
  image,
  message,
  progress,
  encoding,
  done,
  onEncode,
}) {
  const canEncode = image && message.trim().length > 0 && !encoding;

  return (
    <EncodePanel title="Preview & Action">
      {/* ── Image preview ── */}
      <div
        style={{
          width: "100%",
          aspectRatio: "16 / 9",
          borderRadius: 10,
          overflow: "hidden",
          background: "#0a1628",
          border: "1px solid #1c3a5e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        {image ? (
          <img
            src={image.url}
            alt="stego preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <EmptyPreview />
        )}
      </div>

      {/* ── Progress bar ── */}
      <ProgressBar progress={progress} done={done} />

      {/* ── Status hints ── */}
      <StatusHints image={image} message={message} done={done} />

      {/* ── CTA button ── */}
      <EncodeButton
        canEncode={canEncode}
        encoding={encoding}
        done={done}
        onEncode={onEncode}
      />

      {/* ── File metadata strip ── */}
      {image && (
        <FileStrip
          name={image.name}
          charCount={message.length}
        />
      )}
    </EncodePanel>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function EmptyPreview() {
  return (
    <div style={{ textAlign: "center", color: "#2d4560" }}>
      <svg
        width="38"
        height="38"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        viewBox="0 0 24 24"
        style={{ marginBottom: 8 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <p style={{ fontSize: 12 }}>No image selected</p>
    </div>
  );
}

function ProgressBar({ progress, done }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {/* Label row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 12, color: "#7a9ab8", fontWeight: 500 }}>
          Progress
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: done ? "#6ee7b7" : "#7a9ab8",
            transition: "color 0.3s",
          }}
        >
          {done ? "✓ Complete" : `${progress}%`}
        </span>
      </div>

      {/* Track */}
      <div
        style={{
          width: "100%",
          height: 6,
          borderRadius: 999,
          background: "#0d1f3c",
          border: "1px solid #1c3454",
          overflow: "hidden",
        }}
      >
        {/* Fill */}
        <div
          style={{
            height: "100%",
            borderRadius: 999,
            width: `${progress}%`,
            background: done
              ? "linear-gradient(90deg, #6ee7b7, #34d399)"
              : "linear-gradient(90deg, #c9a84c, #e8c76a)",
            transition: "width 0.15s ease",
            boxShadow:
              progress > 0 ? "0 0 8px rgba(201,168,76,0.5)" : "none",
          }}
        />
      </div>
    </div>
  );
}

function StatusHints({ image, message, done }) {
  if (done) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
          borderRadius: 8,
          background: "rgba(110,231,183,0.08)",
          border: "1px solid rgba(110,231,183,0.25)",
          marginBottom: 14,
        }}
      >
        <CheckIcon />
        <span style={{ fontSize: 12, color: "#6ee7b7" }}>
          Encoding complete — your stego-image is ready!
        </span>
      </div>
    );
  }

  if (!image) {
    return <HintRow text="Select a cover image to get started" />;
  }

  if (!message.trim()) {
    return <HintRow text="Enter your secret message below" />;
  }

  return null;
}

function HintRow({ text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        marginBottom: 14,
        fontSize: 12,
        color: "#4a6a8a",
      }}
    >
      <InfoIcon />
      {text}
    </div>
  );
}

function EncodeButton({ canEncode, encoding, done, onEncode }) {
  const baseStyle = {
    width: "100%",
    padding: "16px 24px",
    borderRadius: 10,
    border: "none",
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    transition: "all 0.25s",
  };

  if (done) {
    return (
      <button
        onClick={onEncode}
        style={{
          ...baseStyle,
          cursor: "pointer",
          background: "linear-gradient(135deg, #0d9a6e, #34d399)",
          color: "#03291d",
          boxShadow: "0 6px 24px rgba(52,211,153,0.25)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <DownloadIcon />
        Download Stego-Image
      </button>
    );
  }

  if (encoding) {
    return (
      <button
        disabled
        style={{
          ...baseStyle,
          cursor: "default",
          background: "linear-gradient(135deg, #a87e30, #c9a84c)",
          color: "#060e1b",
        }}
      >
        <SpinnerIcon />
        Encoding…
      </button>
    );
  }

  return (
    <button
      onClick={onEncode}
      disabled={!canEncode}
      style={{
        ...baseStyle,
        cursor: canEncode ? "pointer" : "not-allowed",
        background: canEncode
          ? "linear-gradient(135deg, #c9a84c 0%, #e8c76a 100%)"
          : "#1c3454",
        color: canEncode ? "#060e1b" : "#2d4560",
        boxShadow: canEncode ? "0 6px 28px rgba(201,168,76,0.3)" : "none",
      }}
      onMouseEnter={(e) => {
        if (canEncode) e.currentTarget.style.transform = "scale(1.02)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <LockIcon />
      Encode &amp; Download
    </button>
  );
}

function FileStrip({ name, charCount }) {
  return (
    <div
      style={{
        marginTop: 12,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        borderRadius: 6,
        background: "rgba(201,168,76,0.05)",
        border: "1px solid rgba(201,168,76,0.12)",
      }}
    >
      <svg
        width="12"
        height="12"
        fill="none"
        stroke="#c9a84c"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span
        style={{ fontSize: 11, color: "#5a7a9e", fontFamily: "monospace" }}
      >
        {name} · {charCount} char{charCount !== 1 ? "s" : ""} hidden
      </span>
    </div>
  );
}
