"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import type { SubmitEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Magnet from "@/components/ui/magnet";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!token) {
      toast.error("Erreur", { description: "Invalid reset link" });
      return;
    }
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) toast.success("Success", { description: "Reset link sent successfully." });
      else toast.error("Erreur", { description: data.error });
    } catch (err) {
      console.error("Register error:", err);
      toast.error("Erreur", { description: "Impossible de créer le compte." });
    } finally {
      setLoading(false);
      router.push("/login");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden transition-colors duration-500">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.2),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_60%)] transition-colors duration-500" />
      {/* Card Container */}
      <Magnet padding={85} magnetStrength={50}>
        <div className="relative z-10 w-full max-w-md rounded-2xl bg-white dark:bg-black/30 backdrop-blur-xl p-8 shadow-2xl transition-colors duration-500">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white transition-colors">
            Reset Password
          </h1>
          <p className="text-center text-sm text-gray-700 dark:text-white/70 mb-8">
            Enter your new password below.
          </p>
          <form onSubmit={submit} className="space-y-5">
            {/* Password */}
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
            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading || !password}
                className="cursor-pointer w-full text-white font-semibold transition-all bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-85"
              >
                {loading ? "Resetting password…" : "Reset password"}
              </Button>
            </div>
          </form>
          <p className="text-center text-gray-700 dark:text-white/70 text-sm mt-6">
            Already registered?{" "}
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
