import { useState } from "react";

const FAQS = [
  {
    q: "What is image steganography?",
    a: "Steganography is the practice of hiding secret information within an ordinary, non-secret file or message — in our case, a digital image. Unlike encryption, which scrambles data, steganography conceals the very existence of the message.",
  },
  {
    q: "What is LSB (Least Significant Bit) encoding?",
    a: "LSB encoding works by replacing the least significant bit of each pixel's colour channel with a bit of secret data. This change is imperceptible to the human eye, making the stego-image look identical to the original.",
  },
  {
    q: "Is my original image altered visibly?",
    a: "No. The differences between your original and the stego-image are invisible to the naked eye. The pixel values change by at most 1 unit per channel, well below the threshold of human visual perception.",
  },
  {
    q: "What image formats are supported?",
    a: "PixelGuard currently supports PNG images, which use lossless compression and are ideal for steganography. JPEG is not recommended as its lossy compression destroys the hidden data during re-encoding.",
  },
  {
    q: "How much data can I hide in an image?",
    a: "Using 1-bit LSB encoding, you can hide up to 1 bit per colour channel per pixel. A 1920×1080 image has over 6 million pixels, giving roughly 750 KB of hiding capacity — enough for lengthy messages.",
  },
  {
    q: "Is this project open source?",
    a: "Yes! PixelGuard was built as an academic final year project. The full source code is available on GitHub for educational and research purposes under the MIT licence.",
  },
];

function FAQItem({ faq, open, toggle }) {
  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{
        background: "#0d1f3c",
        border: `1px solid ${open ? "rgba(201,168,76,0.35)" : "#1c3454"}`,
        boxShadow: open ? "0 4px 24px rgba(201,168,76,0.07)" : "none",
      }}
    >
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
      >
        <span className="font-semibold text-sm pr-4" style={{ color: open ? "#c9a84c" : "#c8d8ee" }}>
          {faq.q}
        </span>
        <span
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300"
          style={{
            background: open ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.05)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            color: open ? "#c9a84c" : "#5a7a9e",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      <div style={{ maxHeight: open ? "300px" : "0", overflow: "hidden", transition: "max-height 0.35s ease" }}>
        <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "#7a9ab8" }}>
          {faq.a}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" className="relative py-24 px-6" style={{ background: "#07101f" }}>
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent)" }}
      />
      <div className="max-w-3xl mx-auto">
        <p className="text-center text-xs uppercase tracking-widest mb-2 font-semibold" style={{ color: "#5a7a9e" }}>
          Got Questions?
        </p>
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-14" style={{ color: "#c9a84c", letterSpacing: "-0.01em" }}>
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              open={open === i}
              toggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
