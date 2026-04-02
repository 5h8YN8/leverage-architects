const LoopLogo = ({ size = 24 }: { size?: number }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className="shrink-0"
    >
      {/* Two intersecting elliptical orbits */}
      <ellipse
        cx="16"
        cy="16"
        rx="12"
        ry="6"
        transform="rotate(-25 16 16)"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <ellipse
        cx="16"
        cy="16"
        rx="12"
        ry="6"
        transform="rotate(35 16 16)"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.5"
      />
      {/* Center node */}
      <circle cx="16" cy="16" r="2.5" className="fill-accent" />
      {/* Orbit nodes */}
      <circle cx="27" cy="13" r="1.5" fill="currentColor" />
      <circle cx="5" cy="19" r="1.5" fill="currentColor" />
    </svg>
  );
};

export default LoopLogo;
