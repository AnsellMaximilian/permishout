"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import api from "@/lib/api";
import { PermishoutUser } from "@/types/user";

export default function UserContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<PermishoutUser | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/users");
        const permishoutUser = res.data as PermishoutUser;

        setUser(permishoutUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser: user,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
