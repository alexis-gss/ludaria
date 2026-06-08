"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { SubmitEvent } from "react";

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

export type PublicUser = {
  id: number;
  pseudo: string;
  email: string;
  createdAt?: string | null;
  updatedAt?: string | null;
} | null;

export default function FormData() {
  const { user, setUser } = useUser();
  const [pseudo, setPseudo] = useState<string>(user?.pseudo ?? "");
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [loading, setLoading] = useState<boolean>(false);

  // Sync local form when provider user changes.
  useEffect(() => {
    setPseudo(user?.pseudo ?? "");
    setEmail(user?.email ?? "");
  }, [user]);

  async function onSave(e: SubmitEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo, email }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? `Error ${res.status}`);
      }
      const updated: PublicUser = await res.json();
      setUser(updated);
      toast.success("Profile updated", {
        description: "Your information has been saved.",
      });
    } catch (err) {
      console.error("Profile save error:", err);
      toast.error("Error", {
        description: "Impossible to save the profile.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSave} className="space-y-6">
      <FieldSet>
        <FieldLegend className="font-bold tracking-tight">
          General Information
        </FieldLegend>
        <FieldDescription>
          These informations are used to personalize your account and your communications.
        </FieldDescription>
        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
          <Field>
            <FieldLabel htmlFor="pseudo">Pseudo</FieldLabel>
            <Input
              id="pseudo"
              value={pseudo ?? ""}
              onChange={(e) => setPseudo(e.target.value)}
              className="mt-1"
              placeholder="Your name"
            />
            <FieldDescription>
              Your pseudo will be visible on your profile and in your interactions with the platform.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="e-mail">E-mail</FieldLabel>
            <Input
              id="e-mail"
              type="email"
              value={email ?? ""}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              placeholder="adresse@exemple.com"
            />
            <FieldDescription>
              Your e-mail will be used for login and important notifications related to your account.
            </FieldDescription>
          </Field>
        </FieldGroup>
        <FieldGroup className="flex flex-col sm:flex-row md:flex-row justify-center md:justify-start items-center gap-2">
          <Button
            className="cursor-pointer transition-all duration-300"
            aria-label="Submit profile data"
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving…" : "Save"}
          </Button>
          <Button
            className="cursor-pointer transition-all duration-300"
            aria-label="Cancel profile data"
            type="button"
            variant="ghost"
            onClick={() => {
              setPseudo(user?.pseudo ?? "");
              setEmail(user?.email ?? "");
            }}
          >
            Cancel
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
