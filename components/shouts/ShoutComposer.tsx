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
import { ShoutReplyLabels, ShoutReplyType } from "@/types/shout";

export default function ShoutComposer() {
  const [postText, setPostText] = useState("");
  const [replyOption, setReplyOption] = useState("everyone");

  const handlePost = () => {
    if (postText.trim()) {
      console.log("Posting:", postText);
      console.log("Who can reply:", replyOption);
      setPostText("");
      setReplyOption("everyone");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Textarea
        placeholder="What's happening?"
        className="resize-none placeholder:text-xl cols border-none active:border-none shadow-none outline-none focus:border-none focus:outline-none focus-visible:ring-0"
        value={postText}
        style={{ fontSize: 20 }}
        onChange={(e) => setPostText(e.target.value)}
      />

      <div className="flex justify-between items-center">
        <Select value={replyOption} onValueChange={setReplyOption}>
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

        <Button onClick={handlePost} disabled={!postText.trim()}>
          Post
        </Button>
      </div>
    </div>
  );
}
