"use client";

import React from "react";
import { Volume2, SkipForward, Play, Pause, Music, Disc, Shuffle } from "lucide-react";
import { useAudio } from "@/context/AudioContext";

export function AudioToggle() {
  const {
    isPlaying,
    currentTrackIndex,
    currentTrack,
    volume,
    isExpanded,
    waitingMobileInteraction,
    playlist,
    togglePlay,
    pickNextRandomTrack,
    selectTrack,
    setVolume,
    setIsExpanded,
  } = useAudio();

  const handleNextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    pickNextRandomTrack();
  };

  return (
    <div className="relative flex items-center">
      {/* Mobile Autoplay Unlock Helper Pill (Appears if mobile browser holds audio before first tap) */}
      {waitingMobileInteraction && !isPlaying && (
        <button
          onClick={togglePlay}
          className="sm:hidden absolute -bottom-8 right-0 whitespace-nowrap flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-[9px] font-mono font-bold text-black shadow-lg animate-bounce z-50 border border-amber-300"
        >
          <Volume2 className="h-3 w-3" />
          <span>TAP TO PLAY ANTHEM</span>
        </button>
      )}

      {/* Main Player Pill */}
      <div className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-zinc-950/90 p-1 sm:px-2.5 sm:py-1 text-[11px] font-mono backdrop-blur-md shadow-md">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform active:scale-95 shadow-[0_0_10px_rgba(245,158,11,0.4)] ${
            waitingMobileInteraction && !isPlaying
              ? "bg-amber-400 text-black animate-pulse"
              : "bg-amber-400 text-black hover:bg-amber-300"
          }`}
          title={isPlaying ? "Pause Matchday Soundtrack" : "Play Football Soundtrack"}
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
        >
          {isPlaying ? (
            <Pause className="h-3.5 w-3.5 fill-black stroke-black" />
          ) : (
            <Play className="h-3.5 w-3.5 fill-black stroke-black ml-0.5" />
          )}
        </button>

        {/* Track Title Display (Visible on both mobile & desktop) */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex flex-col cursor-pointer max-w-[120px] xs:max-w-[150px] sm:max-w-[180px] truncate px-1.5 text-left select-none"
        >
          <div className="flex items-center gap-1.5 font-bold text-white truncate text-[10px] sm:text-[11px]">
            <Disc className={`h-3 w-3 flex-shrink-0 text-amber-400 ${isPlaying ? "animate-spin" : ""}`} />
            <span className="truncate">{currentTrack.title}</span>
          </div>
          <span className="text-[8px] sm:text-[9px] text-zinc-400 truncate">
            {currentTrack.subtitle}
          </span>
        </div>

        {/* Random Next Track Button */}
        <button
          onClick={handleNextTrack}
          className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 hover:text-amber-300 hover:bg-white/5 transition-colors active:scale-90"
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
        <div className="absolute left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 top-12 z-50 w-[92vw] max-w-xs sm:w-80 rounded-2xl border border-white/15 bg-zinc-950/98 p-4 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-white">
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
            {playlist.map((track, idx) => {
              const isCurrent = idx === currentTrackIndex;
              return (
                <div
                  key={track.id}
                  onClick={() => selectTrack(idx)}
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
