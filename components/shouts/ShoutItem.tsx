"use client";

import { Shout, ShoutReplyLabels } from "@/types/shout";
import React, { Dispatch, SetStateAction } from "react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { MessageCircle, Repeat, Heart, Trash } from "lucide-react";
import { Can } from "@casl/react";
import { useAbility } from "@/hooks/useAbility";

export default function ShoutItem({
  shout,
  setShoutToDeleteKey,
}: {
  shout: Shout;
  setShoutToDeleteKey: Dispatch<SetStateAction<string | null>>;
}) {
  const timeAgo = formatDistanceToNow(new Date(shout.createdAt), {
    addSuffix: true,
  });

  const { ability } = useAbility();

  const router = useRouter();

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

        <p className="text-base text-foreground whitespace-pre-wrap">
          {shout.content}
        </p>

        <div className="text-sm text-muted-foreground italic">
          {ShoutReplyLabels[shout.replyMode as keyof typeof ShoutReplyLabels]}
        </div>

        <div className="flex gap-6 pt-2 text-muted-foreground text-sm">
          <div className="flex items-center gap-1 hover:text-foreground">
            <MessageCircle size={16} />
            <span>Reply</span>
          </div>
          <div className="flex items-center gap-1 hover:text-foreground">
            <Repeat size={16} />
            <span>Reshout</span>
          </div>
          <div className="flex items-center gap-1 hover:text-foreground">
            <Heart size={16} />
            <span>Like</span>
          </div>

          <Can I="delete" a={`shout:${shout.key}`} ability={ability}>
            <div
              className="flex items-center gap-1 text-red-400 hover:text-red-500 ml-auto"
              onClick={(e) => {
                e.stopPropagation();
                setShoutToDeleteKey(shout.key);
              }}
            >
              <Trash size={16} />
              <span>Delete</span>
            </div>
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
    </div>
  );
}
