"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import api from "@/lib/api";

export default function FollowSection({ userKey }: { userKey: string }) {
  const { user: currentUser } = useUser();

  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    try {
      setLoading(true);
      const res = await api.post("/users/follow", {
        userToFollowKey: userKey,
      });
      console.log(res.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center p-4">
      <div className="flex items-center gap-2 ">
        <div className="font-bold">Following</div> <div>30</div>
      </div>
      {currentUser && currentUser.id !== userKey && (
        <Button
          className="rounded-full ml-auto"
          onClick={handleFollow}
          disabled={loading}
        >
          Follow
        </Button>
      )}
    </div>
  );
}
