"use client";

import React, { useState, useRef, useEffect } from "react";
import { CustomKitConfig, ConfiguratorView } from "@/types";
import { Move3d, Sparkles, Shield, Eye } from "lucide-react";

interface InteractiveJerseyCanvasProps {
  config: CustomKitConfig;
  activeView: ConfiguratorView;
  onViewChange?: (view: ConfiguratorView) => void;
  className?: string;
}

export function InteractiveJerseyCanvas({
  config,
  activeView,
  className = "",
}: InteractiveJerseyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, startRotX: 0, startRotY: 0 });

  // Auto-rotate slow drift when in orbit mode
  useEffect(() => {
    if (activeView !== "orbit") {
      setRotation({ x: 0, y: 0 });
      return;
    }

    let animationFrame: number;
    let angle = 0;

    const animateOrbit = () => {
      if (!isDragging) {
        angle += 0.015;
        setRotation({
          x: Math.sin(angle * 0.7) * 4,
          y: Math.sin(angle) * 18,
        });
      }
      animationFrame = requestAnimationFrame(animateOrbit);
    };

    animationFrame = requestAnimationFrame(animateOrbit);
    return () => cancelAnimationFrame(animationFrame);
  }, [activeView, isDragging]);

  // Pointer drag to tilt physics
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startRotX: rotation.x,
      startRotY: rotation.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) {
      // Subtle tilt on hover when not dragging
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const offsetX = (e.clientX - rect.left) / rect.width - 0.5;
        const offsetY = (e.clientY - rect.top) / rect.height - 0.5;
        if (activeView !== "orbit") {
          setRotation({
            x: -offsetY * 12,
            y: offsetX * 16,
          });
        }
      }
      return;
    }

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    setRotation({
      x: Math.max(-25, Math.min(25, dragStartRef.current.startRotX - deltaY * 0.25)),
      y: Math.max(-45, Math.min(45, dragStartRef.current.startRotY + deltaX * 0.35)),
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignored
    }
  };

  const handleMouseLeave = () => {
    if (!isDragging && activeView !== "orbit") {
      setRotation({ x: 0, y: 0 });
    }
  };

  const {
    primaryColor,
    secondaryColor,
    accentColor,
    textColor,
    playerName,
    jerseyNumber,
    weavePattern,
    finish,
    crestFinish,
  } = config;

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseLeave={handleMouseLeave}
      className={`relative flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900/90 via-black to-zinc-950 p-5 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden cursor-grab active:cursor-grabbing select-none ${className}`}
      style={{ perspective: "1200px" }}
    >
      {/* Background Volumetric Lighting & Radial Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[380px] w-[380px] rounded-full blur-[90px] opacity-30 transition-all duration-700"
          style={{ background: accentColor }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_0%,_transparent_75%)]" />
        {/* Subtle grid lines */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]" />
      </div>

      {/* Top HUD Badges */}
      <div className="relative z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1 font-mono text-[10px] text-zinc-300 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span>STUDIO CAM // 60 FPS</span>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 font-mono text-[10px] text-amber-300 backdrop-blur-md">
          <Move3d className="h-3 w-3" />
          <span>DRAG TO ROTATE</span>
        </div>
      </div>

      {/* 3D Transform Stage Container */}
      <div
        className="relative z-10 my-auto flex h-[340px] sm:h-[420px] w-full items-center justify-center transition-transform duration-100 ease-out"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${
            activeView === "macro" ? 1.45 : 1
          })`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* SVG Jersey Visualizer */}
        <svg
          viewBox="0 0 400 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto max-w-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)] filter transition-all duration-300"
        >
          <defs>
            {/* Dynamic Body Gradient */}
            <linearGradient id="body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="50%" stopColor={secondaryColor} />
              <stop offset="100%" stopColor={primaryColor} />
            </linearGradient>

            <linearGradient id="sleeve-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={secondaryColor} />
              <stop offset="100%" stopColor={primaryColor} />
            </linearGradient>

            {/* Accent Gold/Trim Gradient */}
            <linearGradient id="accent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor={accentColor} />
            </linearGradient>

            {/* Material Finishes */}
            {finish === "satin" && (
              <linearGradient id="sheen-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.08" />
                <stop offset="30%" stopColor="#fff" stopOpacity="0.22" />
                <stop offset="60%" stopColor="#fff" stopOpacity="0.02" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0.12" />
              </linearGradient>
            )}

            {finish === "metallic" && (
              <linearGradient id="sheen-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={accentColor} stopOpacity="0.1" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.35" />
                <stop offset="100%" stopColor={accentColor} stopOpacity="0.1" />
              </linearGradient>
            )}

            {/* Weave Patterns */}
            {/* 1. Tactical Pique */}
            <pattern id="weave-pique" width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="0.75" fill={accentColor} opacity="0.18" />
              <circle cx="4.5" cy="4.5" r="0.75" fill="#fff" opacity="0.1" />
            </pattern>

            {/* 2. Topographic Jacquard */}
            <pattern id="weave-jacquard" width="24" height="24" patternUnits="userSpaceOnUse">
              <path
                d="M 0 6 Q 6 12 12 6 T 24 6 M 0 18 Q 6 24 12 18 T 24 18"
                stroke={accentColor}
                strokeWidth="0.75"
                fill="none"
                opacity="0.2"
              />
            </pattern>

            {/* 3. Carbon Diamond */}
            <pattern id="weave-carbon" width="12" height="12" patternUnits="userSpaceOnUse">
              <path
                d="M 6 0 L 12 6 L 6 12 L 0 6 Z"
                stroke={accentColor}
                strokeWidth="0.5"
                fill="none"
                opacity="0.2"
              />
            </pattern>

            {/* 4. Honeycomb Mesh */}
            <pattern id="weave-honeycomb" width="14" height="14" patternUnits="userSpaceOnUse">
              <polygon
                points="7,1 13,4 13,10 7,13 1,10 1,4"
                stroke={accentColor}
                strokeWidth="0.6"
                fill="none"
                opacity="0.22"
              />
            </pattern>

            {/* Crest Filter */}
            <filter id="crest-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={accentColor} floodOpacity="0.5" />
            </filter>
          </defs>

          {/* ============================================================ */}
          {/* VIEW: FRONT CHEST & ORBIT */}
          {/* ============================================================ */}
          {(activeView === "front" || activeView === "orbit") && (
            <g id="front-jersey-view">
              {/* Outer Subtle Aura */}
              <path
                d="M 120 40 L 60 110 L 10 160 L 60 210 L 95 185 L 95 440 L 305 440 L 305 185 L 340 210 L 390 160 L 340 110 L 280 40 Z"
                fill={accentColor}
                opacity="0.08"
              />

              {/* Main Body Path */}
              <path
                d="M 130 40 C 170 65, 230 65, 270 40 L 330 90 L 390 150 L 345 200 L 305 170 L 305 435 C 305 442, 298 448, 290 448 L 110 448 C 102 448, 95 442, 95 435 L 95 170 L 55 200 L 10 150 L 70 90 Z"
                fill="url(#body-grad)"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1.5"
              />

              {/* Weave Pattern Overlay */}
              <path
                d="M 100 150 L 300 150 L 300 440 L 100 440 Z"
                fill={`url(#weave-${weavePattern})`}
              />

              {/* Sheen Overlay for Satin/Metallic */}
              {finish !== "matte" && (
                <path
                  d="M 130 40 C 170 65, 230 65, 270 40 L 330 90 L 390 150 L 345 200 L 305 170 L 305 435 L 110 448 L 95 170 L 55 200 L 10 150 L 70 90 Z"
                  fill="url(#sheen-grad)"
                />
              )}

              {/* Left Sleeve Panel & Cuff */}
              <path
                d="M 130 40 L 70 90 L 10 150 L 55 200 L 95 170 L 115 110 Z"
                fill="url(#sleeve-grad)"
                stroke="rgba(255,255,255,0.06)"
              />
              <path
                d="M 10 150 L 55 200 L 58 196 L 14 146 Z"
                fill={accentColor}
                opacity="0.9"
              />

              {/* Right Sleeve Panel & Cuff */}
              <path
                d="M 270 40 L 330 90 L 390 150 L 345 200 L 305 170 L 285 110 Z"
                fill="url(#sleeve-grad)"
                stroke="rgba(255,255,255,0.06)"
              />
              <path
                d="M 390 150 L 345 200 L 342 196 L 386 146 Z"
                fill={accentColor}
                opacity="0.9"
              />

              {/* Collar Ribbing */}
              <path
                d="M 130 40 C 160 85, 240 85, 270 40 C 240 68, 160 68, 130 40 Z"
                fill="#050508"
                stroke={accentColor}
                strokeWidth="2"
              />
              <path
                d="M 155 48 C 175 62, 225 62, 245 48"
                stroke={accentColor}
                strokeWidth="1.5"
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

              {/* Chest Crest Shield (Left Chest) */}
              <g transform="translate(140, 115)" filter="url(#crest-shadow)">
                <polygon
                  points="18,0 38,0 48,16 28,46 8,16"
                  fill={crestFinish === "stealth" ? "#18181b" : "url(#accent-grad)"}
                  stroke={accentColor}
                  strokeWidth="2"
                />
                <circle cx="28" cy="18" r="6" fill={crestFinish === "gold" ? "#ffffff" : accentColor} />
                <line x1="28" y1="28" x2="28" y2="38" stroke={accentColor} strokeWidth="2" />
              </g>

              {/* Sponsor / Atelier Chest Emblem (Right Chest) */}
              <g transform="translate(225, 125)">
                <path
                  d="M 0 10 L 15 0 L 30 10 L 15 20 Z"
                  stroke={accentColor}
                  strokeWidth="1.5"
                  fill="none"
                />
                <circle cx="15" cy="10" r="3" fill={accentColor} />
              </g>

              {/* Player Mantra / Brand on Center Chest */}
              <text
                x="200"
                y="245"
                textAnchor="middle"
                fill={textColor || accentColor}
                fontFamily="monospace"
                fontSize={playerName.length > 16 ? "11" : "13"}
                fontWeight="900"
                letterSpacing="0.25em"
                className="transition-all"
              >
                {playerName.toUpperCase()}
              </text>

              {/* Front Jersey Number */}
              <text
                x="200"
                y="340"
                textAnchor="middle"
                fill={textColor || accentColor}
                fontFamily="system-ui, -apple-system, sans-serif"
                fontSize="84"
                fontWeight="900"
                letterSpacing="-0.04em"
                className="transition-all"
              >
                {jerseyNumber}
              </text>

              {/* Bottom Authentic Serial Tag */}
              <rect
                x="115"
                y="415"
                width="44"
                height="18"
                rx="2"
                fill="#0a0a0f"
                stroke={accentColor}
                strokeWidth="1"
              />
              <text
                x="137"
                y="427"
                textAnchor="middle"
                fill={accentColor}
                fontFamily="monospace"
                fontSize="6"
                fontWeight="bold"
              >
                AUT-{jerseyNumber}
              </text>
            </g>
          )}

          {/* ============================================================ */}
          {/* VIEW: BACK NAME & NUMBER */}
          {/* ============================================================ */}
          {activeView === "back" && (
            <g id="back-jersey-view">
              {/* Main Body Path Back */}
              <path
                d="M 130 40 C 170 50, 230 50, 270 40 L 330 90 L 390 150 L 345 200 L 305 170 L 305 435 C 305 442, 298 448, 290 448 L 110 448 C 102 448, 95 442, 95 435 L 95 170 L 55 200 L 10 150 L 70 90 Z"
                fill="url(#body-grad)"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1.5"
              />

              {/* Weave Pattern Overlay */}
              <path
                d="M 100 120 L 300 120 L 300 440 L 100 440 Z"
                fill={`url(#weave-${weavePattern})`}
              />

              {/* Sleeves */}
              <path
                d="M 130 40 L 70 90 L 10 150 L 55 200 L 95 170 L 115 110 Z"
                fill="url(#sleeve-grad)"
              />
              <path
                d="M 10 150 L 55 200 L 58 196 L 14 146 Z"
                fill={accentColor}
              />
              <path
                d="M 270 40 L 330 90 L 390 150 L 345 200 L 305 170 L 285 110 Z"
                fill="url(#sleeve-grad)"
              />
              <path
                d="M 390 150 L 345 200 L 342 196 L 386 146 Z"
                fill={accentColor}
              />

              {/* Back Collar Band */}
              <path
                d="M 130 40 C 170 52, 230 52, 270 40 L 265 52 C 230 62, 170 62, 135 52 Z"
                fill="#050508"
                stroke={accentColor}
                strokeWidth="1.5"
              />

              {/* Inner Collar Motto */}
              <text
                x="200"
                y="85"
                textAnchor="middle"
                fill={accentColor}
                fontFamily="monospace"
                fontSize="7"
                fontWeight="bold"
                letterSpacing="0.2em"
                opacity="0.8"
              >
                // JERSEY VERSE ATELIER //
              </text>

              {/* Arched Player Name / Mantra */}
              <text
                x="200"
                y="150"
                textAnchor="middle"
                fill={textColor || accentColor}
                fontFamily="system-ui, -apple-system, sans-serif"
                fontSize={playerName.length > 14 ? "18" : "24"}
                fontWeight="900"
                letterSpacing="0.18em"
              >
                {playerName.toUpperCase()}
              </text>

              {/* Large Back Number with Shadow Contour */}
              <text
                x="202"
                y="312"
                textAnchor="middle"
                fill="rgba(0,0,0,0.6)"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontSize="140"
                fontWeight="900"
                letterSpacing="-0.04em"
              >
                {jerseyNumber}
              </text>
              <text
                x="200"
                y="310"
                textAnchor="middle"
                fill={textColor || accentColor}
                stroke="#000000"
                strokeWidth="3"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontSize="140"
                fontWeight="900"
                letterSpacing="-0.04em"
              >
                {jerseyNumber}
              </text>

              {/* Number Inner Crest Stamp */}
              <circle cx="200" cy="360" r="10" fill="#000000" stroke={accentColor} strokeWidth="1" />
              <text
                x="200"
                y="363"
                textAnchor="middle"
                fill={accentColor}
                fontSize="6"
                fontFamily="monospace"
                fontWeight="bold"
              >
                JV
              </text>
            </g>
          )}

          {/* ============================================================ */}
          {/* VIEW: CREST MACRO ZOOM */}
          {/* ============================================================ */}
          {activeView === "macro" && (
            <g id="macro-crest-view">
              {/* Macro Backdrop Fabric Weave */}
              <rect x="50" y="50" width="300" height="380" rx="16" fill="url(#body-grad)" />
              <rect x="50" y="50" width="300" height="380" rx="16" fill={`url(#weave-${weavePattern})`} />

              {/* Macro Volumetric Crest Shield */}
              <g transform="translate(100, 110)">
                {/* 3D Liquid Edge Layer */}
                <polygon
                  points="100,20 180,20 200,80 100,200 0,80 20,20"
                  fill="#09090c"
                  stroke={accentColor}
                  strokeWidth="6"
                  filter="url(#crest-shadow)"
                />

                {/* Inner Bevel */}
                <polygon
                  points="100,35 165,35 180,85 100,180 20,85 35,35"
                  fill="url(#accent-grad)"
                  opacity="0.9"
                />

                {/* Central Emblem Star & Monogram */}
                <circle cx="100" cy="90" r="28" fill="#050508" stroke={accentColor} strokeWidth="3" />
                <path
                  d="M 100 70 L 105 85 L 120 90 L 105 95 L 100 110 L 95 95 L 80 90 L 95 85 Z"
                  fill={accentColor}
                />

                {/* Micro Text on Shield */}
                <text
                  x="100"
                  y="145"
                  textAnchor="middle"
                  fill="#000000"
                  fontFamily="monospace"
                  fontSize="9"
                  fontWeight="bold"
                  letterSpacing="0.15em"
                >
                  JERSEY VERSE
                </text>
              </g>

              {/* Tech Macro HUD overlay */}
              <text
                x="200"
                y="380"
                textAnchor="middle"
                fill={accentColor}
                fontFamily="monospace"
                fontSize="11"
                fontWeight="bold"
                letterSpacing="0.15em"
              >
                // 3D LIQUID SILICONE RELIEF //
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Bottom Status Ticker */}
      <div className="relative z-20 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] font-mono text-zinc-400 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-500">MATERIAL //</span>
          <span className="text-zinc-200 font-bold uppercase">{finish}-SHEEN</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-zinc-500">CREST //</span>
          <span className="text-amber-400 font-bold uppercase">{crestFinish}</span>
        </div>
      </div>
    </div>
  );
}
