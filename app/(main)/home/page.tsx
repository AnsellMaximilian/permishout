"use client";

import ShoutComposer from "@/components/shouts/ShoutComposer";
import ShoutItem from "@/components/shouts/ShoutItem";
import { useAbility } from "@/hooks/useAbility";
import api from "@/lib/api";
import { toastError } from "@/lib/utils";
import { Shout } from "@/types/shout";
import { Loader2 } from "lucide-react";
import { ActionResourceSchema } from "permit-fe-sdk";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [shouts, setShouts] = useState<Shout[]>([]);
  const [loading, setLoading] = useState(true);
  const { setActionResources } = useAbility();

  const [shoutToDeleteKey, setShoutToDeleteKey] = useState<null | string>(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/shouts");

        const shouts: Shout[] = res.data;

        setShouts(shouts);
      } catch {
        toastError("Error fetching shouts.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDeleteShout = async () => {
    try {
      const res = await api.delete(`/shouts/${shoutToDeleteKey}`);
      const deletedShout = res.data as Shout;
      setShouts((prev) =>
        prev.filter((shout) => shout.key !== deletedShout.key)
      );
      toast("Deleted successfully");
      // Handle success, update state, etc.
    } catch (error) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || "Unknown error.";
        toastError(message);
      } else {
        toastError("Unexpected error occurred.");
      }
    } finally {
      setShoutToDeleteKey(null);
    }
  };

  useEffect(() => {
    const shoutActions: ActionResourceSchema[] = shouts.flatMap((shout) => [
      { action: "reply", resource: `shout:${shout.key}` },
      { action: "delete", resource: `shout:${shout.key}` },
    ]);

    setActionResources(shoutActions);
  }, [shouts, setActionResources]);
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
          shouts.map((shout) => (
            <ShoutItem
              key={shout.key}
              shout={shout}
              setShoutToDeleteKey={setShoutToDeleteKey}
            />
          ))
        )}
      </div>

      <AlertDialog
        open={!!shoutToDeleteKey}
        onOpenChange={(open) => {
          if (!open) {
            setShoutToDeleteKey(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this Shout?</AlertDialogTitle>
            <AlertDialogDescription>
              You will still need to pass the check in the backend to delete.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={handleDeleteShout} variant="destructive">
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
