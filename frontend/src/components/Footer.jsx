export default function Footer() {
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
          <span className="text-xs font-semibold">
            <span style={{ color: "#5a7a9e" }}>Pixel</span>
            <span style={{ color: "#c9a84c" }}>Guard</span>
          </span>
        </div>
        <p className="text-xs" style={{ color: "#3d5470" }}>
          © 2025 PixelGuard Project · BSc Computer Science Final Year Project
        </p>
        <div className="flex gap-5">
          {["Home", "About", "FAQ"].map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-xs transition-colors duration-200"
              style={{ color: "#3d5470", textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = "#c9a84c"}
              onMouseLeave={e => e.currentTarget.style.color = "#3d5470"}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
