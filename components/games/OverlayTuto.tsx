import { useLayoutEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

type OverlayProps = {
  width: string;
  height: string;
  top: string;
  left?: string;
  borderRadius?: number;
  overlayColor?: string;
  content: string;
  steps: number;
  maxSteps: number;
  onClick: () => void;
};

export default function OverlayTuto({
  width,
  height,
  top,
  left = "0rem",
  borderRadius = 12,
  overlayColor = "rgba(0,0,0,0.7)",
  content,
  steps,
  maxSteps,
  onClick,
}: OverlayProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState(0);
  // SVG dynamique avec trou centré + décalé par top/left
  const svg = encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
      <mask id='mask'>
        <!-- Tout visible par défaut -->
        <rect width='100%' height='100%' fill='white' />
        <!-- Trou au centre + offset -->
        <rect
          x='calc(50% - ${width}/2 + ${left})'
          y='calc(50% - ${height}/2 + ${top})'
          width='${width}'
          height='${height}'
          rx='${borderRadius}'
          ry='${borderRadius}'
          fill='black'
        />
      </mask>
      <!-- Fond noir masqué au centre -->
      <rect width='100%' height='100%' fill='black' mask='url(#mask)' />
    </svg>
  `);

  useLayoutEffect(() => {
    if (cardRef.current) {
      const height = cardRef.current.offsetHeight;
      setCardHeight(height);
    }
  }, [content]);

  return (
    <div
      className="absolute inset-0"
      style={{
        background: overlayColor,
        zIndex: 10,
        WebkitMaskImage: `url("data:image/svg+xml;utf8,${svg}")`,
        maskImage: `url("data:image/svg+xml;utf8,${svg}")`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
      }}
    >
      <div
        className="relative absolute -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center text-center max-w-sm border-0 gap-4"
        style={{
          top: `calc(50% + ${top} - ${height}/2 - ${cardHeight}px/2 - 0.5rem)`,
          left: `calc(50% + ${left})`,
        }}
      >
        <div className="absolute inset-0 bg-card w-full h-full animate-ping-soft rounded-xl" />
        <Card
          ref={cardRef}
          className="flex flex-col justify-center items-center text-center max-w-sm border-0 gap-4 p-4 z-10"
        >
          <CardTitle>
            Tuto n°{steps}
            <span className="text-muted-foreground">/{maxSteps}</span>
          </CardTitle>
          <CardContent
            className="p-0"
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />
          <CardFooter className="p-0">
            <Button
              className="cursor-pointer text-white font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-85"
              type="button"
              onClick={onClick}
            >
              {steps === maxSteps ? "All right, let's go!" : "Next"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
