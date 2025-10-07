"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface SoundContextType {
  muted: boolean;
  toggleMute: () => void;
  setMuted: (value: boolean) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("palette_muted") === "true";
    setMutedState(saved);
  }, []);

  const setMuted = (value: boolean) => {
    setMutedState(value);
    if (typeof window !== "undefined")
      localStorage.setItem("palette_muted", String(value));
  };

  const toggleMute = () => setMuted(!muted);

  return (
    <SoundContext.Provider value={{ muted, toggleMute, setMuted }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = (): SoundContextType => {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within a SoundProvider");
  return ctx;
};
