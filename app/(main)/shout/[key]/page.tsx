import { mockShouts } from "@/const/shout";
import React from "react";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Repeat, Heart } from "lucide-react";
import ShoutItem from "@/components/shouts/ShoutItem";
import api from "@/lib/api";
import { Shout } from "@/types/shout";

export default async function ShoutPage({
  params,
}: {
  params: { key: string };
}) {
  const { key } = params;

  let shout: null | Shout = null;

  try {
    const res = await api.get(`/shouts/${key}`);
    shout = res.data as Shout;
  } catch {
    shout = null;
  }

  if (!shout) notFound();

  const replies = mockShouts.filter((s) => s.key !== key).slice(0, 4);

  const timeAgo = formatDistanceToNow(new Date(shout.createdAt), {
    addSuffix: true,
  });

  return (
    <div className="mx-auto max-w-2xl mt-6 bg-white shadow-md rounded-md">
      <div className="p-6 rounded-lg space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-foreground">{shout.name}</h2>
          <p className="text-muted-foreground">@{shout.username}</p>
        </div>

        <p className="text-lg text-foreground whitespace-pre-wrap">
          {shout.content}
        </p>

        <p className="text-sm text-muted-foreground">{timeAgo}</p>

        <div className="flex gap-6 text-muted-foreground text-sm border-t border-border pt-4 mb-4">
          <div className="flex items-center gap-1 hover:text-foreground cursor-pointer">
            <MessageCircle size={16} />
            <span>Reply</span>
          </div>
          <div className="flex items-center gap-1 hover:text-foreground cursor-pointer">
            <Repeat size={16} />
            <span>Reshout</span>
          </div>
          <div className="flex items-center gap-1 hover:text-foreground cursor-pointer">
            <Heart size={16} />
            <span>Like</span>
          </div>
        </div>
      </div>

      <div className="rounded-md rounded-t-none shadow-sm border-border border-t">
        <h3 className="text-sm px-4 pt-3 pb-1 text-muted-foreground font-semibold">
          Replies
        </h3>
        {replies.map((reply) => (
          <ShoutItem key={reply.key} shout={reply} />
        ))}
      </div>
    </div>
  );
}
