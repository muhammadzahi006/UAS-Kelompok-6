import React from "react";

interface EduvibeLogoProps {
  className?: string;
  size?: number;
}

export default function EduvibeLogo({ className = "", size = 36 }: EduvibeLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="eduvibe-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="eduvibe-grad-accent" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>

      {/* Rounded squircle background */}
      <rect width="48" height="48" rx="14" fill="url(#eduvibe-grad-primary)" />

      {/* Dynamic Vibe Waves / Book Peak Symbol */}
      <path
        d="M12 28C14.5 23 18 17 24 17C30 17 33.5 23 36 28"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 33C17.5 29 20 25 24 25C28 25 30.5 29 33 33"
        stroke="url(#eduvibe-grad-accent)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Academic Cap Diamond Accent */}
      <polygon
        points="24,10 28,14 24,18 20,14"
        fill="#FDE047"
      />
    </svg>
  );
}
