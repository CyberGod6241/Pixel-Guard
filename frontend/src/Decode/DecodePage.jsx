import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import EncodeBackground from "../Encode/EncodeBackground";
import DecodeImageSelector from "./DecodeImageSelector";
import ExtractedMessage from "./ExtractedMessage";
import DecodeActionPanel from "./DecodeActionPanel";
import PasswordInput from "./PasswordInput";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function DecodePage() {
  const [image, setImage] = useState(null); // { url, name, file }
  const [password, setPassword] = useState(""); // 1. Added password state
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [decoding, setDecoding] = useState(false);
  const [done, setDone] = useState(false);
  const [timestamp, setTimestamp] = useState("");

  // Clean up Object URL when image state changes or component unmounts
  useEffect(() => {
    return () => {
      if (image?.url) {
        URL.revokeObjectURL(image.url);
      }
    };
  }, [image?.url]);

  // ── Handlers ──────────────────────────────────────────────
  const handleImage = useCallback(
    (file) => {
      if (image?.url) {
        URL.revokeObjectURL(image.url);
      }

      const url = URL.createObjectURL(file);
      setImage({ url, name: file.name, file });
      setMessage("");
      setPassword(""); // Reset password on new image selection
      setProgress(0);
      setDone(false);
      setTimestamp("");
    },
    [image?.url],
  );

  const handleDecode = useCallback(async () => {
    if (!image || decoding) return;
    setDecoding(true);
    setDone(false);
    setMessage("");
    setProgress(10);

    try {
      setProgress(25);
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (!image.file) {
        throw new Error("No image file available");
      }

      // 2. Append image and optional password to FormData
      const formData = new FormData();
      formData.append("image", image.file);
      if (password.trim()) {
        formData.append("password", password.trim());
      }

      setProgress(40);

      const response = await axios.post(`${API_BASE_URL}/decode`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 120000,
      });

      setProgress(80);
      const data = response.data;

      if (data.status === "success" && data.message) {
        setMessage(data.message);
        setProgress(100);
        setDone(true);
        setTimestamp(
          new Date().toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            timeZoneName: "short",
          }),
        );
      } else {
        throw new Error(data.message || "Decoding failed");
      }
    } catch (error) {
      console.error("Error decoding image:", error);
      alert(
        `Failed to decode image: ${
          error.response?.data?.message || error.message || "Unknown error"
        }`,
      );
      setMessage("");
      setProgress(0);
    } finally {
      setDecoding(false);
    }
  }, [image, password, decoding]);

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
      <DecodeNavbar />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          paddingTop: 88,
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "28px 24px 40px",
          }}
        >
          {/* Back link */}
          <BackLink />

          {/* Two-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Step 1 — image picker */}
              <SectionPanel title="1. Select Image to Decode">
                <DecodeImageSelector image={image} onImage={handleImage} />
              </SectionPanel>

              {/* 3. Password Input Section */}
              {/* <SectionPanel title="2. Decryption Key (If Encrypted)">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password if message was encrypted..."
                  style={{
                    width: "100%",
                    background: "rgba(6, 12, 26, 0.8)",
                    border: "1px solid rgba(201, 168, 76, 0.2)",
                    borderRadius: 8,
                    padding: "10px 14px",
                    color: "white",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(201, 168, 76, 0.2)")
                  }
                />
              </SectionPanel> */}
              <SectionPanel title="2. Decryption Key (Optional)">
                <p style={{ fontSize: 12, color: "#7a9ab8", marginBottom: 12 }}>
                  Leave empty if the embedded message wasn't encrypted with a
                  password.
                </p>

                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={decoding}
                  placeholder="Enter password to decrypt..."
                />
              </SectionPanel>

              {/* Step 3 — extracted message */}
              <SectionPanel title="3. Extracted Secret Message">
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

function DecodeNavbar() {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 40px",
        background: "rgba(6,12,26,0.88)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(201,168,76,0.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <svg viewBox="0 0 30 30" width="24" height="24" fill="none">
          <rect x="0" y="0" width="12" height="12" fill="#c9a84c" />
          <rect
            x="16"
            y="0"
            width="12"
            height="12"
            fill="#c9a84c"
            opacity="0.55"
          />
          <rect
            x="0"
            y="16"
            width="12"
            height="12"
            fill="#c9a84c"
            opacity="0.55"
          />
          <rect
            x="16"
            y="16"
            width="12"
            height="12"
            fill="#c9a84c"
            opacity="0.28"
          />
        </svg>
        <span
          style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em" }}
        >
          <span style={{ color: "white" }}>Pixel</span>
          <span style={{ color: "#c9a84c", fontWeight: 700 }}>Guard</span>
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 500,
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a84c")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
        >
          Home
        </Link>
      </div>
    </nav>
  );
}

function BackLink() {
  return (
    <Link
      to="/"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        textDecoration: "none",
        color: "#7a9ab8",
        fontSize: 13,
        fontWeight: 500,
        marginBottom: 28,
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a84c")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "#7a9ab8")}
    >
      <svg
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Back to Home
    </Link>
  );
}
