"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Volume2, VolumeX, SkipForward, Play, Pause, Music, Disc, Shuffle } from "lucide-react";

export const MATCHDAY_PLAYLIST = [
  {
    id: "track-1",
    title: "Shut The Stadium Down",
    subtitle: "UK Drill Matchday Hype",
    src: "/audio/Shut The Stadium Down.mp3",
  },
  {
    id: "track-2",
    title: "The Mantle",
    subtitle: "Matchday Conviction Anthem",
    src: "/audio/The Mantle.mp3",
  },
  {
    id: "track-3",
    title: "For the Love of the Game",
    subtitle: "Tribute to Football Culture",
    src: "/audio/For the Love of the Game.mp3",
  },
  {
    id: "track-4",
    title: "Fresh Out The Wrapper",
    subtitle: "Unboxing Matchday Drip",
    src: "/audio/Fresh Out The Wrapper.mp3",
  },
  {
    id: "track-5",
    title: "Matchday Magic",
    subtitle: "Under The Stadium Lights",
    src: "/audio/Matchday Magic.mp3",
  },
  {
    id: "track-6",
    title: "More Than 90 Minutes",
    subtitle: "Lifelong Pitch Devotion",
    src: "/audio/More Than 90 Minutes.mp3",
  },
  {
    id: "track-7",
    title: "Jersey Verse",
    subtitle: "Official Matchday Soundtrack",
    src: "/audio/Jersey Verse.mp3",
  },
];

export function AudioToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.55);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userInteractedRef = useRef(false);

  const currentTrack = MATCHDAY_PLAYLIST[currentTrackIndex];

  // Helper to pick next track randomly from remaining playlist
  const pickNextRandomTrack = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => {
      const candidates = MATCHDAY_PLAYLIST.map((_, idx) => idx).filter((idx) => idx !== prevIndex);
      if (candidates.length === 0) return 0;
      const nextRandom = candidates[Math.floor(Math.random() * candidates.length)];
      return nextRandom;
    });
  }, []);

  // Initialize audio and configure automatic playback
  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio(MATCHDAY_PLAYLIST[0].src);
    audio.preload = "metadata";
    audio.loop = false;
    audio.volume = volume;

    // Automatically pick next song randomly when current track finishes
    audio.onended = () => {
      pickNextRandomTrack();
    };

    audioRef.current = audio;

    // Attempt direct autoplay on initial website load
    const attemptAutoplay = () => {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          userInteractedRef.current = true;
        })
        .catch(() => {
          // If browser blocks un-interacted autoplay, start on first scroll/click/touch
          const handleFirstInteraction = () => {
            if (!userInteractedRef.current && audioRef.current) {
              audioRef.current
                .play()
                .then(() => {
                  setIsPlaying(true);
                  userInteractedRef.current = true;
                })
                .catch(() => {});
            }
            window.removeEventListener("click", handleFirstInteraction);
            window.removeEventListener("scroll", handleFirstInteraction);
            window.removeEventListener("touchstart", handleFirstInteraction);
            window.removeEventListener("keydown", handleFirstInteraction);
          };

          window.addEventListener("click", handleFirstInteraction, { once: true, passive: true });
          window.addEventListener("scroll", handleFirstInteraction, { once: true, passive: true });
          window.addEventListener("touchstart", handleFirstInteraction, { once: true, passive: true });
          window.addEventListener("keydown", handleFirstInteraction, { once: true, passive: true });
        });
    };

    // Small delay to ensure UI hydrations complete before audio kicks in
    const timer = setTimeout(attemptAutoplay, 400);

    return () => {
      clearTimeout(timer);
      audio.pause();
      audio.src = "";
    };
  }, [pickNextRandomTrack]);

  // Update track src when track index changes (e.g. on random track change or manual click)
  useEffect(() => {
    if (audioRef.current && typeof window !== "undefined") {
      audioRef.current.src = currentTrack.src;
      audioRef.current.volume = volume;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
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
          userInteractedRef.current = true;
        })
        .catch((e) => {
          console.warn("Audio playback error:", e);
          setIsPlaying(false);
        });
    }
  };

  const handleNextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    pickNextRandomTrack();
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
          className="hidden sm:flex flex-col cursor-pointer max-w-[150px] truncate px-1 text-left select-none"
        >
          <div className="flex items-center gap-1.5 font-bold text-white truncate text-[11px]">
            <Disc className={`h-3 w-3 flex-shrink-0 text-amber-400 ${isPlaying ? "animate-spin" : ""}`} />
            <span className="truncate">{currentTrack.title}</span>
          </div>
          <span className="text-[9px] text-zinc-400 truncate">
            {currentTrack.subtitle}
          </span>
        </div>

        {/* Random Next Track Button */}
        <button
          onClick={handleNextTrack}
          className="hidden sm:flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 hover:text-amber-300 hover:bg-white/5 transition-colors"
          title="Random Next Track"
        >
          <SkipForward className="h-3.5 w-3.5" />
        </button>

        {/* Sound Waves Animation when active */}
        {isPlaying && (
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-end gap-0.5 h-3.5 px-1 cursor-pointer"
            title="Open Matchday Jukebox"
          >
            <span className="w-0.5 bg-amber-400 rounded-full animate-pulse h-2" />
            <span className="w-0.5 bg-amber-400 rounded-full animate-pulse h-3.5" />
            <span className="w-0.5 bg-amber-400 rounded-full animate-pulse h-1.5" />
          </div>
        )}
      </div>

      {/* Expanded Playlist & Volume Modal */}
      {isExpanded && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-white/15 bg-zinc-950/98 p-4 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-white">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-400">
              <Music className="h-4 w-4" />
              <span>MATCHDAY JUKEBOX</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={pickNextRandomTrack}
                className="flex items-center gap-1 text-[10px] font-mono text-amber-400 hover:text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30"
                title="Shuffle Random Track"
              >
                <Shuffle className="h-2.5 w-2.5" />
                <span>SHUFFLE</span>
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-zinc-400 hover:text-white text-xs font-mono p-1"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Volume Slider */}
          <div className="space-y-1 mb-3 bg-zinc-900/60 p-2.5 rounded-xl border border-white/5">
            <div className="flex justify-between font-mono text-[10px] text-zinc-400">
              <span>SOUNDTRACK VOLUME</span>
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
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {MATCHDAY_PLAYLIST.map((track, idx) => {
              const isCurrent = idx === currentTrackIndex;
              return (
                <div
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(idx);
                    if (audioRef.current) {
                      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
                    }
                  }}
                  className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                    isCurrent
                      ? "bg-amber-400/15 border border-amber-400/40 text-amber-300 shadow-sm"
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
