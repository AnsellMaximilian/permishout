"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";
import {
  isValidReplyMode,
  Shout,
  ShoutReplyLabels,
  ShoutReplyType,
} from "@/types/shout";
import api from "@/lib/api";
import { toastError } from "@/lib/utils";
import { toast } from "sonner";

export default function ShoutComposer() {
  const [content, setContent] = useState("");
  const [replyMode, setReplyMode] = useState<ShoutReplyType>(
    ShoutReplyType.EVERYONE
  );

  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    try {
      setLoading(true);
      const shout: Shout = await api.post("/shouts", { content, replyMode });
      console.log(shout);
      toast("Shout shouted.");
    } catch (error) {
      console.error(error);
      toastError("Something went wrong.");
    } finally {
      setLoading(false);
      setContent("");
      setReplyMode(ShoutReplyType.EVERYONE);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Textarea
        placeholder="What's happening?"
        className="resize-none placeholder:text-xl cols border-none active:border-none shadow-none outline-none focus:border-none focus:outline-none focus-visible:ring-0"
        value={content}
        style={{ fontSize: 20 }}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex justify-between items-center">
        <Select
          value={replyMode}
          onValueChange={(value) => {
            if (isValidReplyMode(value)) {
              setReplyMode(value as ShoutReplyType);
            } else setReplyMode(ShoutReplyType.EVERYONE);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Who can reply" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ShoutReplyType).map((value) => (
              <SelectItem key={value} value={value}>
                {ShoutReplyLabels[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handlePost} disabled={!content.trim() || loading}>
          Post
        </Button>
      </div>
    </div>
  );
}
