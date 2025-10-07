"use client";

import { motion } from "framer-motion";
import { CheckIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import type { FormEvent} from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Magnet from "@/components/ui/magnet";
import { getPasswordRules, isPasswordStrong } from "@/lib/validation/password";


export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pwRules = getPasswordRules(password, confirm);
  const passwordValid = isPasswordStrong(password, confirm);

  async function onRegister(e: FormEvent) {
    e.preventDefault();
    if (!passwordValid) {
      toast.error("Invalid password", {
        description: "Follow the safety rules.",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pseudo: pseudo || null, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? `Error ${res.status}`);
      }
      toast.success("Account created", {
        description: "You can now sign in.",
      });
      router.push("/profile");
    } catch (err) {
      console.error("Register error:", err);
      toast.error("Error", { description: "Unable to create the account." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden transition-colors duration-500">
      {/* Background radial gradient (adapté light/dark) */}
      <div
        className="
          absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.2),transparent_60%)]
          dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_60%)]
          transition-colors duration-500
        "
      />
      {/* Card Container */}
      <Magnet padding={85} magnetStrength={50}>
        <div
          className="
            relative z-10 w-full max-w-md rounded-2xl
            bg-white dark:bg-black/30
            backdrop-blur-xl p-8 shadow-2xl transition-colors duration-500"
        >
          <h1
            className="
              text-3xl font-bold text-center mb-6
              text-gray-900 dark:text-white transition-colors
            "
          >
            Create your account
          </h1>
          <p className="text-center text-sm text-gray-700 dark:text-white/70 mb-8">
            Join our community and start your adventure
          </p>
          <form onSubmit={onRegister} className="space-y-5">
            {/* Pseudo */}
            <div>
              <Label
                htmlFor="pseudo"
                className="text-gray-800 dark:text-white transition-colors gap-1"
              >
                Pseudo<span className="text-red-500">*</span>
              </Label>
              <Input
                id="pseudo"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                placeholder="Votre nom"
                className="
                  mt-1
                  bg-gray-100/70 dark:bg-white/20
                  border-gray-300 dark:border-white/30
                  text-gray-900 dark:text-white
                  placeholder-gray-500 dark:placeholder-white/60
                  transition-colors
                "
              />
            </div>
            {/* Email */}
            <div>
              <Label
                htmlFor="email"
                className="text-gray-800 dark:text-white transition-colors gap-1"
              >
                Email<span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adresse@exemple.com"
                className="
                  mt-1
                  bg-gray-100/70 dark:bg-white/20
                  border-gray-300 dark:border-white/30
                  text-gray-900 dark:text-white
                  placeholder-gray-500 dark:placeholder-white/60
                  transition-colors
                "
              />
            </div>
            {/* Password */}
            <div>
              <Label
                htmlFor="password"
                className="text-gray-800 dark:text-white transition-colors gap-1"
              >
                Password<span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="
                  mt-1
                  bg-gray-100/70 dark:bg-white/20
                  border-gray-300 dark:border-white/30
                  text-gray-900 dark:text-white
                  placeholder-gray-500 dark:placeholder-white/60
                  transition-colors
                "
              />
            </div>
            {/* Confirm */}
            <div>
              <Label
                htmlFor="confirm"
                className="text-gray-800 dark:text-white transition-colors gap-1"
              >
                Confirm<span className="text-red-500">*</span>
              </Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm password"
                className="
                  mt-1
                  bg-gray-100/70 dark:bg-white/20
                  border-gray-300 dark:border-white/30
                  text-gray-900 dark:text-white
                  placeholder-gray-500 dark:placeholder-white/60
                  transition-colors
                "
              />
            </div>
            {/* Password Rules */}
            <motion.div
              className="text-sm space-y-1 mt-4 text-gray-700 dark:text-white/90 transition-colors"
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.12,
                  },
                },
              }}
              initial="hidden"
              animate="show"
            >
              {[
                ["length", "At least 12 characters"],
                ["upper", "An uppercase letter"],
                ["lower", "A lowercase letter"],
                ["digit", "A digit"],
                ["special", "A special character (e.g., !@#$%)"],
                ["confirmMatch", "Matching confirmation"],
              ].map(([key, label]) => (
                <motion.div
                  key={key}
                  className="flex items-center gap-2"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.4, ease: "easeOut" },
                    },
                  }}
                >
                  <motion.span
                    className={
                      pwRules[key as keyof typeof pwRules]
                        ? "text-green-500"
                        : "text-red-500"
                    }
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {pwRules[key as keyof typeof pwRules] ? (
                      <CheckIcon size="16" />
                    ) : (
                      <XIcon size="16" />
                    )}
                  </motion.span>
                  <span>{label}</span>
                </motion.div>
              ))}
            </motion.div>
            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading || !passwordValid}
                className="
                  cursor-pointer w-full text-white font-semibold transition-all
                  bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
                  hover:opacity-85
                "
              >
                {loading ? "Creating…" : "Create an account"}
              </Button>
            </div>
          </form>
          <p className="text-center text-gray-700 dark:text-white/70 text-sm mt-6">
            Already registered ?{" "}
            <Link
              href="/login"
              className="text-purple-500 hover:underline hover:underline-offset-3 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Magnet>
    </div>
  );
}
