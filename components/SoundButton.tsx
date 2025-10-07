"use client";

import { Volume2Icon, VolumeOffIcon } from "lucide-react";

import { useSound } from "@/components/SoundProvider";
import { Button } from "@/components/ui/button";

export default function SoundButton() {
  const { muted, toggleMute } = useSound();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="cursor-pointer"
      onClick={toggleMute}
    >
      {muted ? <VolumeOffIcon /> : <Volume2Icon />}
    </Button>
  );
}
