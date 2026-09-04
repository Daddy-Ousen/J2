"use client";

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";

export interface Track {
  id: string;
  title: string;
  subtitle: string;
  src: string;
}

export const MATCHDAY_PLAYLIST: Track[] = [
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

interface AudioContextType {
  isPlaying: boolean;
  currentTrackIndex: number;
  currentTrack: Track;
  volume: number;
  isExpanded: boolean;
  waitingMobileInteraction: boolean;
  playlist: Track[];
  togglePlay: () => void;
  unlockAndPlay: () => void;
  pickNextRandomTrack: () => void;
  selectTrack: (index: number) => void;
  setVolume: (volume: number) => void;
  setIsExpanded: (expanded: boolean) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolumeState] = useState(0.55);
  const [isExpanded, setIsExpanded] = useState(false);
  const [waitingMobileInteraction, setWaitingMobileInteraction] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlockedRef = useRef(false);

  const currentTrack = MATCHDAY_PLAYLIST[currentTrackIndex];

  const pickNextRandomTrack = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => {
      const candidates = MATCHDAY_PLAYLIST.map((_, idx) => idx).filter((idx) => idx !== prevIndex);
      if (candidates.length === 0) return 0;
      return candidates[Math.floor(Math.random() * candidates.length)];
    });
  }, []);

  const selectTrack = useCallback((index: number) => {
    setCurrentTrackIndex(index);
    if (audioRef.current) {
      audioRef.current.src = MATCHDAY_PLAYLIST[index].src;
      audioRef.current.volume = volume;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [volume]);

  const setVolume = useCallback((newVol: number) => {
    setVolumeState(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          unlockedRef.current = true;
          setWaitingMobileInteraction(false);
        })
        .catch((err) => {
          console.warn("Audio playback error:", err);
          setIsPlaying(false);
        });
    }
  }, [isPlaying]);

  const unlockAndPlay = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          unlockedRef.current = true;
          setWaitingMobileInteraction(false);
        })
        .catch((err) => {
          console.warn("User triggered audio play error:", err);
        });
    }
  }, [volume]);

  // Initialize audio element once on root layout mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio();
      audio.preload = "auto";
      audio.setAttribute("playsinline", "true");
      audio.setAttribute("webkit-playsinline", "true");
      audioRef.current = audio;
    }

    audio.src = MATCHDAY_PLAYLIST[0].src;
    audio.volume = volume;

    audio.onended = () => {
      pickNextRandomTrack();
    };

    audio.onplay = () => {
      setIsPlaying(true);
      setWaitingMobileInteraction(false);
      unlockedRef.current = true;
    };

    audio.onpause = () => {
      setIsPlaying(false);
    };

    const attemptAutoplay = () => {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            unlockedRef.current = true;
            setWaitingMobileInteraction(false);
          })
          .catch(() => {
            setWaitingMobileInteraction(true);

            const unlockAudioOnGesture = () => {
              if (!unlockedRef.current && audioRef.current) {
                audioRef.current
                  .play()
                  .then(() => {
                    setIsPlaying(true);
                    unlockedRef.current = true;
                    setWaitingMobileInteraction(false);
                  })
                  .catch(() => {});
              }

              ["touchstart", "touchend", "pointerdown", "mousedown", "click"].forEach((evt) => {
                window.removeEventListener(evt, unlockAudioOnGesture, true);
                document.removeEventListener(evt, unlockAudioOnGesture, true);
              });
            };

            ["touchstart", "touchend", "pointerdown", "mousedown", "click"].forEach((evt) => {
              window.addEventListener(evt, unlockAudioOnGesture, { capture: true, passive: true });
              document.addEventListener(evt, unlockAudioOnGesture, { capture: true, passive: true });
            });
          });
      }
    };

    const timer = setTimeout(attemptAutoplay, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [pickNextRandomTrack]);

  // When track index changes (e.g. random next), change source seamlessly
  useEffect(() => {
    if (audioRef.current && typeof window !== "undefined") {
      const targetSrc = currentTrack.src;
      // Only reassign if different
      if (!audioRef.current.src.endsWith(encodeURI(targetSrc)) && audioRef.current.src !== window.location.origin + targetSrc) {
        audioRef.current.src = targetSrc;
        audioRef.current.volume = volume;
        if (unlockedRef.current || isPlaying) {
          audioRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => {});
        }
      }
    }
  }, [currentTrackIndex, currentTrack.src, volume, isPlaying]);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        currentTrackIndex,
        currentTrack,
        volume,
        isExpanded,
        waitingMobileInteraction,
        playlist: MATCHDAY_PLAYLIST,
        togglePlay,
        unlockAndPlay,
        pickNextRandomTrack,
        selectTrack,
        setVolume,
        setIsExpanded,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
