"use client";

import ShoutItem from "@/components/shouts/ShoutItem";
import { useAbility } from "@/hooks/useAbility";
import api from "@/lib/api";
import { Shout } from "@/types/shout";
import { ActionResourceSchema } from "permit-fe-sdk";
import React, { useEffect, useState } from "react";

export default function ProfileShouts({ profileKey }: { profileKey: string }) {
  const [profileShouts, setProfileShouts] = useState<Shout[]>([]);

  const { setActionResources } = useAbility();

  useEffect(() => {
    const shoutActions: ActionResourceSchema[] = profileShouts.flatMap(
      (shout) => [
        { action: "reply", resource: `shout:${shout.key}` },
        { action: "delete", resource: `shout:${shout.key}` },
      ]
    );

    setActionResources(shoutActions);
  }, [profileShouts, setActionResources]);

  useEffect(() => {
    (async () => {
      const shouts: Shout[] = (
        await api.get(`/shouts?shouterKey=${profileKey}`)
      ).data;

      setProfileShouts(shouts);
    })();
  }, [profileKey]);

  return (
    <div className="flex flex-col gap-4">
      {profileShouts.map((shout) => (
        <ShoutItem key={shout.key} shout={shout} />
      ))}
    </div>
  );
}
