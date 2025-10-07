"use client";

import React, { createContext, useContext, useState } from "react";

export type PublicUser = {
  id: number;
  pseudo: string;
  email: string;
  createdAt?: string | null;
  updatedAt?: string | null;
} | null;

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
  children: React.ReactNode;
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
