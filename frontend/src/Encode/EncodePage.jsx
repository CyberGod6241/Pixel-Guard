import { useCallback } from "react";
import EncodeBackground from "./EncodeBackground";
import ImageDropZone from "./ImageDropZone";
import MessageInput from "./MessageInput";
import PreviewPanel from "./PreviewPanel";
import axios from "axios";

/**
 * EncodePage
 * Orchestrates the encode flow. Owns all shared state and passes
 * derived values + callbacks down to the individual encode components.
 *
 * Props:
 *   onBackToHome  {() => void}  – navigates back to the landing page
 */
export default function EncodePage({
  onBackToHome,
  image,
  setImage,
  message,
  setMessage,
  progress,
  setProgress,
  encoding,
  setEncoding,
  done,
  setDone,
}) {
  const handleImage = useCallback(
    (file) => {
      const url = URL.createObjectURL(file);
      setImage({ url, name: file.name, file });
      setProgress(0);
      setDone(false);
    },
    [setDone, setProgress, setImage],
  );

  const handleEncode = useCallback(async () => {
    if (!image || !message.trim() || encoding) return;
    if (done) {
      const a = document.createElement("a");
      a.href = image.url;
      a.download = `stego_${image.name}`;
      a.click();
      return;
    }

    setEncoding(true);
    setDone(false);
    setProgress(10);

    try {
      // Simulate upload progress
      setProgress(25);
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Create FormData with the actual image file
      const formData = new FormData();
      formData.append("image", image.file);
      formData.append("message", message);

      setProgress(40);

      // Make the actual API call with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

      const response = await axios.post(
        "http://localhost:8080/encode",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          signal: controller.signal,
          timeout: 120000,
        },
      );

      clearTimeout(timeoutId);

      setProgress(80);
      const data = response.data;
      console.log("Encoding success:", data);
      console.log("Full response:", response);

      // Update image with the stego version
      if (data.path) {
        const stegoImageUrl = `http://localhost:8080/uploads/${data.path}`;
        console.log("Stego image URL:", stegoImageUrl);
        setImage((prevImage) => ({ ...prevImage, url: stegoImageUrl }));
      } else {
        console.error("No path returned from server:", data);
        alert("Server did not return image path");
        setEncoding(false);
        setDone(false);
        setProgress(0);
        return;
      }

      setProgress(100);
      setEncoding(false);
      setDone(true);
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Encoding request timed out");
        alert("Encoding took too long. Please try again.");
      } else {
        console.error("Error encoding image:", error);
        alert(`Failed to encode image: ${error.message || "Unknown error"}`);
      }
      setEncoding(false);
      setDone(false);
      setProgress(0);
    }
  }, [
    image,
    message,
    encoding,
    done,
    setImage,
    setEncoding,
    setDone,
    setProgress,
  ]);

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
      <EncodeNavbar onBackToHome={onBackToHome} />

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
          <BackLink onClick={onBackToHome} />
          <div
            // style={{
            //   display: "grid",
            //   gridTemplateColumns: "1fr 1fr",
            //   gap: 20,
            //   alignItems: "start",
            // }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center "
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <ImageDropZone image={image} onImage={handleImage} />
              <MessageInput message={message} onChange={setMessage} />
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

function EncodeNavbar({ onBackToHome }) {
  const link = {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    padding: 0,
    transition: "color 0.2s",
  };
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
        <a
          href="#"
          aria-label="GitHub"
          style={{ color: "#7a9ab8", lineHeight: 0 }}
        >
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
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
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#7a9ab8",
        fontSize: 13,
        fontWeight: 500,
        marginBottom: 28,
        padding: 0,
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
    </button>
  );
}
