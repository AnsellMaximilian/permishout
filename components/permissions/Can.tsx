import { ReactNode } from "react";
import { Can as CaslCan } from "@casl/react";
import { Ability } from "@casl/ability";

type ExtraCondition = boolean | (() => boolean);

interface Props {
  I: string;
  a: string;
  ability: Ability;
  extraConditions?: ExtraCondition[];
  children: ReactNode;
}

export default function Can({
  I,
  a,
  ability,
  extraConditions = [],
  children,
}: Props) {
  const allConditionsPass = extraConditions.every((cond) =>
    typeof cond === "function" ? cond() : cond
  );

  if (!allConditionsPass) return null;

  return (
    <CaslCan I={I} a={a} ability={ability}>
      {children}
    </CaslCan>
  );
}
