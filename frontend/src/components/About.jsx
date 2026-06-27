import { useState } from "react";

const TEAM = [
  {
    name: "Abdulazeez Naim Adekunle",
    role: "Backend & Frontend programmer",
    initials: "AO",
    color: "#c9a84c",
    image: "https://avatars.githubusercontent.com/u/6241?v=4",
  },
  {
    name: "Dim Grace Ifeoma",
    role: "Project Manager",
    initials: "CE",
    color: "#7eb8d4",
    image: "",
  },
  {
    name: "Olatunji Rene-divine",
    role: "UI/UX Design",
    initials: "FM",
    color: "#a78bfa",
    image: "",
  },
  {
    name: "Afe Victor Oluwasegun",
    role: "Database & API Layer",
    initials: "EN",
    color: "#6ee7b7",
    image: "",
  },
  {
    name: "Olayiwola Temitope Peter",
    role: "Testing & Documentation",
    initials: "NA",
    color: "#f9a8d4",
    image: "",
  },
];

function TeamCard({ member }) {
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
      <p className="font-semibold text-sm mb-1" style={{ color: "#d4e4f4" }}>
        {member.name}
      </p>
      <p className="text-xs" style={{ color: "#5a7a9e" }}>
        {member.role}
      </p>
    </div>
  );
}

export default function About() {
  return (
    <section
      id="about"
      className="relative py-24 px-6"
      style={{ background: "#060c1a" }}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent)",
        }}
      />
      <div className="max-w-5xl mx-auto">
        <p
          className="text-center text-xs uppercase tracking-widest mb-2 font-semibold"
          style={{ color: "#5a7a9e" }}
        >
          The Team
        </p>
        <h2
          className="text-center text-2xl md:text-3xl font-bold mb-4"
          style={{ color: "#c9a84c", letterSpacing: "-0.01em" }}
        >
          About PixelGuard
        </h2>
        <p
          className="text-center text-sm leading-relaxed max-w-2xl mx-auto mb-12"
          style={{ color: "#7a9ab8" }}
        >
          PixelGuard is a final year Computer Science project developed by five
          undergraduate students. Our mission is to make image steganography
          accessible, secure, and easy to use — hiding sensitive communications
          inside ordinary images with zero perceptible difference.
        </p>

        <div className="flex justify-center mb-12">
          <div
            className="flex items-center gap-3 px-5 py-2.5 rounded-full"
            style={{
              background: "rgba(201,168,76,0.08)",
              border: "1px solid rgba(201,168,76,0.2)",
            }}
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              style={{ color: "#c9a84c" }}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14l6.16-3.422A12.083 12.083 0 0121 13.5c0 4.142-4.03 7.5-9 7.5s-9-3.358-9-7.5c0-.698.098-1.373.282-2.013L12 14z"
              />
            </svg>
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#c9a84c" }}
            >
              BSc Computer Science · Final Year Project · 2025
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TEAM.map((member, i) => (
            <TeamCard key={i} member={member} />
          ))}
          <div className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
