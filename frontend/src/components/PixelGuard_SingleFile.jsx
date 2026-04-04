// ============================================================
// PixelGuard Landing Page — Single File React + Tailwind
// ============================================================

// ─── Navbar ─────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5">
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="13" height="13" fill="#c9a84c" />
          <rect x="17" y="0" width="13" height="13" fill="#c9a84c" opacity="0.55" />
          <rect x="0" y="17" width="13" height="13" fill="#c9a84c" opacity="0.55" />
          <rect x="17" y="17" width="13" height="13" fill="#c9a84c" opacity="0.25" />
        </svg>
        <span className="text-lg font-semibold tracking-tight">
          <span className="text-white">Pixel</span>
          <span style={{ color: "#c9a84c" }} className="font-bold">Guard</span>
        </span>
      </div>
      <div className="flex items-center gap-7">
        <a href="#" className="text-sm text-white hover:opacity-80 transition-opacity font-medium">Home</a>
        <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">About</a>
        <a href="#" aria-label="GitHub" className="text-gray-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        </a>
      </div>
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────
function Hero() {
  const binaryCols = [
    { left: "6%", delay: "0s", dur: "9s" },
    { left: "13%", delay: "3s", dur: "12s" },
    { left: "83%", delay: "1.5s", dur: "10s" },
    { left: "91%", delay: "4s", dur: "8s" },
  ];

  const binaryDigits = Array.from({ length: 22 }, (_, i) => i % 2);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* BG gradient */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #070f1e 0%, #0d2040 50%, #070f1e 100%)" }}
      />

      {/* Stars/noise dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() > 0.7 ? "2px" : "1px",
              height: Math.random() > 0.7 ? "2px" : "1px",
              top: `${Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.1,
            }}
          />
        ))}
      </div>

      {/* Mountains SVG */}
      <div className="absolute inset-0 flex items-end">
        <svg viewBox="0 0 1440 480" preserveAspectRatio="xMidYMax slice" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Sky glow behind peaks */}
          <defs>
            <radialGradient id="peakGlow" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#1a3a6e" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#070f1e" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="720" cy="200" rx="600" ry="200" fill="url(#peakGlow)" />

          {/* Far range */}
          <polygon points="0,480 120,260 260,340 440,180 620,300 800,200 980,290 1160,210 1340,280 1440,240 1440,480" fill="#0e2340" />
          {/* Mid range */}
          <polygon points="0,480 80,340 220,380 400,270 580,370 760,260 940,340 1120,280 1300,320 1440,300 1440,480" fill="#0b1d35" />
          {/* Front range */}
          <polygon points="0,480 60,400 180,430 340,360 500,420 660,350 820,410 980,370 1140,400 1300,375 1440,390 1440,480" fill="#090f20" />
        </svg>
      </div>

      {/* Golden wave lines */}
      <div className="absolute bottom-32 left-0 right-0 h-20 overflow-hidden" style={{ opacity: 0.25 }}>
        <svg viewBox="0 0 1440 80" fill="none" className="w-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 40 C240 5, 480 75, 720 40 S1200 5, 1440 40" stroke="#c9a84c" strokeWidth="1.5" fill="none" />
          <path d="M0 50 C240 15, 480 85, 720 50 S1200 15, 1440 50" stroke="#c9a84c" strokeWidth="0.7" fill="none" />
        </svg>
      </div>

      {/* Binary rain */}
      <style>{`
        @keyframes pgBinaryRain {
          0%   { transform: translateY(-120%); opacity: 0; }
          8%   { opacity: 0.18; }
          92%  { opacity: 0.18; }
          100% { transform: translateY(110vh); opacity: 0; }
        }
        @keyframes pgFadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pg-hero-content { animation: pgFadeIn 1s ease both; }
        .pg-hero-sub     { animation: pgFadeIn 1s ease 0.2s both; }
        .pg-hero-btns    { animation: pgFadeIn 1s ease 0.4s both; }
      `}</style>

      {binaryCols.map((col, i) => (
        <div
          key={i}
          className="absolute top-0 font-mono text-xs flex flex-col gap-1.5 pointer-events-none select-none"
          style={{
            left: col.left,
            color: "#c9a84c",
            opacity: 0,
            animation: `pgBinaryRain ${col.dur} ${col.delay} infinite linear`,
          }}
        >
          {binaryDigits.map((d, j) => (
            <span key={j}>{(d + j) % 2}</span>
          ))}
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        <h1
          className="pg-hero-content text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
          style={{ color: "#c9a84c", letterSpacing: "-0.02em" }}
        >
          Hide Secrets in Plain Sight.
        </h1>

        <p className="pg-hero-sub text-gray-300 text-base md:text-lg max-w-lg mb-10 leading-relaxed">
          Secure, premium image steganography using advanced LSB technology.
          <br className="hidden sm:block" />
          Protect your data within everyday images.
        </p>

        <div className="pg-hero-btns flex flex-col sm:flex-row gap-4 items-center">
          <button
            className="flex items-center gap-2.5 font-bold px-8 py-3.5 rounded-md text-xs uppercase tracking-widest transition-all duration-200 min-w-[200px] justify-center"
            style={{
              background: "#c9a84c",
              color: "#07101f",
              boxShadow: "0 4px 24px rgba(201,168,76,0.25)",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#b8963e"; e.currentTarget.style.transform = "scale(1.03)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#c9a84c"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            <LockIcon />
            Encode Message
          </button>

          <button
            className="flex items-center gap-2.5 font-bold px-8 py-3.5 rounded-md text-xs uppercase tracking-widest transition-all duration-200 min-w-[200px] justify-center"
            style={{
              border: "1.5px solid #c9a84c",
              color: "#c9a84c",
              background: "transparent",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.08)"; e.currentTarget.style.transform = "scale(1.03)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            <UnlockIcon />
            Decode Image
          </button>
        </div>
      </div>
    </section>
  );
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}
function UnlockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
    </svg>
  );
}

// ─── HowItWorks ──────────────────────────────────────────────
const STEPS = [
  {
    num: "1.",
    title: "Select & Write",
    desc: "Select a cover image to embed your secret. Write your private message to hide within everyday granular images.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
  },
  {
    num: "2.",
    title: "Embed Securely",
    desc: "Embed the steganography data invisibly within everyday images using our advanced LSB algorithm.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8M12 17v4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 10l2 2 4-4" />
      </svg>
    ),
  },
  {
    num: "3.",
    title: "Download Stego-Image",
    desc: "Download your stego-image and share it safely. Your hidden data is shielded from surveillance.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
  },
];

function HowItWorks() {
  return (
    <section className="relative py-24 px-6" style={{ background: "#07101f" }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent)" }} />

      <div className="max-w-5xl mx-auto">
        <p className="text-center text-gray-500 text-xs uppercase tracking-widest mb-2 font-semibold">
          How It Works
        </p>
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-14" style={{ color: "#c9a84c", letterSpacing: "-0.01em" }}>
          The Process Simplified.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STEPS.map((step, i) => (
            <StepCard key={i} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({ step }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative rounded-xl p-8 flex flex-col items-center text-center cursor-default transition-all duration-300"
      style={{
        background: "#0d1f3c",
        border: `1px solid ${hovered ? "rgba(201,168,76,0.35)" : "#1c3454"}`,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 8px 32px rgba(201,168,76,0.1)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-7 h-7 rounded-tr-xl"
        style={{
          borderTop: `2px solid ${hovered ? "rgba(201,168,76,0.45)" : "rgba(201,168,76,0.15)"}`,
          borderRight: `2px solid ${hovered ? "rgba(201,168,76,0.45)" : "rgba(201,168,76,0.15)"}`,
          transition: "border-color 0.3s",
        }}
      />

      {/* Icon */}
      <div
        className="mb-5 transition-transform duration-300"
        style={{
          color: "#c9a84c",
          transform: hovered ? "scale(1.12)" : "scale(1)",
        }}
      >
        {step.icon}
      </div>

      <h3 className="font-bold text-base mb-3" style={{ color: "#c9a84c" }}>
        {step.num} {step.title}
      </h3>

      <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
    </div>
  );
}

// ─── About ───────────────────────────────────────────────────
const TEAM = [
  { name: "Adebayo Okafor", role: "Backend & LSB Algorithm", initials: "AO", color: "#c9a84c" },
  { name: "Chisom Eze",     role: "Frontend & UI/UX Design", initials: "CE", color: "#7eb8d4" },
  { name: "Fatima Musa",    role: "Cryptography & Security", initials: "FM", color: "#a78bfa" },
  { name: "Emeka Nwosu",    role: "Database & API Layer",    initials: "EN", color: "#6ee7b7" },
  { name: "Ngozi Adeyemi",  role: "Testing & Documentation", initials: "NA", color: "#f9a8d4" },
];

function About() {
  return (
    <section id="about" className="relative py-24 px-6" style={{ background: "#060c1a" }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent)" }} />

      <div className="max-w-5xl mx-auto">
        <p className="text-center text-xs uppercase tracking-widest mb-2 font-semibold" style={{ color: "#5a7a9e" }}>
          The Team
        </p>
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-4" style={{ color: "#c9a84c", letterSpacing: "-0.01em" }}>
          About PixelGuard
        </h2>
        <p className="text-center text-sm leading-relaxed max-w-2xl mx-auto mb-16" style={{ color: "#7a9ab8" }}>
          PixelGuard is a final year Computer Science project developed by five undergraduate students.
          Our mission is to make image steganography accessible, secure, and easy to use — hiding sensitive
          communications inside ordinary images with zero perceptible difference.
        </p>

        {/* University badge */}
        <div className="flex justify-center mb-14">
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
            <svg className="w-4 h-4 flex-shrink-0" style={{ color: "#c9a84c" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0121 13.5c0 4.142-4.03 7.5-9 7.5s-9-3.358-9-7.5c0-.698.098-1.373.282-2.013L12 14z" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#c9a84c" }}>
              BSc Computer Science · Final Year Project · 2025
            </span>
          </div>
        </div>

        {/* Team cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TEAM.map((member, i) => (
            <TeamCard key={i} member={member} index={i} />
          ))}
          {/* Spacer to centre last row on lg (5 cards → 3+2) */}
          <div className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}

function TeamCard({ member, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative rounded-xl p-6 flex flex-col items-center text-center transition-all duration-300 cursor-default"
      style={{
        background: "#0d1f3c",
        border: `1px solid ${hovered ? "rgba(201,168,76,0.3)" : "#1c3454"}`,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 8px 28px rgba(201,168,76,0.08)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar */}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold mb-4 flex-shrink-0"
        style={{
          background: `${member.color}18`,
          border: `2px solid ${member.color}55`,
          color: member.color,
          letterSpacing: "0.05em",
        }}
      >
        {member.initials}
      </div>
      <p className="font-semibold text-sm mb-1" style={{ color: "#d4e4f4" }}>{member.name}</p>
      <p className="text-xs" style={{ color: "#5a7a9e" }}>{member.role}</p>
    </div>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────
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
    a: "Using 1-bit LSB encoding, you can hide up to 1 bit per colour channel per pixel. A 1920×1080 pixel image has over 6 million pixels, giving you roughly 750 KB of hiding capacity — enough for lengthy messages.",
  },
  {
    q: "Is this project open source?",
    a: "Yes! PixelGuard was built as an academic final year project. The full source code is available on GitHub for educational and research purposes under the MIT licence.",
  },
];

function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq" className="relative py-24 px-6" style={{ background: "#07101f" }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent)" }} />

      <div className="max-w-3xl mx-auto">
        <p className="text-center text-xs uppercase tracking-widest mb-2 font-semibold" style={{ color: "#5a7a9e" }}>
          Got Questions?
        </p>
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-14" style={{ color: "#c9a84c", letterSpacing: "-0.01em" }}>
          Frequently Asked Questions
        </h2>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} open={open === i} toggle={() => setOpen(open === i ? null : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ faq, index, open, toggle }) {
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
        className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors duration-200"
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
      >
        <span className="font-semibold text-sm pr-4" style={{ color: open ? "#c9a84c" : "#c8d8ee" }}>
          {faq.q}
        </span>
        {/* Chevron */}
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

      {/* Answer */}
      <div
        style={{
          maxHeight: open ? "300px" : "0",
          overflow: "hidden",
          transition: "max-height 0.35s ease",
        }}
      >
        <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "#7a9ab8" }}>
          {faq.a}
        </p>
      </div>
    </div>
  );
}

// ─── Footer ──────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-8 px-6" style={{ background: "#060c1a", borderTop: "1px solid rgba(30,58,95,0.4)" }}>
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 30 30" width="20" height="20" fill="none">
            <rect x="0" y="0" width="12" height="12" fill="#c9a84c"/>
            <rect x="16" y="0" width="12" height="12" fill="#c9a84c" opacity="0.5"/>
            <rect x="0" y="16" width="12" height="12" fill="#c9a84c" opacity="0.5"/>
            <rect x="16" y="16" width="12" height="12" fill="#c9a84c" opacity="0.25"/>
          </svg>
          <span className="text-xs font-semibold" style={{ color: "#3d5470" }}>
            <span style={{ color: "#5a7a9e" }}>Pixel</span><span style={{ color: "#c9a84c" }}>Guard</span>
          </span>
        </div>
        <p className="text-xs" style={{ color: "#3d5470" }}>
          © 2025 PixelGuard Project · BSc Computer Science Final Year Project
        </p>
        <div className="flex gap-5">
          {["Home", "About", "FAQ"].map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-xs transition-colors duration-200" style={{ color: "#3d5470" }}
              onMouseEnter={e => e.currentTarget.style.color = "#c9a84c"}
              onMouseLeave={e => e.currentTarget.style.color = "#3d5470"}>
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── App ─────────────────────────────────────────────────────
import { useState } from "react";

export default function App() {
  return (
    <div className="min-h-screen text-white" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#07101f" }}>
      <Navbar />
      <Hero />
      <HowItWorks />
      <About />
      <FAQ />
      <Footer />
    </div>
  );
}
