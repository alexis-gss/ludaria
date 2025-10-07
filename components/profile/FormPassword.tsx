"use client";

import { useState } from "react";
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
import { getPasswordRules, isPasswordStrong } from "@/lib/validations";

export default function FormPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const pwRules = getPasswordRules(newPassword, confirmPassword);
  const passwordValid = isPasswordStrong(newPassword, confirmPassword);

  async function submit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!passwordValid) {
      toast.error("Invalid password", {
        description:
          "Make sure the new password meets all the requirements and that the confirmation is correct.",
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
        throw new Error(err?.error ?? `Error ${res.status}`);
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated", {
        description: "Your password has been changed successfully.",
      });
    } catch (err) {
      console.error("Password change error:", err);
      toast.error("Error", {
        description: "Unable to change the password.",
      });
    } finally {
      setPwLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <FieldSet>
        <FieldLegend className="font-bold tracking-tight">
          Profile Password
        </FieldLegend>
        <FieldDescription className="whitespace-pre-line">
          Change your password to secure your account. Make sure to follow all the rules below.
        </FieldDescription>
        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
          <Field>
            <FieldLabel htmlFor="currentPassword">
              Current Password
            </FieldLabel>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1"
              placeholder="Enter your current password"
            />
            <FieldDescription>
              Enter your current password to confirm your identity.
            </FieldDescription>
          </Field>
        </FieldGroup>
        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
          <Field>
            <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1"
              placeholder="Enter your new password"
            />
            <FieldDescription>
              Choose a secure password that meets the criteria below.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="confirmPassword">
              Confirm New Password
            </FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1"
              placeholder="Confirm your new password"
            />
            <FieldDescription>
              Enter your new password again to confirm.
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
            <span>At least 12 characters</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={pwRules.upper ? "text-green-600" : "text-red-500"}>
              {pwRules.upper ? "✓" : "✗"}
            </span>
            <span>At least one uppercase letter</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={pwRules.lower ? "text-green-600" : "text-red-500"}>
              {pwRules.lower ? "✓" : "✗"}
            </span>
            <span>At least one lowercase letter</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={pwRules.digit ? "text-green-600" : "text-red-500"}>
              {pwRules.digit ? "✓" : "✗"}
            </span>
            <span>At least one digit</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={pwRules.special ? "text-green-600" : "text-red-500"}
            >
              {pwRules.special ? "✓" : "✗"}
            </span>
            <span>At least one special character (e.g., !@#$%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={
                pwRules.confirmMatch ? "text-green-600" : "text-red-500"
              }
            >
              {pwRules.confirmMatch ? "✓" : "✗"}
            </span>
            <span>Confirmation identical</span>
          </div>
        </FieldGroup>
        <FieldGroup className="flex flex-col sm:flex-row md:flex-row justify-center md:justify-start items-center gap-2">
          <Button
            className="cursor-pointer transition-all duration-300"
            aria-label="Modify Password"
            type="submit"
            disabled={pwLoading || !passwordValid}
          >
            {pwLoading ? "Modification…" : "Modify Password"}
          </Button>
          <Button
            className="cursor-pointer transition-all duration-300"
            aria-label="Cancel password modification"
            type="button"
            variant="ghost"
            onClick={() => {
              setCurrentPassword("");
              setNewPassword("");
              setConfirmPassword("");
            }}
          >
            Cancel
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
