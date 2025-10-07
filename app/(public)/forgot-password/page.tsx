"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import type { SubmitEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Magnet from "@/components/ui/magnet";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });
      // Always show success — the API never reveals whether the email exists
      setSent(true);
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error("Error", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden transition-colors duration-500">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.2),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_60%)] transition-colors duration-500" />
      <Magnet padding={85} magnetStrength={50}>
        <div className="relative z-10 w-full max-w-md rounded-2xl bg-white dark:bg-black/30 backdrop-blur-xl p-8 shadow-2xl transition-colors duration-500">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white transition-colors">
            Forgot Password
          </h1>

          {sent ? (
            <>
              <p className="text-center text-gray-700 dark:text-white/70 mb-6">
                If an account exists for <strong>{email}</strong>, you'll
                receive a reset link in the next few minutes.
              </p>
              <p className="text-center text-gray-700 dark:text-white/70 text-sm">
                <Link
                  href="/login"
                  className="text-purple-500 hover:underline hover:underline-offset-3 transition-colors"
                >
                  Back to sign in
                </Link>
              </p>
            </>
          ) : (
            <>
              <p className="text-center text-sm text-gray-700 dark:text-white/70 mb-8">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
              <form onSubmit={submit} className="space-y-5">
                <div>
                  <Label
                    htmlFor="email"
                    className="text-gray-800 dark:text-white transition-colors gap-1"
                  >
                    Email Address<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@gmail.com"
                    className="bg-gray-100/70 dark:bg-white/20 border-gray-300 dark:border-white/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/60 transition-colors mt-1"
                  />
                </div>
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={loading || !email}
                    className="cursor-pointer w-full text-white font-semibold transition-all bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-85"
                  >
                    {loading ? "Sending reset link…" : "Send reset link"}
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
            </>
          )}
        </div>
      </Magnet>
    </div>
  );
}
