import { AbilityContext } from "@/context/permission/AbilityContextProvider";
import { useContext } from "react";

export const useAbility = () => {
  const ability = useContext(AbilityContext);
  if (!ability) {
    throw new Error("useAbility must be used within an AbilityProvider");
  }
  return ability;
};
