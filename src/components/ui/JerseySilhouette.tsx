"use client";

import React from "react";

interface JerseySilhouetteProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  number?: string;
  className?: string;
  pattern?: "geometric" | "topographic" | "stripes" | "mesh";
}

export function JerseySilhouette({
  primaryColor = "#0f0f13",
  secondaryColor = "#1a1a24",
  accentColor = "#f59e0b",
  number = "10",
  className = "w-full h-full",
  pattern = "geometric",
}: JerseySilhouetteProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 400 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] filter transition-transform duration-500 hover:scale-[1.02]"
      >
        <defs>
          <linearGradient id={`grad-body-${number}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="50%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor={primaryColor} />
          </linearGradient>

          <linearGradient id={`grad-sleeve-left-${number}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor={primaryColor} />
          </linearGradient>

          <linearGradient id={`grad-gold-${number}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accentColor} />
            <stop offset="50%" stopColor="#fff2be" />
            <stop offset="100%" stopColor={accentColor} />
          </linearGradient>

          <pattern id={`pattern-mesh-${number}`} width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill={accentColor} opacity="0.15" />
            <circle cx="8" cy="8" r="0.8" fill={accentColor} opacity="0.15" />
          </pattern>

          <pattern id={`pattern-stripe-${number}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="20" y2="20" stroke={accentColor} strokeWidth="0.5" opacity="0.1" />
          </pattern>

          <filter id={`glow-${number}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer subtle halo glow */}
        <path
          d="M 120 40 L 60 110 L 10 160 L 60 210 L 95 185 L 95 440 L 305 440 L 305 185 L 340 210 L 390 160 L 340 110 L 280 40 Z"
          fill={accentColor}
          opacity="0.08"
          filter={`url(#glow-${number})`}
        />

        {/* Main Body Path */}
        <path
          d="M 130 40 
             C 170 65, 230 65, 270 40 
             L 330 90 
             L 390 150 
             L 345 200 
             L 305 170 
             L 305 435 
             C 305 442, 298 448, 290 448 
             L 110 448 
             C 102 448, 95 442, 95 435 
             L 95 170 
             L 55 200 
             L 10 150 
             L 70 90 
             Z"
          fill={`url(#grad-body-${number})`}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1.5"
        />

        {/* Pattern Overlay */}
        <path
          d="M 100 160 L 300 160 L 300 440 L 100 440 Z"
          fill={pattern === "mesh" ? `url(#pattern-mesh-${number})` : `url(#pattern-stripe-${number})`}
        />

        {/* Left Sleeve Panel */}
        <path
          d="M 130 40 L 70 90 L 10 150 L 55 200 L 95 170 L 115 110 Z"
          fill={`url(#grad-sleeve-left-${number})`}
          stroke="rgba(255,255,255,0.05)"
        />
        {/* Left Cuff */}
        <path
          d="M 10 150 L 55 200 L 58 196 L 14 146 Z"
          fill={accentColor}
          opacity="0.8"
        />

        {/* Right Sleeve Panel */}
        <path
          d="M 270 40 L 330 90 L 390 150 L 345 200 L 305 170 L 285 110 Z"
          fill={`url(#grad-sleeve-left-${number})`}
          stroke="rgba(255,255,255,0.05)"
        />
        {/* Right Cuff */}
        <path
          d="M 390 150 L 345 200 L 342 196 L 386 146 Z"
          fill={accentColor}
          opacity="0.8"
        />

        {/* Collar Construction */}
        <path
          d="M 130 40 C 160 85, 240 85, 270 40 C 240 68, 160 68, 130 40 Z"
          fill="#0a0a0e"
          stroke={accentColor}
          strokeWidth="1.5"
          opacity="0.9"
        />
        {/* Inner Neck Tape */}
        <path
          d="M 155 48 C 175 62, 225 62, 245 48"
          stroke={accentColor}
          strokeWidth="2"
          strokeDasharray="3 2"
        />

        {/* Side Ventilation Ribs */}
        <path
          d="M 98 200 L 98 420"
          stroke={accentColor}
          strokeWidth="2"
          strokeOpacity="0.4"
          strokeDasharray="6 4"
        />
        <path
          d="M 302 200 L 302 420"
          stroke={accentColor}
          strokeWidth="2"
          strokeOpacity="0.4"
          strokeDasharray="6 4"
        />

        {/* Chest Crest Shield */}
        <g transform="translate(145, 120)">
          <polygon
            points="15,0 35,0 45,15 25,45 5,15"
            fill="none"
            stroke={`url(#grad-gold-${number})`}
            strokeWidth="2"
          />
          <circle cx="25" cy="18" r="6" fill={`url(#grad-gold-${number})`} />
          <line x1="25" y1="28" x2="25" y2="38" stroke={`url(#grad-gold-${number})`} strokeWidth="2" />
        </g>

        {/* Brand Wordmark / Center Chest */}
        <text
          x="200"
          y="235"
          textAnchor="middle"
          fill="#ffffff"
          opacity="0.85"
          fontFamily="monospace"
          fontSize="14"
          fontWeight="bold"
          letterSpacing="0.3em"
        >
          ARCHETYPE
        </text>

        {/* Jersey Number */}
        <text
          x="200"
          y="340"
          textAnchor="middle"
          fill={`url(#grad-gold-${number})`}
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="88"
          fontWeight="900"
          letterSpacing="-0.05em"
          opacity="0.95"
          filter={`url(#glow-${number})`}
        >
          {number}
        </text>

        {/* Bottom Hem Serial Tag */}
        <rect
          x="115"
          y="415"
          width="42"
          height="18"
          rx="2"
          fill="#0a0a0f"
          stroke={accentColor}
          strokeWidth="1"
        />
        <text
          x="136"
          y="427"
          textAnchor="middle"
          fill={accentColor}
          fontFamily="monospace"
          fontSize="6.5"
          fontWeight="bold"
          letterSpacing="0.05em"
        >
          AUT-26
        </text>

        {/* Authenticity hologram on right hem */}
        <rect
          x="245"
          y="417"
          width="38"
          height="14"
          rx="2"
          fill={accentColor}
          opacity="0.25"
        />
        <text
          x="264"
          y="427"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="monospace"
          fontSize="5.5"
          fontWeight="bold"
        >
          GENUINE
        </text>
      </svg>
    </div>
  );
}
