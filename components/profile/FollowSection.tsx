"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import api from "@/lib/api";
import { toastError } from "@/lib/utils";

export default function FollowSection({ userKey }: { userKey: string }) {
  const { user: currentUser } = useUser();

  const [loading, setLoading] = useState(false);

  const [following, setFollowing] = useState<string[]>([]);
  const [followers, setFollowers] = useState<string[]>([]);

  const updateFollowData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/follow/status?userKey=${userKey}`);

      const followData = res.data as {
        following: string[];
        followers: string[];
      };

      setFollowers(followData.followers);
      setFollowing(followData.following);
    } catch {
      toastError("Error fetching follow data");
    } finally {
      setLoading(false);
    }
  }, [userKey]);

  useEffect(() => {
    updateFollowData();
  }, [updateFollowData]);

  console.log({ following, followers, id: currentUser?.id });

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
      await updateFollowData();
      setLoading(false);
    }
  };

  const handleUnfollow = async () => {
    try {
      setLoading(true);
      const res = await api.post("/users/unfollow", {
        userToUnfollowKey: userKey,
      });
      console.log(res.data);
    } catch (e) {
      console.log(e);
    } finally {
      await updateFollowData();
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center p-4 gap-4">
      <div className="flex items-center gap-2 ">
        <div className="font-bold">Followers</div> <div>{followers.length}</div>
      </div>
      <div className="flex items-center gap-2 ">
        <div className="font-bold">Following</div> <div>{following.length}</div>
      </div>
      {currentUser && currentUser.id !== userKey ? (
        !followers.includes(currentUser.id) ? (
          <Button
            className="rounded-full ml-auto"
            onClick={handleFollow}
            disabled={loading}
          >
            Follow
          </Button>
        ) : (
          <Button
            className="rounded-full ml-auto"
            onClick={handleUnfollow}
            disabled={loading}
            variant="outline"
          >
            Unfollow
          </Button>
        )
      ) : null}
    </div>
  );
}
