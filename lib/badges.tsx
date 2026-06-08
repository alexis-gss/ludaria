
import type { Progressions } from "@prisma/client";
import type { ReactNode } from "react";

import { easyLevels as energy_matrix_easy } from "@/lib/energy-matrix/levels/easy";
import { hardLevels as energy_matrix_hard } from "@/lib/energy-matrix/levels/hard";
import { mediumLevels as energy_matrix_medium } from "@/lib/energy-matrix/levels/medium";
import { easyLevels as overflowing_palette_easy } from "@/lib/overflowing-palette/levels/easy";
import { hardLevels as overflowing_palette_hard } from "@/lib/overflowing-palette/levels/hard";
import { mediumLevels as overflowing_palette_medium } from "@/lib/overflowing-palette/levels/medium";
import { easyLevels as signals_console_easy } from "@/lib/signals-console/levels/easy";
import { hardLevels as signals_console_hard } from "@/lib/signals-console/levels/hard";
import { mediumLevels as signals_console_medium } from "@/lib/signals-console/levels/medium";
import { DIFFICULTIES, GAMES } from "@/lib/utils";

export const BADGE_CONFIG = {
  first_steps: {
    index: 0,
    title: "First Steps",
    description: "Complete at least one level",
  },
  easy: {
    index: 1,
    title: "Easy",
    description: "Complete all easy levels of a game",
  },
  medium: {
    index: 2,
    title: "Medium",
    description: "Complete all medium levels of a game",
  },
  hard: {
    index: 3,
    title: "Hard",
    description: "Complete all hard levels of a game",
  },
  overflowing_palette: {
    index: 4,
    title: "Overflowing Palette",
    description: "Complete all levels of the Overflowing Palette game",
  },
  energy_matrix: {
    index: 5,
    title: "Energy Matrix",
    description: "Complete all levels of the Energy Matrix game",
  },
  signals_console: {
    index: 6,
    title: "Signals Console",
    description: "Complete all levels of the Signals Console game",
  },
  perfectionist: {
    index: 7,
    title: "Perfectionist",
    description: "Complete absolutely all games",
  },
} as const;

export type BadgeId = keyof typeof BADGE_CONFIG;

const LEVEL_COUNTS: Record<string, number> = {
  signals_console_easy: signals_console_easy.length,
  signals_console_medium: signals_console_medium.length,
  signals_console_hard: signals_console_hard.length,
  overflowing_palette_easy: overflowing_palette_easy.length,
  overflowing_palette_medium: overflowing_palette_medium.length,
  overflowing_palette_hard: overflowing_palette_hard.length,
  energy_matrix_easy: energy_matrix_easy.length,
  energy_matrix_medium: energy_matrix_medium.length,
  energy_matrix_hard: energy_matrix_hard.length,
};

const ALL_GAME_SLUGS = GAMES.map((g) => g.type);

function isComplete(
  progressions: Progressions[],
  type: string,
  difficulty: string,
): boolean {
  const max = LEVEL_COUNTS[`${type}_${difficulty}`];
  const prog = progressions.find(
    (p) => p.type === type && p.difficulty === difficulty,
  );
  return prog !== undefined && prog.level >= max;
}

export function computeBadges(progressions: Progressions[]): BadgeId[] {
  const badges: BadgeId[] = [];

  const allComplete = (type: string) =>
    DIFFICULTIES.every((d) => isComplete(progressions, type, d));

  const anyComplete = (difficulty: string) =>
    ALL_GAME_SLUGS.some((t) => isComplete(progressions, t, difficulty));

  // Per-game badge: all difficulties cleared
  for (const type of ALL_GAME_SLUGS) {
    if (allComplete(type)) badges.push(type as BadgeId);
  }

  // Per-difficulty badge: at least one game cleared at that difficulty
  for (const difficulty of DIFFICULTIES) {
    if (anyComplete(difficulty)) badges.push(difficulty as BadgeId);
  }

  // Perfectionist: everything cleared
  if (ALL_GAME_SLUGS.every(allComplete)) badges.push("perfectionist");

  // First steps: at least one level progressed
  if (progressions.some((p) => p.level > 0)) badges.push("first_steps");

  return badges;
}

const SVG_PROPS = {
  width: 60,
  height: 60,
  viewBox: "0 0 120 120",
  xmlns: "http://www.w3.org/2000/svg",
  role: "img" as const,
};

/** Shared hexagonal shell rendered inside every badge. */
function BadgeShell() {
  return (
    <>
      <polygon
        points="60,4 112,32 112,88 60,116 8,88 8,32"
        fill="#1a0533"
        stroke="oklch(60.6% 0.25 292.717)"
        strokeWidth="2"
      />
      <polygon
        points="60,14 102,37 102,83 60,106 18,83 18,37"
        fill="none"
        stroke="oklch(58.5% 0.233 277.117)"
        strokeWidth="2"
      />
    </>
  );
}

/** Renders 1–3 lightning bolts for difficulty badges. */
function DifficultyBolts({
  count,
  color,
  stroke,
}: {
  count: 1 | 2 | 3;
  color: string;
  stroke: string;
}) {
  const offsets = [
    [0],
    [-11, 11],
    [-22, 0, 22],
  ][count - 1];

  return (
    <>
      {offsets.map((dx, i) => (
        <polygon
          key={i}
          points={`${60 + dx},38 ${50 + dx},62 ${57 + dx},62 ${52 + dx},82 ${68 + dx},55 ${60 + dx},55`}
          fill={color}
          stroke={stroke}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      ))}
    </>
  );
}

export const BADGE_ELEMENTS: Record<BadgeId, ReactNode> = {
  first_steps: (
    <svg {...SVG_PROPS} aria-hidden="true">
      <defs>
        <title>{BADGE_CONFIG.first_steps.title}</title>
        <desc>{BADGE_CONFIG.first_steps.description}</desc>
      </defs>
      <BadgeShell />
      <polygon
        points="60,36 65.1,51.4 81.4,51.4 68.4,60.9 73.5,76.3 60,66.8 46.5,76.3 51.6,60.9 38.6,51.4 54.9,51.4"
        fill="#eab308"
        stroke="#eab308"
        strokeWidth="4"
      />
    </svg>
  ),
  easy: (
    <svg {...SVG_PROPS} aria-hidden="true">
      <defs>
        <title>{BADGE_CONFIG.easy.title}</title>
        <desc>{BADGE_CONFIG.easy.description}</desc>
      </defs>
      <BadgeShell />
      <DifficultyBolts count={1} color="#22c55e" stroke="#16a34a" />
    </svg>
  ),
  medium: (
    <svg {...SVG_PROPS} aria-hidden="true">
      <defs>
        <title>{BADGE_CONFIG.medium.title}</title>
        <desc>{BADGE_CONFIG.medium.description}</desc>
      </defs>
      <BadgeShell />
      <DifficultyBolts count={2} color="#f97316" stroke="#ea580c" />
    </svg>
  ),
  hard: (
    <svg {...SVG_PROPS} aria-hidden="true">
      <defs>
        <title>{BADGE_CONFIG.hard.title}</title>
        <desc>{BADGE_CONFIG.hard.description}</desc>
      </defs>
      <BadgeShell />
      <DifficultyBolts count={3} color="#ef4444" stroke="#dc2626" />
    </svg>
  ),
  overflowing_palette: (
    <svg {...SVG_PROPS} aria-hidden="true">
      <defs>
        <title>{BADGE_CONFIG.overflowing_palette.title}</title>
        <desc>{BADGE_CONFIG.overflowing_palette.description}</desc>
      </defs>
      <BadgeShell />
      <ellipse cx="60" cy="62" rx="28" ry="22" fill="white" />
      <ellipse cx="72" cy="46" rx="10" ry="8" fill="white" />
      <circle cx="42" cy="58" r="6" fill="#ef4444" />
      <circle cx="58" cy="49" r="6" fill="#eab308" />
      <circle cx="76" cy="59" r="6" fill="#22c55e" />
      <circle cx="68" cy="74" r="6" fill="#3b82f6" />
      <circle cx="50" cy="73" r="6" fill="#a855f7" />
      <ellipse cx="73" cy="45" rx="5" ry="4" fill="#1a0533" />
    </svg>
  ),
  energy_matrix: (
    <svg {...SVG_PROPS} aria-hidden="true">
      <defs>
        <title>{BADGE_CONFIG.energy_matrix.title}</title>
        <desc>{BADGE_CONFIG.energy_matrix.description}</desc>
      </defs>
      <BadgeShell />
      <rect x="35" y="35" width="14" height="32" rx="2" fill="#ec4899" />
      <rect x="53" y="35" width="32" height="14" rx="2" fill="#a855f7" />
      <rect x="53" y="35" width="14" height="32" rx="2" fill="#a855f7" />
      <rect x="71" y="53" width="14" height="14" rx="2" fill="#22c55e" />
      <rect x="53" y="71" width="32" height="14" rx="2" fill="#6366f1" />
      <rect x="35" y="71" width="14" height="14" rx="2" fill="#22c55e" />
    </svg>
  ),
  signals_console: (
    <svg {...SVG_PROPS} aria-hidden="true">
      <defs>
        <title>{BADGE_CONFIG.signals_console.title}</title>
        <desc>{BADGE_CONFIG.signals_console.description}</desc>
      </defs>
      <BadgeShell />
      <path
        d="M40,40 L80,40"
        fill="none"
        stroke="#ef4444"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M60,60 L60,80 L80,80 L80,60"
        fill="none"
        stroke="#22c55e"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M40,60 L40,80"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="40" cy="40" r="5" fill="#ef4444" />
      <circle cx="80" cy="40" r="5" fill="#ef4444" />
      <circle cx="60" cy="60" r="5" fill="#22c55e" />
      <circle cx="80" cy="60" r="5" fill="#22c55e" />
      <circle cx="40" cy="60" r="5" fill="#3b82f6" />
      <circle cx="40" cy="80" r="5" fill="#3b82f6" />
    </svg>
  ),
  perfectionist: (
    <svg {...SVG_PROPS} aria-hidden="true">
      <title>{BADGE_CONFIG.perfectionist.title}</title>
      <desc>{BADGE_CONFIG.perfectionist.description}</desc>
      <BadgeShell />
      <path
        d="M44,38 L76,38 L72,62 Q60,70 48,62 Z"
        fill="#eab308"
        stroke="#ca8a04"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M44,42 Q36,42 36,52 Q36,62 44,62"
        fill="none"
        stroke="#eab308"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M76,42 Q84,42 84,52 Q84,62 76,62"
        fill="none"
        stroke="#eab308"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect
        x="56"
        y="68"
        width="8"
        height="10"
        rx="1"
        fill="#eab308"
        stroke="#ca8a04"
        strokeWidth="1"
      />
      <rect
        x="50"
        y="77"
        width="20"
        height="4"
        rx="2"
        fill="#eab308"
        stroke="#ca8a04"
        strokeWidth="1"
      />
    </svg>
  ),
};

/**
 * Ordered array for use cases that need index-based access.
 * Order matches BADGE_CONFIG[id].index.
 */
export const Badges = Object.values(BADGE_CONFIG)
  .sort((a, b) => a.index - b.index)
  .map(({ title }) => {
    const id = Object.keys(BADGE_CONFIG).find(
      (k) => BADGE_CONFIG[k as BadgeId].title === title,
    ) as BadgeId;
    return BADGE_ELEMENTS[id];
  });
