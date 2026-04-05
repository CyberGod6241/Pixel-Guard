export default function Hero({ Link }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#0a1628]" />

      {/* Mountain silhouette SVG */}
      <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
        <svg
          viewBox="0 0 1440 500"
          preserveAspectRatio="xMidYMax slice"
          className="w-full opacity-40"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Far mountains */}
          <polygon
            points="0,500 200,200 400,320 600,150 800,280 1000,160 1200,260 1440,180 1440,500"
            fill="#0f2744"
          />
          {/* Mid mountains */}
          <polygon
            points="0,500 150,300 300,380 500,220 700,340 900,200 1100,300 1300,240 1440,280 1440,500"
            fill="#0d2240"
          />
          {/* Front mountains */}
          <polygon
            points="0,500 100,380 280,420 450,320 620,400 800,300 980,380 1150,340 1300,380 1440,350 1440,500"
            fill="#0b1c36"
          />
        </svg>
      </div>

      {/* Animated binary rain columns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {[
          { left: "8%", delay: "0s", duration: "8s" },
          { left: "15%", delay: "2s", duration: "11s" },
          { left: "85%", delay: "1s", duration: "9s" },
          { left: "92%", delay: "3s", duration: "10s" },
        ].map((col, i) => (
          <div
            key={i}
            className="absolute top-0 text-[#c9a84c] text-xs font-mono opacity-20 flex flex-col gap-2 animate-binary-fall"
            style={{
              left: col.left,
              animationDelay: col.delay,
              animationDuration: col.duration,
              animationName: "binaryFall",
              animationIterationCount: "infinite",
              animationTimingFunction: "linear",
            }}
          >
            {Array.from({ length: 20 }).map((_, j) => (
              <span key={j}>{Math.round(Math.random())}</span>
            ))}
          </div>
        ))}
      </div>

      {/* Golden wave / data visualization line */}
      <div className="absolute bottom-[30%] left-0 right-0 h-24 overflow-hidden opacity-30">
        <svg
          viewBox="0 0 1440 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 48 C180 10, 360 86, 540 48 S900 10, 1080 48 S1350 86, 1440 48"
            stroke="#c9a84c"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M0 60 C180 22, 360 98, 540 60 S900 22, 1080 60 S1350 98, 1440 60"
            stroke="#c9a84c"
            strokeWidth="1"
            fill="none"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#c9a84c] leading-tight mb-6 tracking-tight">
          Hide Secrets in Plain Sight.
        </h1>
        <p className="text-gray-300 text-base md:text-lg max-w-xl mb-10 leading-relaxed">
          Secure, premium image steganography using advanced LSB technology.
          <br />
          Protect your data within everyday images.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link to="/encode">
            <button className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8963e] text-[#0a1628] font-bold px-8 py-3.5 rounded-md text-sm uppercase tracking-widest transition-all duration-200 shadow-lg shadow-[#c9a84c]/20 hover:shadow-[#c9a84c]/40 hover:scale-105 min-w-[200px] justify-center">
              <LockIcon />
              Encode Message
            </button>
          </Link>
          <Link to="/decode">
            <button className="flex items-center gap-2 border border-[#c9a84c] hover:bg-[#c9a84c]/10 text-[#c9a84c] font-bold px-8 py-3.5 rounded-md text-sm uppercase tracking-widest transition-all duration-200 min-w-[200px] justify-center hover:scale-105">
              <UnlockIcon />
              Decode Image
            </button>
          </Link>
        </div>
      </div>

      {/* Binary fall keyframes via inline style */}
      <style>{`
        @keyframes binaryFall {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 0.2; }
          90% { opacity: 0.2; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>
    </section>
  );
}

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

function UnlockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
      />
    </svg>
  );
}
