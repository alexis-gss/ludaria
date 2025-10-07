"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import FuzzyText from "@/components/ui/fuzzy-text";
import Magnet from "@/components/ui/magnet";

export default function NotFound() {
  return (
    <div className="max-w-7xl min-h-screen flex flex-col items-center justify-center text-center mx-auto">
      <Magnet padding={85} magnetStrength={50}>
        <FuzzyText baseIntensity={0.08}>404</FuzzyText>
        <p className="mt-2">
          Oops ! The page you are looking for cannot be found.
        </p>
        <Button
          className="cursor-pointer text-white font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-85 mt-5"
          type="button"
          asChild
        >
          <Link href="/">Retour à l’accueil</Link>
        </Button>
      </Magnet>
    </div>
  );
}
