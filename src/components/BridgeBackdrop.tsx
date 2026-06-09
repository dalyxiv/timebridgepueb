export function BridgeBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] flex justify-center overflow-hidden">
      <svg
        viewBox="0 0 1600 360"
        className="w-[140%] max-w-none opacity-[0.08] text-[#014bad]"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        style={{ animation: "tb-drift 18s ease-in-out infinite" }}
      >
        <line x1="0" y1="300" x2="1600" y2="300" strokeWidth="2" />
        <path d="M40 300 Q 800 40 1560 300" strokeWidth="4" />
        <line x1="40" y1="220" x2="1560" y2="220" strokeWidth="3" />
        <line x1="220" y1="300" x2="220" y2="90" strokeWidth="4" />
        <line x1="1380" y1="300" x2="1380" y2="90" strokeWidth="4" />
        {Array.from({ length: 28 }).map((_, i) => {
          const x = 80 + i * 53;
          const t = (x - 800) / 760;
          const archY = 300 - (1 - t * t) * 260;
          return <line key={i} x1={x} y1={archY} x2={x} y2="220" strokeWidth="1.5" opacity="0.8" />;
        })}
      </svg>
      <style>{`
        @keyframes tb-drift {
          0%, 100% { transform: translateX(-2%); }
          50% { transform: translateX(2%); }
        }
      `}</style>
    </div>
  );
}
