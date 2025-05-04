"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/user";
import React from "react";

export default function TopicsPage() {
  const { currentUser } = useUser();
  return (
    <div className="bg-white rounded-md">
      <div className="border-border border-b p-4 flex justify-between items-center">
        <h2 className="font-bold">Topics</h2>
        {currentUser && currentUser.roles.includes("admin") && (
          <Button>Create Topic</Button>
        )}
      </div>

      <div className="p-4">swag</div>
    </div>
  );
}
