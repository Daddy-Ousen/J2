"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Sparkles, Sliders } from "lucide-react";

export function AudioToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<{
    oscillators: OscillatorNode[];
    noiseSource: AudioBufferSourceNode | null;
    lfo: OscillatorNode | null;
    filters: BiquadFilterNode[];
  }>({
    oscillators: [],
    noiseSource: null,
    lfo: null,
    filters: [],
  });

  const createPinkNoiseBuffer = (ctx: AudioContext): AudioBuffer => {
    const bufferSize = ctx.sampleRate * 4; // 4 seconds looping buffer
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }
    }
    return buffer;
  };

  const startAudio = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      audioCtxRef.current = ctx;

      // 1. Dynamics Compressor (Mastering stage for warm punchy audio on all speakers)
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-24, ctx.currentTime);
      compressor.knee.setValueAtTime(30, ctx.currentTime);
      compressor.ratio.setValueAtTime(12, ctx.currentTime);
      compressor.attack.setValueAtTime(0.003, ctx.currentTime);
      compressor.release.setValueAtTime(0.25, ctx.currentTime);
      compressor.connect(ctx.destination);

      // 2. Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(volume * 0.35, ctx.currentTime + 1.5);
      masterGain.connect(compressor);
      masterGainRef.current = masterGain;

      const activeOscillators: OscillatorNode[] = [];
      const activeFilters: BiquadFilterNode[] = [];

      // =========================================================================
      // LAYER 1: CINEMATIC STADIUM DRONE CHORD (D-Minor / A Heroic Texture)
      // Notes: D2 (73.4Hz), A2 (110.0Hz), D3 (146.8Hz), F3 (174.6Hz), A3 (220.0Hz)
      // =========================================================================
      const chordFrequencies = [
        { freq: 73.42, type: "triangle" as OscillatorType, gain: 0.5, detune: -4 },
        { freq: 110.0, type: "sawtooth" as OscillatorType, gain: 0.25, detune: 5 },
        { freq: 146.83, type: "sine" as OscillatorType, gain: 0.4, detune: -6 },
        { freq: 174.61, type: "triangle" as OscillatorType, gain: 0.3, detune: 4 },
        { freq: 220.0, type: "sine" as OscillatorType, gain: 0.2, detune: 2 },
      ];

      const padFilter = ctx.createBiquadFilter();
      padFilter.type = "lowpass";
      padFilter.frequency.setValueAtTime(420, ctx.currentTime);
      padFilter.Q.setValueAtTime(2.0, ctx.currentTime);
      activeFilters.push(padFilter);

      const padGain = ctx.createGain();
      padGain.gain.setValueAtTime(0.7, ctx.currentTime);

      chordFrequencies.forEach(({ freq, type, gain, detune }) => {
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.detune.setValueAtTime(detune, ctx.currentTime);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(gain, ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(padFilter);
        osc.start();
        activeOscillators.push(osc);
      });

      padFilter.connect(padGain);
      padGain.connect(masterGain);

      // =========================================================================
      // LAYER 2: DISTANT STADIUM CROWD SWELLS & ARENA WIND NOISE
      // =========================================================================
      const crowdBuffer = createPinkNoiseBuffer(ctx);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = crowdBuffer;
      noiseSource.loop = true;

      // Resonant bandpass filter that sounds like distant cheering thousands
      const crowdFilter = ctx.createBiquadFilter();
      crowdFilter.type = "bandpass";
      crowdFilter.frequency.setValueAtTime(550, ctx.currentTime);
      crowdFilter.Q.setValueAtTime(3.5, ctx.currentTime);
      activeFilters.push(crowdFilter);

      const crowdGain = ctx.createGain();
      crowdGain.gain.setValueAtTime(0.5, ctx.currentTime);

      // LFO modulation to simulate periodic waves of crowd cheers rising & falling
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.09, ctx.currentTime); // ~11-second natural swell cycle
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(280, ctx.currentTime); // mod range

      lfo.connect(lfoGain);
      lfoGain.connect(crowdFilter.frequency);
      lfo.start();

      noiseSource.connect(crowdFilter);
      crowdFilter.connect(crowdGain);
      crowdGain.connect(masterGain);
      noiseSource.start();

      nodesRef.current = {
        oscillators: activeOscillators,
        noiseSource,
        lfo,
        filters: activeFilters,
      };

      setIsPlaying(true);
    } catch (e) {
      console.warn("Web Audio policy restricted:", e);
      setIsPlaying(false);
    }
  };

  const stopAudio = () => {
    if (masterGainRef.current && audioCtxRef.current) {
      try {
        const ctx = audioCtxRef.current;
        masterGainRef.current.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
        setTimeout(() => {
          nodesRef.current.oscillators.forEach((osc) => {
            try {
              osc.stop();
            } catch {}
          });
          try {
            nodesRef.current.noiseSource?.stop();
          } catch {}
          try {
            nodesRef.current.lfo?.stop();
          } catch {}
          audioCtxRef.current?.close();
          audioCtxRef.current = null;
        }, 650);
      } catch {}
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
    <div className="flex items-center gap-1.5">
      <button
        onClick={toggleSound}
        className={`group relative flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-mono tracking-wider backdrop-blur-md transition-all duration-300 ${
          isPlaying
            ? "border-amber-400 bg-amber-500/15 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
            : "border-white/10 bg-black/40 text-zinc-300 hover:border-amber-500/50 hover:bg-black/60 hover:text-white"
        }`}
        title={isPlaying ? "Mute Matchday Arena Atmosphere" : "Turn ON Matchday Arena Sound"}
        aria-label="Toggle atmospheric sound"
      >
        <span className="relative flex h-2 w-2">
          {isPlaying && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
          )}
          <span
            className={`relative inline-flex h-2 w-2 rounded-full ${
              isPlaying ? "bg-amber-400 shadow-[0_0_8px_#f59e0b]" : "bg-zinc-600"
            }`}
          ></span>
        </span>

        <span className="hidden sm:inline font-bold">
          {isPlaying ? "ARENA SOUND: ON" : "ARENA SOUND: OFF"}
        </span>

        {isPlaying ? (
          <Volume2 className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
        ) : (
          <VolumeX className="h-3.5 w-3.5 text-zinc-400 transition-transform group-hover:scale-110" />
        )}
      </button>
    </div>
  );
}
