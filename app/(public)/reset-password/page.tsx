"use client";

import { motion } from "framer-motion";
import { CheckIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import type { SubmitEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Magnet from "@/components/ui/magnet";
import { getPasswordRules, isPasswordStrong } from "@/lib/validations";

const PW_RULES_LABELS: [keyof ReturnType<typeof getPasswordRules>, string][] = [
  ["length", "At least 12 characters"],
  ["upper", "An uppercase letter"],
  ["lower", "A lowercase letter"],
  ["digit", "A digit"],
  ["special", "A special character (e.g., !@#$%)"],
  ["confirmMatch", "Matching confirmation"],
];

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const pwRules = getPasswordRules(password, confirm);
  const passwordValid = isPasswordStrong(password, confirm);

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Error", { description: "Invalid or missing reset link." });
      return;
    }
    if (!passwordValid) {
      toast.error("Invalid password", {
        description: "Follow the safety rules.",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("Error", {
          description: data.error ?? "Unable to reset password.",
        });
        return;
      }
      toast.success("Password reset!", {
        description: "You can now sign in with your new password.",
      });
      router.push("/login");
    } catch (err) {
      console.error("Reset password error:", err);
      toast.error("Error", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="relative flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-700 dark:text-white/70">
            Invalid or expired reset link.
          </p>
          <Link
            href="/forgot-password"
            className="text-purple-500 hover:underline"
          >
            Request a new one
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden transition-colors duration-500">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.2),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_60%)] transition-colors duration-500" />
      <Magnet padding={85} magnetStrength={50}>
        <div className="relative z-10 w-full max-w-md rounded-2xl bg-white dark:bg-black/30 backdrop-blur-xl p-8 shadow-2xl transition-colors duration-500">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white transition-colors">
            Reset Password
          </h1>
          <p className="text-center text-sm text-gray-700 dark:text-white/70 mb-8">
            Enter your new password below.
          </p>
          <form onSubmit={submit} className="space-y-5">
            <div>
              <Label
                htmlFor="password"
                className="text-gray-800 dark:text-white transition-colors gap-1"
              >
                New Password<span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="************"
                className="bg-gray-100/70 dark:bg-white/20 border-gray-300 dark:border-white/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/60 transition-colors mt-1"
              />
            </div>
            <div>
              <Label
                htmlFor="confirm"
                className="text-gray-800 dark:text-white transition-colors gap-1"
              >
                Confirm Password<span className="text-red-500">*</span>
              </Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="************"
                className="bg-gray-100/70 dark:bg-white/20 border-gray-300 dark:border-white/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/60 transition-colors mt-1"
              />
            </div>
            {/* Password rules */}
            <motion.div
              className="text-sm space-y-1 text-gray-700 dark:text-white/90 transition-colors"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.1 } },
              }}
              initial="hidden"
              animate="show"
            >
              {PW_RULES_LABELS.map(([key, label]) => (
                <motion.div
                  key={key}
                  className="flex items-center gap-2"
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                  }}
                >
                  <span
                    className={pwRules[key] ? "text-green-500" : "text-red-500"}
                  >
                    {pwRules[key] ? (
                      <CheckIcon size="16" />
                    ) : (
                      <XIcon size="16" />
                    )}
                  </span>
                  <span>{label}</span>
                </motion.div>
              ))}
            </motion.div>
            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading || !passwordValid}
                className="cursor-pointer w-full text-white font-semibold transition-all bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-85"
              >
                {loading ? "Resetting password…" : "Reset password"}
              </Button>
            </div>
          </form>
          <p className="text-center text-gray-700 dark:text-white/70 text-sm mt-6">
            <Link
              href="/login"
              className="text-purple-500 hover:underline hover:underline-offset-3 transition-colors"
            >
              Back to sign in
            </Link>
          </p>
        </div>
      </Magnet>
    </div>
  );
}
