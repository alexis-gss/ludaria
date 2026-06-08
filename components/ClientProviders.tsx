"use client";

import React from "react";
import { Toaster } from "sonner";

import type { PublicUser } from "@/components/UserProvider";
import type { ReactNode } from "react";

import { UserProvider } from "@/components/UserProvider";

export default function ClientProviders({
  initialUser,
  children,
}: {
  initialUser: PublicUser;
  children: ReactNode;
}) {
  return (
    <UserProvider initialUser={initialUser}>
      {/* Toaster global */}
      <Toaster position="bottom-right" richColors />
      {children}
    </UserProvider>
  );
}