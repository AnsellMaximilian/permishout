"use client";

import { Shout, ShoutReplyLabels, ShoutReplyType } from "@/types/shout";
import React, { Dispatch, SetStateAction, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { MessageCircle, Repeat, Heart, Trash } from "lucide-react";
import { Can } from "@casl/react";
import { useAbility } from "@/hooks/useAbility";
import { Button } from "@/components/ui/button";
import { permitState } from "permit-fe-sdk";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ShoutComposer from "./ShoutComposer";
export default function ShoutItem({
  shout,
  setShoutToDeleteKey,
  setShouts,
}: {
  shout: Shout;
  setShoutToDeleteKey?: Dispatch<SetStateAction<string | null>>;
  setShouts?: Dispatch<SetStateAction<Shout[]>>;
}) {
  const timeAgo = formatDistanceToNow(new Date(shout.createdAt), {
    addSuffix: true,
  });

  const { ability } = useAbility();

  const router = useRouter();

  const [isReplyOpen, setIsReplyOpen] = useState(false);

  const canReply =
    shout.replyMode === ShoutReplyType.EVERYONE ||
    permitState?.check("reply", `shout:${shout.key}`, {});

  return (
    <div
      className="block hover:bg-muted transition cursor-pointer"
      onClick={async (e) => {
        e.stopPropagation();
        router.push(`/shout/${shout.key}`);
      }}
    >
      <div className="p-4 space-y-2 not-last:border-b border-border">
        <div className="flex text-sm gap-2">
          <span
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/profile/${shout.userId}`);
            }}
            className="font-bold text-foreground hover:underline"
          >
            {shout.name}
          </span>
          <span
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/profile/${shout.userId}`);
            }}
            className="font-medium text-muted-foreground hover:underline"
          >
            @{shout.username}
          </span>
          <span className="text-muted-foreground">{timeAgo}</span>
        </div>

        {shout.replyTo && (
          <span
            className="font-medium text-muted-foreground hover:underline text-xs"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/shout/${shout.replyTo}`);
            }}
          >
            Replying to @{shout.replyToUsername}
          </span>
        )}

        <p className="text-base text-foreground whitespace-pre-wrap">
          {shout.content}
        </p>

        <div className="text-sm text-muted-foreground italic">
          {ShoutReplyLabels[shout.replyMode as keyof typeof ShoutReplyLabels]}
        </div>

        <div className="flex gap-6 pt-2 text-muted-foreground text-sm">
          <Button
            style={{ padding: 0 }}
            className="flex items-center gap-1 hover:text-foreground"
            variant="ghost"
            disabled={!canReply}
            onClick={(e) => {
              e.stopPropagation();
              setIsReplyOpen(true);
            }}
          >
            <MessageCircle size={16} />
            <span>Reply</span>
          </Button>
          <Button
            style={{ padding: 0 }}
            className="flex items-center gap-1 hover:text-foreground"
            variant="ghost"
            disabled
          >
            <Repeat size={16} />
            <span>Reshout</span>
          </Button>
          <Button
            style={{ padding: 0 }}
            className="flex items-center gap-1 hover:text-foreground"
            variant="ghost"
            disabled
          >
            <Heart size={16} />
            <span>Like</span>
          </Button>

          <Can I="delete" a={`shout:${shout.key}`} ability={ability}>
            <Button
              style={{ padding: 0 }}
              variant="ghost"
              className="flex items-center gap-1 text-red-400 hover:text-red-500 ml-auto"
              onClick={(e) => {
                e.stopPropagation();
                if (setShoutToDeleteKey) setShoutToDeleteKey(shout.key);
              }}
            >
              <Trash size={16} />
              <span>Delete</span>
            </Button>
          </Can>

          {/* FOR CHECKING PERMISSION */}
          {/* <div
              className="flex items-center gap-1 text-red-400 hover:text-red-500 ml-auto"
              onClick={(e) => {
                e.stopPropagation();
                setShoutToDeleteKey(shout.key);
              }}
            >
              <Trash size={16} />
              <span>Delete</span>
            </div> */}
        </div>
      </div>

      <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Replying to @{shout.username}</DialogTitle>
            <DialogDescription>{shout.content}</DialogDescription>
            <div className="mt-4"></div>
            <ShoutComposer
              setShouts={setShouts}
              replyingTo={shout}
              onPosted={() => setIsReplyOpen(false)}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
