import { motion } from "framer-motion";

const HumanInTheLoopAnimation = () => {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const rx = 120;
  const ry = 50;

  // Two elliptical orbits rotated at different angles
  const orbits = [
    { rotation: -20, delay: 0, label: "Human", labelSide: "top" as const },
    { rotation: 40, delay: 3, label: "AI", labelSide: "bottom" as const },
  ];

  // Small floating particles on each orbit
  const particles = [
    { orbit: 0, delay: 1.5, size: 3 },
    { orbit: 0, delay: 4.5, size: 2 },
    { orbit: 1, delay: 0.5, size: 3 },
    { orbit: 1, delay: 3.5, size: 2 },
  ];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Subtle glow behind */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="relative z-10"
      >
        {/* Center node */}
        <circle cx={cx} cy={cy} r={4} className="fill-accent" opacity={0.6} />
        <motion.circle
          cx={cx}
          cy={cy}
          r={8}
          className="fill-accent"
          opacity={0.15}
          animate={{ r: [8, 14, 8] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Orbit paths */}
        {orbits.map((orbit, i) => (
          <g key={`orbit-${i}`} transform={`rotate(${orbit.rotation} ${cx} ${cy})`}>
            {/* Orbit ellipse */}
            <ellipse
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth={1}
              strokeDasharray="4 6"
              opacity={0.5}
            />

            {/* Main orbiting node */}
            <motion.g
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: orbit.delay,
              }}
              style={{ originX: `${cx}px`, originY: `${cy}px` }}
            >
              {/* Node positioned on ellipse (right side) */}
              <circle cx={cx + rx} cy={cy} r={6} className="fill-foreground" />
              <circle cx={cx + rx} cy={cy} r={10} className="fill-foreground" opacity={0.1} />
              
              {/* Trailing glow */}
              <motion.circle
                cx={cx + rx}
                cy={cy}
                r={3}
                className="fill-accent"
                animate={{ opacity: [0.8, 0.2, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.g>
          </g>
        ))}

        {/* Particles */}
        {particles.map((p, i) => (
          <g key={`particle-${i}`} transform={`rotate(${orbits[p.orbit].rotation} ${cx} ${cy})`}>
            <motion.g
              animate={{ rotate: [0, 360] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: p.delay,
              }}
              style={{ originX: `${cx}px`, originY: `${cy}px` }}
            >
              <motion.circle
                cx={cx + rx}
                cy={cy}
                r={p.size}
                className="fill-accent"
                animate={{ opacity: [0.6, 0.15, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              />
            </motion.g>
          </g>
        ))}

        {/* Connection lines from center to orbit intersections */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x2 = cx + Math.cos(rad) * 30;
          const y2 = cy + Math.sin(rad) * 30;
          return (
            <motion.line
              key={`line-${i}`}
              x1={cx}
              y1={cy}
              x2={x2}
              y2={y2}
              stroke="hsl(var(--border))"
              strokeWidth={0.5}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.6,
              }}
            />
          );
        })}
      </svg>

      {/* Labels */}
      <motion.div
        className="absolute top-6 left-1/2 -translate-x-1/2"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
          Human
        </span>
      </motion.div>
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <span className="text-[10px] font-mono tracking-widest uppercase text-accent">
          AI
        </span>
      </motion.div>
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 right-2"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <span className="text-[9px] font-mono tracking-wider uppercase text-muted-foreground">
          Leverage
        </span>
      </motion.div>
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 left-2"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      >
        <span className="text-[9px] font-mono tracking-wider uppercase text-muted-foreground">
          Judgment
        </span>
      </motion.div>
    </div>
  );
};

export default HumanInTheLoopAnimation;
