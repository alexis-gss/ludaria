"use client";
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { BADGE_CONFIG, Badges, type BadgeId } from "@/lib/badges";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function FlipBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const controls = useAnimation();

  const handleMouseEnter = () => {
    controls.start({
      rotateY: 180,
      transition: { duration: 0.4, ease: "easeInOut" },
    });
  };

  const handleMouseLeave = () => {
    controls.start({
      rotateY: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    });
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ width: 60, height: 60, perspective: 600 }}
    >
      <motion.div
        animate={controls}
        className={className}
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function UserBadges() {
  const [unlocked, setUnlocked] = useState<BadgeId[]>([]);

  useEffect(() => {
    fetch("/api/badges")
      .then((r) => r.json())
      .then(setUnlocked);
  }, []);

  return (
    <section className="w-full md:w-2/3 mb-12">
      <p className="text-center text-sm text-gray-400 mb-2">
        Your achievements:
      </p>
      <div className="flex flex-row justify-center items-center gap-4">
        {(
          Object.entries(BADGE_CONFIG) as [
            BadgeId,
            (typeof BADGE_CONFIG)[BadgeId],
          ][]
        ).map(([id, { index, title, description }]) => {
          const isUnlocked = unlocked.includes(id);
          return (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <div className="relative">
                  <FlipBadge className={isUnlocked ? "" : "grayscale"}>
                    {Badges[index]}
                  </FlipBadge>
                  {!isUnlocked && (
                    <Lock className="absolute bottom-0 right-0 w-4 h-4 text-gray-400 z-10" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent className="text-center">
                <p className="font-bold">{title}</p>
                <p className="text-xs text-gray-400">{description}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </section>
  );
}
