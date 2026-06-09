import { useEffect, useState } from "react";
import wordmark from "@/assets/timebridge-wordmark-white.png.asset.json";

export function SplashIntro() {
  const [show, setShow] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("tb_splash_shown")) {
      setShow(false);
      return;
    }
    const t1 = setTimeout(() => setLeaving(true), 2400);
    const t2 = setTimeout(() => {
      setShow(false);
      try { sessionStorage.setItem("tb_splash_shown", "1"); } catch {}
    }, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ${leaving ? "opacity-0" : "opacity-100"}`}
      style={{ backgroundColor: "#004aad" }}
    >
      {/* subtle stars */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              top: `${(i * 37) % 100}%`,
              left: `${(i * 53) % 100}%`,
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              animationDelay: `${(i % 8) * 0.2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center gap-10 px-6">
        {/* Bridge SVG drawing */}
        <svg
          viewBox="0 0 600 220"
          className="w-[min(90vw,640px)] h-auto"
          fill="none"
          stroke="white"
          strokeLinecap="round"
        >
          {/* water line */}
          <line x1="20" y1="180" x2="580" y2="180" strokeWidth="1.5" opacity="0.5"
            strokeDasharray="560" strokeDashoffset="560"
            style={{ animation: "tb-draw 1s ease-out 0.1s forwards" }} />
          {/* main arch */}
          <path d="M40 180 Q 300 20 560 180" strokeWidth="3"
            strokeDasharray="900" strokeDashoffset="900"
            style={{ animation: "tb-draw 1.4s ease-out 0.3s forwards" }} />
          {/* deck */}
          <line x1="40" y1="120" x2="560" y2="120" strokeWidth="2.5"
            strokeDasharray="520" strokeDashoffset="520"
            style={{ animation: "tb-draw 1s ease-out 1.1s forwards" }} />
          {/* cables */}
          {Array.from({ length: 11 }).map((_, i) => {
            const x = 60 + i * 48;
            const archY = 180 - ((1 - Math.pow((x - 300) / 260, 2)) * 160);
            return (
              <line
                key={i}
                x1={x}
                y1={archY}
                x2={x}
                y2="120"
                strokeWidth="1.2"
                opacity="0.85"
                strokeDasharray="120"
                strokeDashoffset="120"
                style={{ animation: `tb-draw 0.6s ease-out ${1.4 + i * 0.05}s forwards` }}
              />
            );
          })}
          {/* towers */}
          <line x1="120" y1="180" x2="120" y2="50" strokeWidth="3"
            strokeDasharray="130" strokeDashoffset="130"
            style={{ animation: "tb-draw 0.7s ease-out 0.6s forwards" }} />
          <line x1="480" y1="180" x2="480" y2="50" strokeWidth="3"
            strokeDasharray="130" strokeDashoffset="130"
            style={{ animation: "tb-draw 0.7s ease-out 0.6s forwards" }} />
        </svg>

        <img
          src={wordmark.url}
          alt="TimeBridge"
          className="h-14 sm:h-20 w-auto opacity-0"
          style={{ animation: "tb-fadeup 0.8s ease-out 1.6s forwards" }}
        />
        <p
          className="text-white/70 text-xs sm:text-sm tracking-[0.4em] uppercase opacity-0"
          style={{ animation: "tb-fadeup 0.8s ease-out 2s forwards" }}
        >
          Bridging generations
        </p>
      </div>

      <style>{`
        @keyframes tb-draw { to { stroke-dashoffset: 0; } }
        @keyframes tb-fadeup {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
