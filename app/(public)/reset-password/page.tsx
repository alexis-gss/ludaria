"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

import type { FormEvent} from "react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Lien de réinitialisation invalide");
      return;
    }
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (res.ok) {
      setMsg(data.message);
      setTimeout(() => router.push("/login"), 2000);
    } else setError(data.error);
  };

  return (
    <form onSubmit={submit}>
      <h1>Réinitialiser mot de passe</h1>
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Modifier</button>
      {msg ? <div>{msg}</div> : null}
      {error ? <div>{error}</div> : null}
    </form>
  );
}
