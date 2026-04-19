import { useRef, useState, useCallback } from "react";

/**
 * DecodeImageSelector  —  Step 1 of the decode flow.
 *
 * Displays a dashed drop-zone. Once an image is selected it shows
 * a thumbnail + filename row and a "Browse…" button to change the file.
 *
 * Props:
 *   image    {{ url: string, name: string, file: File } | null}
 *   onImage  {(file: File) => void}
 */
export default function DecodeImageSelector({ image, onImage }) {
  const fileRef = useRef();
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (file) => {
      if (!file || !file.type.startsWith("image/")) return;
      onImage(file);
    },
    [onImage]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onFileChange = (e) => handleFile(e.target.files[0]);

  const borderColor = dragOver
    ? "#c9a84c"
    : image
    ? "rgba(201,168,76,0.35)"
    : "#1c3a5e";

  const bgColor = dragOver
    ? "rgba(201,168,76,0.05)"
    : "rgba(10,20,40,0.4)";

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={() => setDragOver(false)}
      style={{
        border: `2px dashed ${borderColor}`,
        borderRadius: 10,
        padding: "18px",
        background: bgColor,
        transition: "all 0.2s",
        minHeight: 80,
      }}
    >
      {image ? (
        /* ── File selected state ── */
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Thumbnail + filename row */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img
              src={image.url}
              alt="stego preview"
              style={{
                width: 52,
                height: 44,
                objectFit: "cover",
                borderRadius: 6,
                border: "1.5px solid rgba(201,168,76,0.45)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 13,
                color: "#c8d8ee",
                fontFamily: "monospace",
                wordBreak: "break-all",
              }}
            >
              {image.name}
            </span>
          </div>

          {/* Browse button — right-aligned */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => fileRef.current.click()}
              style={{
                background: "transparent",
                border: "1.5px solid #c9a84c",
                borderRadius: 6,
                color: "#c9a84c",
                fontSize: 12,
                fontWeight: 600,
                padding: "6px 18px",
                cursor: "pointer",
                letterSpacing: "0.04em",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(201,168,76,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Browse…
            </button>
          </div>
        </div>
      ) : (
        /* ── Empty state ── */
        <div
          onClick={() => fileRef.current.click()}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            minHeight: 110,
            cursor: "pointer",
          }}
        >
          <div style={{ color: "#c9a84c", opacity: 0.6 }}>
            <svg
              width="32"
              height="32"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.4}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p style={{ fontSize: 13, color: "#7a9ab8", textAlign: "center", lineHeight: 1.6 }}>
            Drop your stego-image here
            <br />
            <span style={{ fontSize: 12, color: "#4a6a8a" }}>
              or click to browse — PNG, JPG, WEBP
            </span>
          </p>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={onFileChange}
      />
    </div>
  );
}
