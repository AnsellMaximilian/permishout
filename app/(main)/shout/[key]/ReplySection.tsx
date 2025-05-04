"use client";

import ShoutItem from "@/components/shouts/ShoutItem";
import api from "@/lib/api";
import { toastError } from "@/lib/utils";
import { Shout } from "@/types/shout";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { isAxiosError } from "axios";
export default function ReplySection({ shoutKey }: { shoutKey: string }) {
  const [replies, setReplies] = useState<Shout[]>([]);
  const [loading, setLoading] = useState(true);
  const [shoutToDeleteKey, setShoutToDeleteKey] = useState<null | string>(null);

  const handleDeleteShout = async () => {
    try {
      const res = await api.delete(`/shouts/${shoutToDeleteKey}`);
      const deletedShout = res.data as Shout;
      setReplies((prev) =>
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
    (async () => {
      setLoading(true);
      try {
        const res = await api.get(`/shouts?replyTo=${shoutKey}`);
        const data = (await res.data) as Shout[];
        setReplies(data);
      } catch (error) {
        toastError(
          error instanceof Error ? error.message : "Failed to load replies"
        );
        setReplies([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [shoutKey]);
  return (
    <div className="rounded-md rounded-t-none shadow-sm border-border border-t">
      <h3 className="text-sm px-4 pt-3 pb-1 text-muted-foreground font-semibold">
        Replies
      </h3>
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : replies.length === 0 ? (
          <div className="p-12">
            <p className="text-center text-muted-foreground text-sm">
              No shouts yet. Be the first to shout!
            </p>
          </div>
        ) : (
          replies.map((shout) => (
            <ShoutItem
              setShouts={setReplies}
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
