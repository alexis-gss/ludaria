"use client";

import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useUser } from "@/components/UserProvider";

export function LogoutButton() {
  const { setUser } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  };

  return (
    <Button
      className="cursor-pointer font-semibold"
      variant="ghost"
      aria-label="Log out player"
      onClick={handleLogout}
    >
      <LogOutIcon size={16} /> Logout
    </Button>
  );
}
