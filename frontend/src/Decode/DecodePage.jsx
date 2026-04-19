import { useState, useCallback } from "react";
import EncodeBackground from "../encode/EncodeBackground";
import DecodeImageSelector from "./DecodeImageSelector";
import ExtractedMessage from "./ExtractedMessage";
import DecodeActionPanel from "./DecodeActionPanel";

// Simulated hidden message for demo purposes
const DEMO_MESSAGE =
  "Hello World! This is a confidential message hidden using LSB steganography.\nThe quick brown fox jumps over the lazy dog.\n###";

/**
 * DecodePage
 * Orchestrates the decode flow. Owns all shared state and coordinates
 * DecodeImageSelector, ExtractedMessage, and DecodeActionPanel.
 *
 * Props:
 *   onBackToHome  {() => void}
 */
export default function DecodePage({ onBackToHome }) {
  const [image, setImage]         = useState(null);   // { url, name, file }
  const [message, setMessage]     = useState("");
  const [progress, setProgress]   = useState(0);
  const [decoding, setDecoding]   = useState(false);
  const [done, setDone]           = useState(false);
  const [timestamp, setTimestamp] = useState("");

  // ── Handlers ──────────────────────────────────────────────
  const handleImage = useCallback((file) => {
    const url = URL.createObjectURL(file);
    setImage({ url, name: file.name, file });
    setMessage("");
    setProgress(0);
    setDone(false);
    setTimestamp("");
  }, []);

  const handleDecode = () => {
    if (!image || decoding) return;
    setDecoding(true);
    setDone(false);
    setMessage("");
    setProgress(0);

    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 13 + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setDecoding(false);
        setDone(true);
        setMessage(DEMO_MESSAGE);
        setTimestamp(
          new Date().toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            timeZoneName: "short",
          })
        );
      }
      setProgress(Math.min(Math.round(p), 100));
    }, 110);
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07101f",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        color: "white",
      }}
    >
      <EncodeBackground />
      <DecodeNavbar onBackToHome={onBackToHome} />

      <div style={{ position: "relative", zIndex: 1, paddingTop: 88, minHeight: "100vh" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 24px 40px" }}>

          {/* Back link */}
          <BackLink onClick={onBackToHome} />

          {/* Two-column grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              alignItems: "start",
            }}
          >
            {/* Left column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Step 1 — image picker */}
              <SectionPanel title="1. Select Image to Decode">
                <DecodeImageSelector image={image} onImage={handleImage} />
              </SectionPanel>

              {/* Step 2 — extracted message */}
              <SectionPanel title="2. Extracted Secret Message">
                <ExtractedMessage
                  message={message}
                  decoding={decoding}
                  done={done}
                  timestamp={timestamp}
                />
              </SectionPanel>
            </div>

            {/* Right column */}
            <DecodeActionPanel
              image={image}
              progress={progress}
              decoding={decoding}
              done={done}
              onDecode={handleDecode}
            />
          </div>
        </div>
      </div>

      <footer
        style={{
          position: "relative",
          zIndex: 1,
          borderTop: "1px solid rgba(30,58,95,0.35)",
          padding: "18px 40px",
          background: "#060c1a",
          textAlign: "center",
          fontSize: 11,
          color: "#2d4560",
        }}
      >
        © 2025 PixelGuard Project · BSc Computer Science Final Year Project
      </footer>
    </div>
  );
}

/* ── Page-local sub-components ─────────────────────────────── */

/** Thin frosted-glass card wrapper (mirrors EncodePanel visually) */
function SectionPanel({ title, children }) {
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

function DecodeNavbar({ onBackToHome }) {
  const link = {
    background: "none", border: "none", cursor: "pointer",
    fontSize: 13, fontWeight: 500, padding: 0, transition: "color 0.2s",
  };
  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 40px",
        background: "rgba(6,12,26,0.88)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(201,168,76,0.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <svg viewBox="0 0 30 30" width="24" height="24" fill="none">
          <rect x="0"  y="0"  width="12" height="12" fill="#c9a84c" />
          <rect x="16" y="0"  width="12" height="12" fill="#c9a84c" opacity="0.55" />
          <rect x="0"  y="16" width="12" height="12" fill="#c9a84c" opacity="0.55" />
          <rect x="16" y="16" width="12" height="12" fill="#c9a84c" opacity="0.28" />
        </svg>
        <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em" }}>
          <span style={{ color: "white" }}>Pixel</span>
          <span style={{ color: "#c9a84c", fontWeight: 700 }}>Guard</span>
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <button
          onClick={onBackToHome}
          style={{ ...link, color: "white" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a84c")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
        >
          Home
        </button>
        <button
          style={{ ...link, color: "#7a9ab8" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a84c")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#7a9ab8")}
        >
          About
        </button>
        <a href="#" aria-label="GitHub" style={{ color: "#7a9ab8", lineHeight: 0 }}>
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
        </a>
      </div>
    </nav>
  );
}

function BackLink({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        background: "none", border: "none", cursor: "pointer",
        color: "#7a9ab8", fontSize: 13, fontWeight: 500,
        marginBottom: 28, padding: 0, transition: "color 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a84c")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "#7a9ab8")}
    >
      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Home
    </button>
  );
}
