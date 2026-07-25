import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import EncodeBackground from "./EncodeBackground";
import ImageDropZone from "./ImageDropZone";
import MessageInput from "./MessageInput";
import PreviewPanel from "./PreviewPanel";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function EncodePage() {
  const [image, setImage] = useState(null); // { url, name, file }
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [progress, setProgress] = useState(0);
  const [encoding, setEncoding] = useState(false);
  const [done, setDone] = useState(false);

  // Clean up Object URL memory when image changes or component unmounts
  useEffect(() => {
    return () => {
      if (image?.url && image.url.startsWith("blob:")) {
        URL.revokeObjectURL(image.url);
      }
    };
  }, [image?.url]);

  // ── Handlers ──────────────────────────────────────────────
  const handleImage = useCallback(
    (file) => {
      if (image?.url && image.url.startsWith("blob:")) {
        URL.revokeObjectURL(image.url);
      }

      const url = URL.createObjectURL(file);
      setImage({ url, name: file.name, file });
      setProgress(0);
      setDone(false);
    },
    [image?.url],
  );

  const handleEncode = useCallback(async () => {
    if (!image || !message.trim() || encoding) return;

    // Handle Stego Image Download
    if (done) {
      try {
        const response = await axios({
          method: "get",
          url: image.url,
          responseType: "blob",
        });

        const downloadUrl = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `stego_${image.name || "image.png"}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        console.error("Error downloading file:", error);
        alert("Failed to download stego image");
      }
      return;
    }

    setEncoding(true);
    setDone(false);
    setProgress(10);

    try {
      setProgress(25);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const formData = new FormData();
      formData.append("image", image.file);
      formData.append("message", message);
      if (password.trim()) {
        formData.append("password", password.trim());
      }

      setProgress(40);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const response = await axios.post(`${API_BASE_URL}/encode`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        signal: controller.signal,
        timeout: 120000,
      });

      clearTimeout(timeoutId);
      setProgress(80);

      const data = response.data;

      if (data.path) {
        const stegoImageUrl = `${API_BASE_URL}/uploads/${data.path}`;
        setImage((prevImage) => ({ ...prevImage, url: stegoImageUrl }));
      } else {
        throw new Error("Server did not return a valid image path");
      }

      setProgress(100);
      setDone(true);
    } catch (error) {
      console.error("Error encoding image:", error);
      alert(
        `Failed to encode image: ${
          error.response?.data?.message || error.message || "Unknown error"
        }`,
      );
      setProgress(0);
      setDone(false);
    } finally {
      setEncoding(false);
    }
  }, [image, message, password, encoding, done]);

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
      <EncodeNavbar />

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
          <BackLink />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <ImageDropZone image={image} onImage={handleImage} />

              <MessageInput
                message={message}
                onChange={setMessage}
                password={password}
                onPasswordChange={setPassword}
                disabled={encoding}
              />
            </div>

            <PreviewPanel
              image={image}
              message={message}
              progress={progress}
              encoding={encoding}
              done={done}
              onEncode={handleEncode}
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

/* ── Local Helpers ────────────────────────────────────────────── */

function EncodeNavbar() {
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
