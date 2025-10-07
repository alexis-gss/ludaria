"use client";

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
import { getPasswordRules, isPasswordStrong } from "@/lib/validation/password";

export default function FormPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const pwRules = getPasswordRules(newPassword, confirmPassword);
  const passwordValid = isPasswordStrong(newPassword, confirmPassword);

  async function onChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordValid) {
      toast.error("Mot de passe invalide", {
        description:
          "Vérifiez que le nouveau mot de passe respecte toutes les règles et que la confirmation est correcte.",
      });
      return;
    }
    setPwLoading(true);
    try {
      const res = await fetch("/api/auth/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? `Erreur ${res.status}`);
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Mot de passe mis à jour", {
        description: "Votre mot de passe a été modifié avec succès.",
      });
    } catch (err) {
      console.error("Password change error:", err);
      toast.error("Erreur", {
        description: "Impossible de changer le mot de passe.",
      });
    } finally {
      setPwLoading(false);
    }
  }

  return (
    <form onSubmit={onChangePassword} className="space-y-4">
      <FieldSet>
        <FieldLegend className="font-bold tracking-tight">
          Mot de passe du profil
        </FieldLegend>
        <FieldDescription className="whitespace-pre-line">
          Changez votre mot de passe pour sécuriser votre compte. Assurez-vous
          de respecter toutes les règles ci-dessous.
        </FieldDescription>
        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
          <Field>
            <FieldLabel htmlFor="currentPassword">
              Mot de passe actuel
            </FieldLabel>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1"
              placeholder="Entrez votre mot de passe actuel"
            />
            <FieldDescription>
              Saisissez votre mot de passe actuel pour confirmer votre identité.
            </FieldDescription>
          </Field>
        </FieldGroup>
        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
          <Field>
            <FieldLabel htmlFor="newPassword">Nouveau mot de passe</FieldLabel>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1"
              placeholder="Entrez un nouveau mot de passe"
            />
            <FieldDescription>
              Choisissez un mot de passe sécurisé respectant les critères
              ci-dessous.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="confirmPassword">
              Confirmer le nouveau mot de passe
            </FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1"
              placeholder="Confirmez votre nouveau mot de passe"
            />
            <FieldDescription>
              Saisissez à nouveau le mot de passe pour confirmer.
            </FieldDescription>
          </Field>
        </FieldGroup>
        <FieldGroup className="text-sm space-y-1 gap-0">
          <div className="flex items-center gap-2">
            <span
              className={pwRules.length ? "text-green-600" : "text-red-500"}
            >
              {pwRules.length ? "✓" : "✗"}
            </span>
            <span>Au moins 12 caractères</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={pwRules.upper ? "text-green-600" : "text-red-500"}>
              {pwRules.upper ? "✓" : "✗"}
            </span>
            <span>Une lettre majuscule</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={pwRules.lower ? "text-green-600" : "text-red-500"}>
              {pwRules.lower ? "✓" : "✗"}
            </span>
            <span>Une lettre minuscule</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={pwRules.digit ? "text-green-600" : "text-red-500"}>
              {pwRules.digit ? "✓" : "✗"}
            </span>
            <span>Un chiffre</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={pwRules.special ? "text-green-600" : "text-red-500"}
            >
              {pwRules.special ? "✓" : "✗"}
            </span>
            <span>Un caractère spécial (ex: !@#$%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={
                pwRules.confirmMatch ? "text-green-600" : "text-red-500"
              }
            >
              {pwRules.confirmMatch ? "✓" : "✗"}
            </span>
            <span>Confirmation identique</span>
          </div>
        </FieldGroup>
        <FieldGroup className="flex flex-col sm:flex-row md:flex-row justify-center md:justify-start items-center gap-2">
          <Button
            className="cursor-pointer transition-all duration-300"
            aria-label="Modifier le mot de passe"
            type="submit"
            disabled={pwLoading || !passwordValid}
          >
            {pwLoading ? "Modification…" : "Modifier le mot de passe"}
          </Button>
          <Button
            className="cursor-pointer transition-all duration-300"
            aria-label="Annuler"
            type="button"
            variant="ghost"
            onClick={() => {
              setCurrentPassword("");
              setNewPassword("");
              setConfirmPassword("");
            }}
          >
            Annuler
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
