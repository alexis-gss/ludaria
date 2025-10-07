"use client";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import Magnet from "@/components/ui/magnet";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) setMsg(data.message);
      else setError(data.error);
    } catch (err) {
      console.error("Register error:", err);
      toast.error("Erreur", { description: "Impossible de créer le compte." });
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
            <h1>Forgot Password</h1>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Send Link</button>
            {msg ? <div>{msg}</div> : null}
            {error ? <div>{error}</div> : null}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading || !email}
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
        </div>
      </Magnet>
    </div>
  );
}
