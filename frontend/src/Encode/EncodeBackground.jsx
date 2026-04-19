/**
 * EncodeBackground
 * Renders the fixed dark-navy gradient overlay and layered mountain
 * silhouettes that sit behind all encode page content.
 * Pointer-events are disabled so it never intercepts clicks.
 */
export default function EncodeBackground() {
  return (
    <>
      {/* Gradient overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(180deg, #050d1a 0%, #0c1e3e 50%, #050d1a 100%)",
          opacity: 0.7,
        }}
      />

      {/* Mountain silhouettes */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 0,
          opacity: 0.3,
          pointerEvents: "none",
        }}
      >
        <svg
          viewBox="0 0 1440 360"
          preserveAspectRatio="xMidYMax slice"
          style={{ width: "100%", display: "block" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Far range */}
          <polygon
            points="0,360 130,180 280,240 460,120 650,220 840,140 1020,215 1210,150 1380,200 1440,180 1440,360"
            fill="#0e2442"
          />
          {/* Mid range */}
          <polygon
            points="0,360 90,260 230,290 410,200 590,280 770,195 960,265 1150,215 1320,250 1440,235 1440,360"
            fill="#0b1d37"
          />
          {/* Front range */}
          <polygon
            points="0,360 50,320 190,345 360,286 520,338 680,275 850,332 1010,300 1170,328 1330,306 1440,318 1440,360"
            fill="#08111e"
          />
        </svg>
      </div>
    </>
  );
}
