const steps = [
  {
    number: "1.",
    title: "Select & Write",
    description:
      "Select a cover image to weave your secret message into. Write your private text to encode within everyday images.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
  },
  {
    number: "2.",
    title: "Embed Securely",
    description:
      "Embed the steganography data invisibly within everyday images using our advanced LSB algorithm.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
  },
  {
    number: "3.",
    title: "Download Stego-Image",
    description:
      "Download your stego-image and share it safely. Only those with the key can extract your hidden data.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="relative bg-[#0a1628] py-24 px-6">
      {/* Subtle top divider glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />

      <div className="max-w-5xl mx-auto">
        {/* Section Label */}
        <p className="text-center text-gray-400 text-sm uppercase tracking-widest mb-2 font-medium">
          How It Works
        </p>
        <h2 className="text-center text-2xl md:text-3xl font-bold text-[#c9a84c] mb-14 tracking-tight">
          The Process Simplified.
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="group relative bg-[#0d1f3c] border border-[#1e3a5f] hover:border-[#c9a84c]/40 rounded-xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:shadow-[#c9a84c]/10 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="text-[#c9a84c] mb-5 transition-transform duration-300 group-hover:scale-110">
                {step.icon}
              </div>

              {/* Title */}
              <h3 className="text-[#c9a84c] font-bold text-lg mb-3">
                {step.number} {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed">
                {step.description}
              </p>

              {/* Subtle corner accent */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#c9a84c]/20 rounded-tr-xl transition-colors duration-300 group-hover:border-[#c9a84c]/50" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
