import EncodePanel from "./EncodePanel";
import PasswordInput from "../Decode/PasswordInput"; // Import PasswordInput component

const MAX_CHARS = 500;

/**
 * MessageInput  —  Step 2 of the encode flow.
 *
 * A textarea for entering the secret message with a live character counter.
 * Enforces a MAX_CHARS (500) limit and turns the counter red when the cap is hit.
 *
 * Props:
 *   message    {string}
 *   onChange   {(value: string) => void}
 */
export default function MessageInput({
  message,
  onChange,
  password,
  onPasswordChange,
  disabled = false,
}) {
  const handleChange = (e) => {
    onChange(e.target.value.slice(0, MAX_CHARS));
  };

  const atLimit = message.length >= MAX_CHARS;

  return (
    <EncodePanel title="2. Enter Secret Message">
      <div style={{ position: "relative" }}>
        <textarea
          value={message}
          onChange={handleChange}
          placeholder="Type your confidential message here..."
          style={{
            width: "100%",
            height: 140,
            background: "rgba(10,20,40,0.5)",
            border: "1px solid #1c3a5e",
            borderRadius: 8,
            padding: "12px 14px 30px",
            color: "#d4e4f4",
            fontSize: 13,
            lineHeight: 1.65,
            resize: "none",
            outline: "none",
            fontFamily: "inherit",
            boxSizing: "border-box",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.4)")}
          onBlur={(e) => (e.target.style.borderColor = "#1c3a5e")}
        />

        {/* Character counter */}
        <span
          style={{
            position: "absolute",
            bottom: 10,
            right: 12,
            fontSize: 11,
            color: atLimit ? "#e87070" : "#4a6a8a",
            transition: "color 0.2s",
            pointerEvents: "none",
          }}
        >
          {message.length}/{MAX_CHARS}
        </span>

        {/* Password Area */}
        <div style={{ marginTop: 20 }}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#c9a84c",
              marginBottom: 6,
            }}
          >
            Encryption Password (Optional)
          </h3>
          <p style={{ fontSize: 12, color: "#7a9ab8", marginBottom: 10 }}>
            If set, the recipient will need this exact password to extract the
            message.
          </p>

          <PasswordInput
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            disabled={disabled}
            placeholder="Enter encryption key..."
          />
        </div>
      </div>
    </EncodePanel>
  );
}
