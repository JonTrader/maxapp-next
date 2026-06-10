"use client";

interface LineArtProps {
  className?: string;
  variant?: "curve" | "dots" | "wave" | "circle" | "line" | "spiral";
  strokeWidth?: number;
}

export default function LineArt({
  className = "",
  variant = "curve",
  strokeWidth = 1.5,
}: LineArtProps) {
  const variants = {
    curve: (
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${className}`}
      >
        <path
          d="M20 180 Q100 20 180 100"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="20" cy="180" r="4" fill="currentColor" />
        <circle cx="180" cy="100" r="4" fill="currentColor" />
      </svg>
    ),
    dots: (
      <svg
        viewBox="0 0 100 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${className}`}
      >
        {[...Array(8)].map((_, i) => (
          <circle
            key={i}
            cx="50"
            cy={25 + i * 22}
            r={i % 3 === 0 ? 6 : 3}
            fill="currentColor"
            opacity={i % 3 === 0 ? 1 : 0.5}
          />
        ))}
      </svg>
    ),
    wave: (
      <svg
        viewBox="0 0 300 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${className}`}
      >
        <path
          d="M0 50 Q75 10 150 50 T300 50"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M0 70 Q75 30 150 70 T300 70"
          stroke="currentColor"
          strokeWidth={strokeWidth / 2}
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
        />
      </svg>
    ),
    circle: (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${className}`}
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray="8 4"
          fill="none"
        />
        <circle cx="50" cy="50" r="8" fill="currentColor" />
      </svg>
    ),
    line: (
      <svg
        viewBox="0 0 2 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${className}`}
      >
        <line
          x1="1"
          y1="0"
          x2="1"
          y2="100"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray="1 6"
        />
      </svg>
    ),
    spiral: (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${className}`}
      >
        <path
          d="M50 50 m-40 0 a40 40 0 1 0 80 0 a40 40 0 1 0 -80 0 M50 50 m-25 0 a25 25 0 1 0 50 0 a25 25 0 1 0 -50 0 M50 50 m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    ),
  };

  return variants[variant] || variants.curve;
}
