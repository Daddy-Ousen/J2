"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, SkipForward, Play, Pause, Music, Disc } from "lucide-react";

const MATCHDAY_PLAYLIST = [
  {
    id: "anthem-1",
    title: "Mantle of Glory",
    subtitle: "Champions Matchday Anthem",
    src: "/audio/matchday-anthem-1.mp3",
  },
  {
    id: "anthem-2",
    title: "Stadium Lights",
    subtitle: "High-Energy Arena Hype",
    src: "/audio/matchday-anthem-2.mp3",
  },
  {
    id: "anthem-3",
    title: "Tunnel Walk",
    subtitle: "Electric Pre-Match Walkout",
    src: "/audio/matchday-anthem-3.mp3",
  },
];

export function AudioToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = MATCHDAY_PLAYLIST[currentTrackIndex];

  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio(MATCHDAY_PLAYLIST[0].src);
    audio.loop = false;
    audio.volume = volume;

    audio.onended = () => {
      setCurrentTrackIndex((prev) => (prev + 1) % MATCHDAY_PLAYLIST.length);
    };

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Update track src when track index changes
  useEffect(() => {
    if (audioRef.current && typeof window !== "undefined") {
      const wasPlaying = isPlaying;
      audioRef.current.src = currentTrack.src;
      audioRef.current.volume = volume;
      if (wasPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentTrackIndex]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((e) => {
          console.warn("Playback error:", e);
          setIsPlaying(false);
        });
    }
  };

  const handleNextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTrackIndex((prev) => (prev + 1) % MATCHDAY_PLAYLIST.length);
  };

  return (
    <div className="relative flex items-center">
      {/* Compact on Mobile, Extended on Desktop */}
      <div className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-zinc-950/90 p-1 sm:px-2.5 sm:py-1 text-[11px] font-mono backdrop-blur-md shadow-md">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-black hover:bg-amber-300 transition-transform active:scale-95 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
          title={isPlaying ? "Pause Matchday Soundtrack" : "Play Football Soundtrack"}
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
        >
          {isPlaying ? (
            <Pause className="h-3.5 w-3.5 fill-black stroke-black" />
          ) : (
            <Play className="h-3.5 w-3.5 fill-black stroke-black ml-0.5" />
          )}
        </button>

        {/* Track Title Display (Hidden on very small mobile, visible on sm+) */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="hidden sm:flex flex-col cursor-pointer max-w-[140px] truncate px-1 text-left select-none"
        >
          <div className="flex items-center gap-1.5 font-bold text-white truncate text-[11px]">
            <Disc className={`h-3 w-3 flex-shrink-0 text-amber-400 ${isPlaying ? "animate-spin" : ""}`} />
            <span className="truncate">{currentTrack.title}</span>
          </div>
          <span className="text-[9px] text-zinc-400 truncate">
            {currentTrack.subtitle}
          </span>
        </div>

        {/* Next Track Button (Desktop only) */}
        <button
          onClick={handleNextTrack}
          className="hidden sm:flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 hover:text-amber-300 hover:bg-white/5 transition-colors"
          title="Skip to next track"
        >
          <SkipForward className="h-3.5 w-3.5" />
        </button>

        {/* Sound Waves Animation when active */}
        {isPlaying && (
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-end gap-0.5 h-3.5 px-1 cursor-pointer"
          >
            <span className="w-0.5 bg-amber-400 rounded-full animate-pulse h-2" />
            <span className="w-0.5 bg-amber-400 rounded-full animate-pulse h-3.5" />
            <span className="w-0.5 bg-amber-400 rounded-full animate-pulse h-1.5" />
          </div>
        )}
      </div>

      {/* Expanded Playlist & Volume Modal */}
      {isExpanded && (
        <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-white/15 bg-zinc-950/98 p-4 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-white">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-400">
              <Music className="h-4 w-4" />
              <span>MATCHDAY SOUNDTRACK</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-zinc-400 hover:text-white text-xs font-mono"
            >
              ✕
            </button>
          </div>

          {/* Volume Slider */}
          <div className="space-y-1 mb-3 bg-zinc-900/60 p-2.5 rounded-xl border border-white/5">
            <div className="flex justify-between font-mono text-[10px] text-zinc-400">
              <span>VOLUME</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-zinc-700 rounded-lg"
            />
          </div>

          {/* Playlist Track List */}
          <div className="space-y-1.5">
            {MATCHDAY_PLAYLIST.map((track, idx) => {
              const isCurrent = idx === currentTrackIndex;
              return (
                <div
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(idx);
                    if (!isPlaying && audioRef.current) {
                      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
                    }
                  }}
                  className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                    isCurrent
                      ? "bg-amber-400/15 border border-amber-400/40 text-amber-300"
                      : "bg-zinc-900/40 border border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-mono font-bold ${
                        isCurrent ? "bg-amber-400 text-black" : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs truncate">{track.title}</div>
                      <div className="text-[10px] text-zinc-500 truncate">{track.subtitle}</div>
                    </div>
                  </div>

                  {isCurrent && isPlaying && (
                    <div className="flex items-end gap-0.5 h-3 flex-shrink-0">
                      <span className="w-0.5 bg-amber-400 rounded-full animate-pulse h-2" />
                      <span className="w-0.5 bg-amber-400 rounded-full animate-pulse h-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
