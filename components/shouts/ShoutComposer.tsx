"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  isValidReplyMode,
  Shout,
  ShoutReplyIcons,
  ShoutReplyLabels,
  ShoutReplyType,
} from "@/types/shout";
import api from "@/lib/api";
import { cn, toastError } from "@/lib/utils";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PermishoutUser } from "@/types/user";
export default function ShoutComposer({
  replyingTo,
  setShouts,
  onPosted,
}: {
  setShouts?: Dispatch<SetStateAction<Shout[]>>;
  replyingTo?: Shout;
  onPosted?: () => void;
}) {
  const [content, setContent] = useState("");
  const [replyMode, setReplyMode] = useState<ShoutReplyType>(
    ShoutReplyType.EVERYONE
  );

  const [loading, setLoading] = useState(false);

  const [showMentions, setShowMentions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [otherUsers, setOtherUsers] = useState<PermishoutUser[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/users/list");

        setOtherUsers(res.data as PermishoutUser[]);
      } catch {
        setOtherUsers([]);
      }
    })();
  }, []);

  const handlePost = async () => {
    try {
      setLoading(true);
      const res = await api.post("/shouts", {
        content,
        replyMode,
        replyTo: replyingTo?.key,
        replyToUsername: replyingTo?.username,
      });
      if (setShouts) setShouts((prev) => [res.data as Shout, ...prev]);
      toast("You just shouted!");
      if (onPosted) onPosted();
    } catch (error) {
      console.error(error);
      toastError("Something went wrong.");
    } finally {
      setLoading(false);
      setContent("");
      setReplyMode(ShoutReplyType.EVERYONE);
    }
  };

  useEffect(() => {
    const lastWord = content.split(/\s/).pop();
    if (lastWord?.startsWith("@")) {
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  }, [content]);

  const handleMentionClick = (username: string) => {
    const words = content.trim().split(/\s/);
    words.pop(); // remove last '@word'
    words.push(`@${username}`);
    const newContent = words.join(" ") + " ";
    setContent(newContent);
    setShowMentions(false);
    textareaRef.current?.focus();
  };

  return (
    <div className={cn("space-y-4", replyingTo ? "p-0" : "p-4")}>
      <Textarea
        ref={textareaRef}
        placeholder={replyingTo ? "Post your reply" : "What's happening?"}
        className="resize-none placeholder:text-xl cols border-none active:border-none shadow-none outline-none focus:border-none focus:outline-none focus-visible:ring-0"
        value={content}
        style={{ fontSize: 20 }}
        onChange={(e) => setContent(e.target.value)}
      />

      {showMentions && (
        <Popover open>
          <PopoverTrigger asChild>
            <div className="" />
          </PopoverTrigger>
          <PopoverContent
            className="w-64 p-2"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <div className="space-y-1">
              {otherUsers.map((user) => (
                <button
                  key={user.key}
                  className="w-full text-left px-2 py-1 hover:bg-orange-100 rounded"
                  onClick={() => handleMentionClick(user.username)}
                >
                  @{user.username}{" "}
                  <span className="text-sm text-gray-500">({user.name})</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}

      <div className="flex items-center">
        {!replyingTo && (
          <Select
            value={replyMode}
            onValueChange={(value) => {
              if (isValidReplyMode(value)) {
                setReplyMode(value as ShoutReplyType);
              } else setReplyMode(ShoutReplyType.EVERYONE);
            }}
          >
            <SelectTrigger className="w-[250px] border-none shadow-none">
              <SelectValue placeholder="Who can reply" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Who can reply</SelectLabel>
                {Object.values(ShoutReplyType).map((value) => {
                  const Icon = ShoutReplyIcons[value];
                  return (
                    <SelectItem
                      key={value}
                      value={value}
                      className="flex items-center gap-2"
                    >
                      <Icon className="text-orange-400" />
                      <span>{ShoutReplyLabels[value]}</span>
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        <Button
          onClick={handlePost}
          disabled={!content.trim() || loading}
          className="ml-auto"
        >
          {replyingTo ? "Reply" : "Shout"}
        </Button>
      </div>
    </div>
  );
}
