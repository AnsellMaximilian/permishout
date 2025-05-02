import { Shout, ShoutReplyLabels } from "@/types/shout";
import React from "react";
import { formatDistanceToNow } from "date-fns";

export default function ShoutItem({ shout }: { shout: Shout }) {
  const timeAgo = formatDistanceToNow(new Date(shout.createdAt), {
    addSuffix: true,
  });

  return (
    <div className="p-4 space-y-2 not-last:border-b border-border">
      <div className="flex text-sm gap-2">
        <span className="font-bold text-foreground">{shout.name}</span>
        <span className="font-medium text-muted-foreground">
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
    </div>
  );
}
