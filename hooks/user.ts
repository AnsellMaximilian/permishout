import { UserContext } from "@/context/user/UserContext";
import { useContext } from "react";

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("userUser must be used within an AuthProvider");
  }
  return context;
};
