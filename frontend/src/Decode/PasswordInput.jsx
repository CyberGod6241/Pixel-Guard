import { useState } from "react";

export default function PasswordInput({
  value,
  onChange,
  placeholder = "Enter password...",
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Lock Icon */}
      <div
        style={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
          color: isFocused ? "#c9a84c" : "#5a789a",
          display: "flex",
          alignItems: "center",
          transition: "color 0.2s ease",
          pointerEvents: "none",
        }}
      >
        <svg
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>

      {/* Input Field */}
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          width: "100%",
          padding: "12px 42px 12px 40px",
          background: "rgba(6, 12, 26, 0.85)",
          border: `1px solid ${
            isFocused ? "#c9a84c" : "rgba(30, 58, 95, 0.6)"
          }`,
          borderRadius: 10,
          color: "#ffffff",
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
          boxShadow: isFocused ? "0 0 12px rgba(201, 168, 76, 0.15)" : "none",
          transition: "all 0.2s ease",
        }}
      />

      {/* Show / Hide Toggle Button */}
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        disabled={disabled}
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          border: "none",
          color: showPassword ? "#c9a84c" : "#5a789a",
          cursor: "pointer",
          padding: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "color 0.2s ease",
        }}
        title={showPassword ? "Hide Password" : "Show Password"}
      >
        {showPassword ? (
          /* Eye Off Icon */
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"
            />
          </svg>
        ) : (
          /* Eye Icon */
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
