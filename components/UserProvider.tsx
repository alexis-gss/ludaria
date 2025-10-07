"use client";

import { createContext, useContext, useState } from "react";

import type { ReactNode } from "react";
import type { PublicUser } from "@/types/global";

type UserContextType = {
  user: PublicUser;
  setUser: (u: PublicUser) => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export function UserProvider({
  initialUser,
  children,
}: {
  initialUser: PublicUser;
  children: ReactNode;
}) {
  const [user, setUser] = useState<PublicUser>(initialUser);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
