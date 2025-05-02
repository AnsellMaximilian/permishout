import { PermishoutUser } from "@/types/user";
import { createContext } from "react";

export interface UserContextData {
  currentUser: PermishoutUser | null;
  loading: boolean;
}

export const UserContext = createContext<UserContextData | undefined>(
  undefined
);
