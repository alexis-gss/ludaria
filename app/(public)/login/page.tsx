"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Magnet from "@/components/ui/magnet";
import { useUser } from "@/components/UserProvider";

export default function Page() {
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.token) {
        document.cookie = `token=${data.token}; path=/`;
        setUser(data.user);
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Register error:", err);
      toast.error("Erreur", { description: "Unable to create the account." });
    } finally {
      setLoading(false);
    }
  };

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
            Sign in to your account
          </h1>
          <p className="text-center text-sm text-gray-700 dark:text-white/70 mb-8">
            Sign in to your account and continue your adventure
          </p>
          <form onSubmit={submit} className="space-y-5">
            {/* Email */}
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
                className="
                bg-gray-100/70 dark:bg-white/20
                border-gray-300 dark:border-white/30
                text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-white/60
                transition-colors mt-1
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
                placeholder="************"
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
            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading || !email || !password}
                className="
                cursor-pointer w-full text-white font-semibold transition-all
                bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
                hover:opacity-85
              "
              >
                {loading ? "Connecting…" : "Sign in"}
              </Button>
            </div>
          </form>
          <p className="text-center text-gray-700 dark:text-white/70 text-sm mt-6">
            Don't have an account yet?{" "}
            <Link
              href="/register"
              className="text-purple-500 hover:underline hover:underline-offset-3 transition-colors"
            >
              Sign up
            </Link>
          </p>
          <p className="text-center text-gray-700 dark:text-white/70 text-sm mt-6">
            <Link
              href="/forgot-password"
              className="text-purple-500 hover:underline hover:underline-offset-3 transition-colors"
            >
              Forgot Password
            </Link>
          </p>
        </div>
      </Magnet>
    </div>
  );
}
