import { useRef, useState, useCallback } from "react";
import EncodePanel from "./EncodePanel";

/**
 * ImageDropZone  —  Step 1 of the encode flow.
 *
 * Handles drag-and-drop and click-to-browse image selection.
 * Displays a thumbnail preview once an image is chosen.
 *
 * Props:
 *   image     {{ url: string, name: string, file: File } | null}
 *   onImage   {(file: File) => void}  – called with the selected File
 */
export default function ImageDropZone({ image, onImage }) {
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

  /* ── derived styles ── */
  const borderColor = dragOver
    ? "#c9a84c"
    : image
    ? "rgba(201,168,76,0.4)"
    : "#1c3a5e";

  const bgColor = dragOver
    ? "rgba(201,168,76,0.05)"
    : "rgba(10,20,40,0.4)";

  return (
    <EncodePanel title="1. Select Cover Image">
      <div
        onClick={() => fileRef.current.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={() => setDragOver(false)}
        style={{
          border: `2px dashed ${borderColor}`,
          borderRadius: 10,
          padding: image ? "18px" : "36px 18px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          background: bgColor,
          transition: "all 0.2s",
          minHeight: 140,
          gap: 10,
        }}
      >
        {image ? (
          /* ── Thumbnail state ── */
          <>
            <div style={{ position: "relative" }}>
              <img
                src={image.url}
                alt="cover preview"
                style={{
                  width: 110,
                  height: 90,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "2px solid rgba(201,168,76,0.5)",
                  display: "block",
                }}
              />
              {/* Edit badge */}
              <div
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "#c9a84c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="10"
                  height="10"
                  fill="none"
                  stroke="#060e1b"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536M9 13l-4 1 1-4L15.232 5.232a2 2 0 012.828 0l.708.708a2 2 0 010 2.828L9 13z"
                  />
                </svg>
              </div>
            </div>

            <span
              style={{ fontSize: 12, color: "#7a9ab8", fontFamily: "monospace" }}
            >
              {image.name}
            </span>
            <span style={{ fontSize: 11, color: "#4a6a8a" }}>
              Click to change image
            </span>
          </>
        ) : (
          /* ── Empty state ── */
          <>
            <div style={{ color: "#c9a84c", opacity: 0.65 }}>
              <svg
                width="34"
                height="34"
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
            <p
              style={{
                fontSize: 13,
                color: "#7a9ab8",
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              Drag &amp; drop an image here
              <br />
              <span style={{ color: "#4a6a8a", fontSize: 12 }}>
                or click to browse — PNG, JPG, WEBP
              </span>
            </p>
          </>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={onFileChange}
      />
    </EncodePanel>
  );
}
