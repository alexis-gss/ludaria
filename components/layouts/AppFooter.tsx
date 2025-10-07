"use client";

import {
  SiFramer,
  SiNextdotjs,
  SiPrisma,
  SiReact,
  SiSass,
  SiShadcnui,
  SiTailwindcss,
  SiTypescript,
} from "@icons-pack/react-simple-icons";
import { FileTextIcon, GithubIcon, HeartIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import LogoLoop from "@/components/ui/logo-loop";

const AppFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const logoSize = 20;
  const techLogos = [
    {
      node: <SiNextdotjs size={logoSize} />,
      title: "Next.js",
      href: "https://nextjs.org",
    },
    {
      node: <SiReact size={logoSize} />,
      title: "React",
      href: "https://react.dev",
    },
    {
      node: <SiPrisma size={logoSize} />,
      title: "Prisma",
      href: "https://www.prisma.io/",
    },
    {
      node: <SiTypescript size={logoSize} />,
      title: "TypeScript",
      href: "https://www.typescriptlang.org",
    },
    {
      node: <SiSass size={logoSize} />,
      title: "Sass",
      href: "https://sass-lang.com/",
    },
    {
      node: <SiTailwindcss size={logoSize} />,
      title: "Tailwind CSS",
      href: "https://tailwindcss.com",
    },
    {
      node: <SiShadcnui size={logoSize} />,
      title: "Shadcn/ui",
      href: "https://ui.shadcn.com",
    },
    {
      node: <SiFramer size={logoSize} />,
      title: "Framer Motion",
      href: "https://motion.dev",
    },
  ];
  return (
    <footer className="bg-white/70 dark:bg-black/50 border-b border-white/10 transition-colors shadow-lg-up">
      <div className="max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto py-12">
        <div>
          <h3 className="font-bold text-lg">Ludaria</h3>
          <p className="mt-2 text-sm opacity-80">
            Play, progress, and save your levels. 3 difficulties × 50 levels —
            more than 150 challenges.
          </p>
          <p className="flex justify-start items-center text-sm opacity-80 mt-2">
            Made with <HeartIcon size={12} className="mx-1" /> and:
          </p>
          <LogoLoop
            className="opacity-80 py-1"
            logos={techLogos}
            speed={20}
            direction="left"
            logoHeight={logoSize}
            gap={30}
            pauseOnHover
            fadeOut
            ariaLabel="Technology used"
          />
          <p className="text-xs opacity-60 mt-3">
            © {currentYear} Ludaria — All rights reserved
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Links</h4>
          <ul className="mt-3 text-sm opacity-85 space-y-2">
            <li>
              <Link
                href="/"
                className="text-purple-500 hover:underline hover:underline-offset-3 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="text-purple-500 hover:underline hover:underline-offset-3 transition-colors"
              >
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">About</h4>
          <p className="mt-3 text-sm opacity-85">
            Account-linked save — persistent progress and retro-compatible
            levels. 3×50 levels for each puzzles.
          </p>
          <div className="mt-4 flex gap-2">
            <Button
              className="cursor-pointer font-semibold"
              variant="secondary"
              type="button"
              asChild
            >
              <a
                href="https://doc-ludaria.alexis-gousseau.com"
                className="flex justify-center items-center gap-1"
                target="_blank"
                rel="noreferrer"
              >
                <FileTextIcon size={16} />
                Docs
              </a>
            </Button>
            <Button
              className="cursor-pointer font-semibold"
              variant="secondary"
              type="button"
              asChild
            >
              <a
                href="https://github.com/alexis-gss/ludaria"
                className="flex justify-center items-center gap-1"
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon size={16} /> Github
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default AppFooter;
