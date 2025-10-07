"use client";

import { motion } from "framer-motion";
import { BoxesIcon, MoveDownIcon, SaveIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import CardSwap from "@/components/ui/card-swap";
import ColorBends from "@/components/ui/color-bends";
import Magnet from "@/components/ui/magnet";
import { useUser } from "@/components/UserProvider";
import { GAMES } from "@/lib/utils";

function GetButtons() {
  const { user } = useUser();
  return user ? (
    <>
      <Button
        className="cursor-pointer text-white font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-85"
        type="button"
        asChild
      >
        <Link href="/dashboard">Votre dashboard</Link>
      </Button>
      <Button
        className="cursor-pointer font-semibold"
        variant="secondary"
        type="button"
        aria-label="Your account"
        asChild
      >
        <Link href="/profile">Votre profil</Link>
      </Button>
    </>
  ) : (
    <>
      <Button
        className="cursor-pointer text-white font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-85"
        type="button"
        asChild
      >
        <Link href="/register">Create an account — it’s free !</Link>
      </Button>
      <Button
        className="cursor-pointer font-semibold"
        variant="secondary"
        type="button"
        aria-label="Play now"
        asChild
      >
        <Link href="/login">Play now</Link>
      </Button>
    </>
  );
}

export default function Page() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const delayCardSwapAnimation = 20000;
  const infos = [
    {
      title: "450 unique levels",
      description: "by difficulty and by puzzle",
    },
    {
      title: "Save to database",
      description: "Progress linked to your account",
    },
  ];
  const features = [
    {
      title: "Difficulty levels",
      icon: BoxesIcon,
      description:
        "Three difficulty levels for each puzzle — perfect for beginners, intermediate, and experts.",
    },
    {
      title: "Progress saved",
      icon: SaveIcon,
      description:
        "Each completed level is linked to your account — no matter your device, continue where you left off.",
    },
  ];

  useEffect(() => {
    let frame: number;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const pct = Math.min((elapsed / delayCardSwapAnimation) * 100, 100);
      setProgress(pct);

      if (elapsed < delayCardSwapAnimation) {
        frame = requestAnimationFrame(animate);
      }
    };

    const start = () => {
      cancelAnimationFrame(frame);
      setProgress(0);
      startTime = null;
      frame = requestAnimationFrame(animate);
    };

    start();
    const cleanup = () => cancelAnimationFrame(frame);
    return cleanup;
  }, [activeIndex]);

  return (
    <>
      {/* HOME */}
      <section className="relative overflow-hidden py-18">
        <div className="absolute top-0 start-0 w-full h-full z-0">
          <ColorBends
            colors={["#f6339a", "#ad46ff", "#615fff"]}
            rotation={0}
            autoRotate={0}
            speed={0.2}
            scale={1}
            frequency={1}
            warpStrength={1}
            mouseInfluence={0}
            parallax={0}
            noise={0.1}
            transparent
          />
        </div>
        <Magnet padding={85} magnetStrength={50} wrapperClassName="w-full">
          <div className="relative max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mx-auto py-18 lg:py-50 px-6 z-10">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight"
            >
              Ludaria —{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                colorful puzzles
              </span>{" "}
              Play, progress, color.
            </motion.h2>
            <motion.p
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="max-w-xl text-lg font-semibold opacity-90 mt-6"
            >
              Become a master of colors: unlock, progress, and hone your
              problem-solving skills through hundreds of brand-new puzzles.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.8 }}
              className="flex flex-col md:flex-row items-center gap-3 mt-8"
            >
              <GetButtons />
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-center md:text-start mt-8">
              {infos.map((info, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-white dark:bg-black/30 shadow p-3"
                >
                  <strong>{info.title}</strong>
                  <div className="text-xs opacity-80">{info.description}</div>
                </div>
              ))}
            </div>
          </div>
        </Magnet>
        <div className="flex justify-center items-center">
          <Button
            className="cursor-pointer rounded-full animate-bounce w-12 h-12"
            type="button"
            size="icon"
            variant="ghost"
            asChild
          >
            <Link href="#games">
              <MoveDownIcon className="!w-8 !h-8" />
            </Link>
          </Button>
        </div>
      </section>
      {/* GAMES DETAILS */}
      <section
        id="games"
        className="relative bg-white/70 dark:bg-black/50 transition-colors shadow-lg scroll-mt-18"
      >
        <div className="relative shadow-lg-up overflow-hidden py-24 z-10">
          <div className="max-w-7xl grid grid-cols-1 md:grid-cols-2 mx-auto px-6 gap-12">
            {/* Left column: active carte */}
            <div className="flex flex-col justify-center space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold text-center md:text-left">
                Our puzzles
              </h3>
              {GAMES[activeIndex] ? (
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col items-center md:items-start gap-4 text-gray-800 dark:text-gray-200"
                >
                  {(() => {
                    const Icon = GAMES[activeIndex].icon;
                    return (
                      <div className="flex items-center gap-2">
                        <Icon size={20} className="text-purple-500 mt-1" />
                        <p className="font-semibold text-xl">
                          {GAMES[activeIndex].title}
                          <span className="text-muted-foreground ms-1">
                            #{activeIndex + 1}
                          </span>
                        </p>
                      </div>
                    );
                  })()}
                  <p
                    className="text-center md:text-start"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                      __html: GAMES[activeIndex].description,
                    }}
                  />
                  <Button
                    className="cursor-pointer font-semibold"
                    type="button"
                    variant="secondary"
                    asChild
                  >
                    <Link href={`/games/${GAMES[activeIndex].slug}`}>Play</Link>
                  </Button>
                </motion.div>
              ) : null}
            </div>
            {/* Right column: CardSwap */}
            <div className="relative w-full aspect-video mt-12 md:mt-8">
              <CardSwap
                width="100%"
                height="100%"
                cardDistance={90}
                verticalDistance={20}
                skewAmount={6}
                delay={delayCardSwapAnimation}
                onCardChange={(idx) => setActiveIndex(idx)}
                onCycleStart={() => setProgress(0)}
              >
                {GAMES.map((card, i) => (
                  <Card
                    key={i}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-0 overflow-hidden p-0"
                  >
                    <CardTitle className="flex justify-between items-center border-b gap-1 px-2 pt-1 pb-2">
                      <div className="flex justify-start items-center gap-2">
                        <card.icon size={18} className="text-purple-500 pt-1" />
                        {card.title}
                      </div>
                      <span className="text-muted-foreground ms-1">
                        #{i + 1}
                      </span>
                    </CardTitle>
                    <CardContent className="relative aspect-video overflow-hidden p-0">
                      <Image
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        src={`/images/${card.slug}.jpg`}
                        alt={`Image du jeu ${card.slug}`}
                        width={1920}
                        height={1080}
                      />
                    </CardContent>
                  </Card>
                ))}
              </CardSwap>
            </div>
          </div>
        </div>
        <motion.div
          className="absolute bottom-0 left-0 bg-purple-500/10 h-full"
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0 }}
        />
      </section>
      {/* FEATURES */}
      <section
        id="features"
        className="bg-gradient-to-b from-white/0 to-white/0 dark:from-black/0 scroll-mt-18 pt-18"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="rounded-lg bg-white dark:bg-black/30 shadow p-3"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h5 className="flex items-center gap-2 font-bold">
                <feature.icon size={20} />
                {feature.title}
              </h5>
              <p className="text-sm mt-2 opacity-80">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
      {/* BANNER */}
      <section className="max-w-7xl mx-auto px-6 py-18 relative overflow-hidden scroll-mt-18">
        <Magnet padding={75} magnetStrength={50} wrapperClassName="w-full">
          <div className="bg-white dark:bg-black/30 rounded-3xl p-12 relative shadow-lg overflow-hidden">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 text-center z-10"
            >
              <h4 className="text-4xl font-extrabold tracking-tight">
                Ready to take on the challenge?
              </h4>
              <p className="mt-4 text-lg opacity-90 max-w-3xl mx-auto">
                Master over{" "}
                <span className="text-purple-500 italic font-semibold">
                  450 progressive puzzles
                </span>{" "}
                across 3 colorful and animated mini-games. Your progress is
                saved online to your account — play, progres, color.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                {GetButtons()}
              </div>
            </motion.div>
          </div>
        </Magnet>
      </section>
    </>
  );
}
