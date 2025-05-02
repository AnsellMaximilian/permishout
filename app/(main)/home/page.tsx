"use client";

import ShoutComposer from "@/components/shouts/ShoutComposer";
import ShoutItem from "@/components/shouts/ShoutItem";
import api from "@/lib/api";
import { Shout } from "@/types/shout";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [shouts, setShouts] = useState<Shout[]>([]);
  useEffect(() => {
    (async () => {
      const shouts = await api.get("/shouts");

      setShouts(shouts.data as Shout[]);
    })();
  }, []);
  return (
    <div className="mx-auto max-w-2xl bg-white mt-4 rounded-md">
      <div className="border-b border-border pb-4">
        <ShoutComposer />
      </div>

      <div className="flex flex-col gap-4">
        {shouts.map((shout) => (
          <ShoutItem key={shout.key} shout={shout} />
        ))}
      </div>
    </div>
  );
}
