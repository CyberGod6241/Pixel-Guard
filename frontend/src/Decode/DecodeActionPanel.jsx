import {
  LockIcon,
  DownloadIcon,
  SpinnerIcon,
  InfoIcon,
  CheckIcon,
} from "../Encode/icons";

/**
 * DecodeActionPanel  —  Right column of the decode page.
 *
 * Displays:
 *   - A 16:9 image preview of the selected stego-image
 *   - The primary "DECODE MESSAGE" CTA button
 *   - An animated progress bar
 *   - Contextual status hints / success banner
 *
 * Props:
 *   image      {{ url: string, name: string } | null}
 *   progress   {number}   0–100
 *   decoding   {boolean}
 *   done       {boolean}
 *   onDecode   {() => void}
 */
export default function DecodeActionPanel({
  image,
  progress,
  decoding,
  done,
  onDecode,
}) {
  const canDecode = image && !decoding;

  return (
    <div
      style={{
        background: "rgba(13,31,60,0.88)",
        border: "1px solid #1c3454",
        borderRadius: 14,
        padding: "22px",
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        gap: 0,
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
        Preview &amp; Action
      </h2>

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
          marginBottom: 18,
        }}
      >
        {image ? (
          <img
            src={image.url}
            alt="stego image preview"
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

      {/* ── Decode CTA button ── */}
      <DecodeButton
        canDecode={canDecode}
        decoding={decoding}
        done={done}
        onDecode={onDecode}
      />

      {/* ── Progress bar ── */}
      <div style={{ marginTop: 16 }}>
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
          <div
            style={{
              height: "100%",
              borderRadius: 999,
              width: `${progress}%`,
              background: done
                ? "linear-gradient(90deg, #6ee7b7, #34d399)"
                : "linear-gradient(90deg, #c9a84c, #e8c76a)",
              transition: "width 0.15s ease",
              boxShadow: progress > 0 ? "0 0 8px rgba(201,168,76,0.5)" : "none",
            }}
          />
        </div>
      </div>

      {/* ── Status hints ── */}
      <DecodeHints image={image} done={done} />
    </div>
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

function DecodeButton({ canDecode, decoding, done, onDecode }) {
  const base = {
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

  if (decoding) {
    return (
      <button
        disabled
        style={{
          ...base,
          cursor: "default",
          background: "linear-gradient(135deg, #a87e30, #c9a84c)",
          color: "#060e1b",
        }}
      >
        <SpinnerIcon />
        Decoding…
      </button>
    );
  }

  if (done) {
    return (
      <button
        onClick={onDecode}
        style={{
          ...base,
          cursor: "pointer",
          background: "linear-gradient(135deg, #0d9a6e, #34d399)",
          color: "#03291d",
          boxShadow: "0 6px 24px rgba(52,211,153,0.25)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <CheckIcon />
        Message Extracted
      </button>
    );
  }

  return (
    <button
      onClick={onDecode}
      disabled={!canDecode}
      style={{
        ...base,
        cursor: canDecode ? "pointer" : "not-allowed",
        background: canDecode
          ? "linear-gradient(135deg, #c9a84c 0%, #e8c76a 100%)"
          : "#1c3454",
        color: canDecode ? "#060e1b" : "#2d4560",
        boxShadow: canDecode ? "0 6px 28px rgba(201,168,76,0.3)" : "none",
      }}
      onMouseEnter={(e) => {
        if (canDecode) e.currentTarget.style.transform = "scale(1.02)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {/* Unlock icon for decode */}
      <svg
        width="15"
        height="15"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
        />
      </svg>
      Decode Message
    </button>
  );
}

function DecodeHints({ image, done }) {
  const hintStyle = {
    display: "flex",
    alignItems: "center",
    gap: 7,
    marginTop: 12,
    fontSize: 12,
    color: "#4a6a8a",
  };

  if (done) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 12,
          padding: "9px 12px",
          borderRadius: 8,
          background: "rgba(110,231,183,0.07)",
          border: "1px solid rgba(110,231,183,0.22)",
          fontSize: 12,
          color: "#6ee7b7",
        }}
      >
        <CheckIcon />
        Secret message successfully extracted!
      </div>
    );
  }

  if (!image) {
    return (
      <div style={hintStyle}>
        <InfoIcon />
        Select a stego-image to begin decoding
      </div>
    );
  }

  return (
    <div style={hintStyle}>
      <InfoIcon />
      Click Decode Message to extract hidden data
    </div>
  );
}

// Re-export CheckIcon and InfoIcon used locally
// function CheckIcon() {
//   return (
//     <svg
//       width="13"
//       height="13"
//       fill="none"
//       stroke="#6ee7b7"
//       strokeWidth={2.2}
//       viewBox="0 0 24 24"
//     >
//       <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//     </svg>
//   );
// }

// function InfoIcon() {
//   return (
//     <svg
//       width="12"
//       height="12"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth={2}
//       viewBox="0 0 24 24"
//     >
//       <circle cx="12" cy="12" r="10" />
//       <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
//     </svg>
//   );
// }
