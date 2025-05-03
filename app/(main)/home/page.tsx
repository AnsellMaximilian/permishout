"use client";

import ShoutComposer from "@/components/shouts/ShoutComposer";
import ShoutItem from "@/components/shouts/ShoutItem";
import api from "@/lib/api";
import { toastError } from "@/lib/utils";
import { Shout } from "@/types/shout";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [shouts, setShouts] = useState<Shout[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const shouts = await api.get("/shouts");

        setShouts(shouts.data as Shout[]);
      } catch {
        toastError("Error fetching shouts.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <div className="bg-white rounded-md">
      <div className="border-b border-border pb-4">
        <ShoutComposer setShouts={setShouts} />
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : shouts.length === 0 ? (
          <div className="p-12">
            <p className="text-center text-muted-foreground text-sm">
              No shouts yet. Be the first to shout!
            </p>
          </div>
        ) : (
          shouts.map((shout) => <ShoutItem key={shout.key} shout={shout} />)
        )}
      </div>
    </div>
  );
}
