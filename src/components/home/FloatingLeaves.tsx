"use client";

const LEAVES = [
  { char: "🌿", size: 22, left: "7%",  top: "15%", dur: "7s",  delay: "0s"   },
  { char: "🍃", size: 16, left: "15%", top: "60%", dur: "9s",  delay: "1.4s" },
  { char: "🌱", size: 14, left: "25%", top: "80%", dur: "6s",  delay: "3s"   },
  { char: "🌿", size: 20, left: "55%", top: "10%", dur: "10s", delay: "0.8s" },
  { char: "🍃", size: 18, left: "70%", top: "70%", dur: "8s",  delay: "2.2s" },
  { char: "🌱", size: 15, left: "80%", top: "30%", dur: "7.5s",delay: "1s"   },
  { char: "🍀", size: 13, left: "90%", top: "55%", dur: "11s", delay: "3.5s" },
  { char: "🌿", size: 17, left: "45%", top: "50%", dur: "8.5s",delay: "0.3s" },
];

export function FloatingLeaves() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {LEAVES.map((leaf, i) => (
        <span
          key={i}
          className="absolute select-none opacity-20"
          style={{
            left:      leaf.left,
            top:       leaf.top,
            fontSize:  leaf.size,
            animation: `float ${leaf.dur} ease-in-out infinite`,
            animationDelay: leaf.delay,
          }}
        >
          {leaf.char}
        </span>
      ))}
    </div>
  );
}
