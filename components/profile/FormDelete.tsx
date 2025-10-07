"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUser } from "@/components/UserProvider";

export default function FormDelete() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [confirmEmail, setConfirmEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  async function onDelete(e: React.FormEvent) {
    e.preventDefault();
    // Confirm must be exact user’s email
    const okConfirm = confirmEmail.trim() === user?.email;
    if (!okConfirm) {
      toast.error("Confirmation invalide", {
        description: "Tapez votre email pour confirmer.",
      });
      return;
    }
    if (!currentPassword) {
      toast.error("Mot de passe requis", {
        description: "Saisissez votre mot de passe.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/profile/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, confirm: confirmEmail }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error("Erreur", {
          description: json?.error ?? "Impossible de supprimer le compte.",
        });
        setLoading(false);
        return;
      }

      // Clear local user state and redirect to homepage / login
      setTimeout(() => setUser(null), 1000);
      // Redirect to home or login
      router.push("/deleted-account");
    } catch (err) {
      console.error("Delete account error:", err);
      toast.error("Erreur", {
        description: "Impossible de supprimer le compte.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onDelete} className="space-y-6">
      <FieldSet>
        <FieldLegend className="font-bold tracking-tight">
          Danger zone
        </FieldLegend>
        <FieldDescription className="whitespace-pre-line">
          La suppression de votre compte est irréversible.{"\n"}Toutes vos
          données seront supprimées.{"\n"}Pour confirmer, tapez votre adresse
          email <strong>{user.email}</strong>, puis saisissez votre mot de
          passe.
        </FieldDescription>
        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
          <Field>
            <FieldLabel htmlFor="confirm">Confirmer</FieldLabel>
            <Input
              id="confirm"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder="Votre adresse email"
              className="mt-1"
            />
            <FieldDescription>
              Saisissez votre adresse email pour confirmer la suppression.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="currentPassword">Mot de passe</FieldLabel>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Votre mot de passe"
              className="mt-1"
            />
            <FieldDescription>
              Entrez votre mot de passe pour valider cette action.
            </FieldDescription>
          </Field>
        </FieldGroup>
        <FieldGroup className="flex flex-col sm:flex-row md:flex-row justify-center md:justify-start items-center gap-2">
          <Button
            className="cursor-pointer bg-red-600 hover:bg-red-700 transition-all duration-300"
            aria-label="Submit profile deletion"
            type="submit"
            disabled={loading}
          >
            {loading ? "Suppression…" : "Supprimer mon compte"}
          </Button>
          <Button
            className="cursor-pointer transition-all duration-300"
            aria-label="Cancel profile deletion"
            type="button"
            variant="ghost"
            onClick={() => {
              setConfirmEmail("");
              setCurrentPassword("");
            }}
          >
            Annuler
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
