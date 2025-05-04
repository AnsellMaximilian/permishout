"use client";

import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Ability, AbilityTuple, MongoQuery } from "@casl/ability";
import { ActionResourceSchema, Permit, permitState } from "permit-fe-sdk";

const defaultActionResources: ActionResourceSchema[] = [
  {
    action: "delete",
    resource: "shout",
  },
];

export const AbilityContext = createContext<
  | {
      ability: Ability<AbilityTuple, MongoQuery>;
      setActionResources: React.Dispatch<
        React.SetStateAction<ActionResourceSchema[]>
      >;
    }
  | undefined
>(undefined);

export const AbilityLoader = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, user } = useUser();
  const [ability, setAbility] = useState<Ability<AbilityTuple, MongoQuery>>(
    new Ability()
  );
  const [actionResources, setActionResources] = useState<
    ActionResourceSchema[]
  >(defaultActionResources);

  useEffect(() => {
    (async () => {
      // reset it first
      setAbility(new Ability());

      if (isSignedIn) {
        const permit = Permit({
          loggedInUser: user.id,
          backendUrl: "/api/permit/check",
        });

        permit?.reset();

        console.log({ actionResources });
        const allActionResources = [
          ...actionResources,
          ...defaultActionResources,
        ];

        await permit.loadLocalStateBulk(allActionResources);

        const caslConfig = permitState.getCaslJson();

        const caslAbility =
          caslConfig && caslConfig.length
            ? new Ability(caslConfig)
            : new Ability();
        setAbility(caslAbility);
      }
    })();
  }, [isSignedIn, user, actionResources]);

  return (
    <AbilityContext.Provider value={{ ability, setActionResources }}>
      {children}
    </AbilityContext.Provider>
  );
};
