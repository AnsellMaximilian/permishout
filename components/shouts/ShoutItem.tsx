"use client";

import { Shout, ShoutReplyLabels } from "@/types/shout";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { MessageCircle, Repeat, Heart } from "lucide-react"; // shadcn icons

export default function ShoutItem({ shout }: { shout: Shout }) {
  const timeAgo = formatDistanceToNow(new Date(shout.createdAt), {
    addSuffix: true,
  });

  const router = useRouter();

  return (
    <div
      className="block hover:bg-muted transition cursor-pointer"
      onClick={(e) => {
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
        </div>
      </div>
    </div>
  );
}
