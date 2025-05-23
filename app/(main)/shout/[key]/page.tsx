import React from "react";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Repeat, Heart } from "lucide-react";
import api from "@/lib/api";
import { Shout } from "@/types/shout";
import Link from "next/link";
import ReplySection from "./ReplySection";

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

  const timeAgo = formatDistanceToNow(new Date(shout.createdAt), {
    addSuffix: true,
  });

  return (
    <div className="bg-white shadow-md rounded-md">
      <div className="p-4 rounded-lg space-y-4">
        <div className="">
          <Link
            href={`/profile/${shout.userId}`}
            className="text-lg font-bold text-foreground block hover:underline"
          >
            {shout.name}
          </Link>
          <Link
            href={`/profile/${shout.userId}`}
            className="text-muted-foreground block hover:underline"
          >
            @{shout.username}
          </Link>
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

      <ReplySection shoutKey={key} />
    </div>
  );
}
