"use client";

import { motion } from "framer-motion";
import { MenuIcon, PencilLineIcon, UserIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { LogoutButton } from "@/components/LogoutButton";
import ThemeButton from "@/components/ThemeButton";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { useUser } from "@/components/UserProvider";
import { cn } from "@/lib/utils";

export default function AppNavigation() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuLinks = user
    ? [
      { href: "/", label: "Home" },
      { href: "/dashboard", label: "Dashboard" },
    ]
    : [];

  const GetLoginButton = () => {
    return (
      <Button
        className="cursor-pointer font-semibold"
        variant="secondary"
        type="button"
        aria-label="Player connection"
        asChild
      >
        <Link href="/login" className="flex justify-center items-center gap-1">
          <UserIcon size={16} /> Login
        </Link>
      </Button>
    );
  };

  const GetRegisterButton = () => {
    return (
      <Button
        className="cursor-pointer text-white font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-85"
        type="button"
        asChild
      >
        <Link
          className="flex justify-center items-center gap-1"
          href="/register"
        >
          <PencilLineIcon size={16} /> Register
        </Link>
      </Button>
    );
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        isOpen &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <header className="fixed top-0 backdrop-blur-md bg-white/70 dark:bg-black/50 border-b border-white/10 transition-colors shadow-lg w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 relative h-18">
        {/* Logo & Title */}
        <Link href="/" className="flex items-center gap-3">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 18,
              ease: "linear",
            }}
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-lg rounded-full w-10 h-10"
            aria-hidden
          />
          <div className="leading-tight">
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight">
              Ludaria
            </h1>
            <p className="text-[11px] sm:text-xs opacity-80 -mt-0.5">
              Play, progress, color.
            </p>
          </div>
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              {menuLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink
                    className="cursor-pointer font-semibold hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 focus:bg-transparent rounded-md px-4 py-2"
                    type="button"
                    aria-label="Player profile"
                    asChild
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        {/* Actions & Mobile */}
        <div className="flex items-center gap-3 relative">
          <div className="hidden md:flex gap-2">
            {user ? (
              <>
                <Button
                  className="cursor-pointer font-semibold"
                  variant="ghost"
                  type="button"
                  aria-label="Player profile"
                  asChild
                >
                  <Link
                    href="/profile"
                    className="flex justify-center items-center gap-1"
                  >
                    <UserIcon size={16} /> {user.pseudo}
                  </Link>
                </Button>
                <LogoutButton />
              </>
            ) : (
              <>
                <GetLoginButton />
                <GetRegisterButton />
              </>
            )}
            <ThemeButton />
          </div>
          {/* Bouton Menu Mobile */}
          <Button
            ref={buttonRef}
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer font-semibold md:hidden"
            variant="ghost"
            type="button"
            aria-label="Menu"
          >
            {isOpen ? <XIcon /> : <MenuIcon />}
          </Button>
          {/* Popup Menu mobile */}
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "absolute top-12 right-0 w-56 rounded-xl border border-white/10 shadow-xl",
                "bg-white/95 dark:bg-neutral-900/95 backdrop-blur-lg p-3 md:hidden",
              )}
            >
              <ul className="flex flex-col space-y-2 text-sm">
                {menuLinks.map((link) => (
                  <motion.li
                    key={link.href}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-md hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/10 transition"
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="flex flex-col gap-2">
                <ThemeButton />
                {user ? (
                  <>
                    <Button asChild>
                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="text-white font-semibold bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-all duration-300"
                      >
                        {user.pseudo}
                      </Link>
                    </Button>
                    <LogoutButton />
                  </>
                ) : (
                  <>
                    <GetLoginButton />
                    <GetRegisterButton />
                  </>
                )}
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
