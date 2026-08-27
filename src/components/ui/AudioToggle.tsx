"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function AudioToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);

  const startAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 2);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Deep Sub Drone (55Hz)
      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1 note

      // Warm overtone drone (110Hz)
      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(110, ctx.currentTime); // A2 note

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(160, ctx.currentTime);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.6, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(masterGain);

      osc1.start();
      osc2.start();

      osc1Ref.current = osc1;
      osc2Ref.current = osc2;

      setIsPlaying(true);
    } catch {
      // Audio context may be restricted by browser policies
      setIsPlaying(false);
    }
  };

  const stopAudio = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      try {
        const ctx = audioCtxRef.current;
        gainNodeRef.current.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
        setTimeout(() => {
          osc1Ref.current?.stop();
          osc2Ref.current?.stop();
          audioCtxRef.current?.close();
          audioCtxRef.current = null;
        }, 500);
      } catch {
        // cleanup
      }
    }
    setIsPlaying(false);
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <button
      onClick={toggleSound}
      className="group relative flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] font-mono tracking-wider text-zinc-300 backdrop-blur-md transition-all duration-300 hover:border-amber-500/50 hover:bg-black/60 hover:text-white"
      title={isPlaying ? "Mute Atmospheric Sound" : "Enable Cinematic Sound"}
      aria-label="Toggle atmospheric sound"
    >
      <span className="relative flex h-2 w-2">
        {isPlaying && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            isPlaying ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" : "bg-zinc-600"
          }`}
        ></span>
      </span>

      <span className="hidden sm:inline">
        {isPlaying ? "ATMOSPHERE: ON" : "ATMOSPHERE: OFF"}
      </span>

      {isPlaying ? (
        <Volume2 className="h-3.5 w-3.5 text-amber-400 transition-transform group-hover:scale-110" />
      ) : (
        <VolumeX className="h-3.5 w-3.5 text-zinc-400 transition-transform group-hover:scale-110" />
      )}
    </button>
  );
}
