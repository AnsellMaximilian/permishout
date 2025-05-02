import { PermishoutUser } from "@/types/user";
import React from "react";
import icon from "@/assets/images/permishout-icon.svg";
import Image from "next/image";
import ShoutItem from "@/components/shouts/ShoutItem";
import { mockShouts } from "@/const/shout";

const mockUser: PermishoutUser = {
  name: "Jane Doe",
  username: "janed",
  email: "jane@example.com",
  yearBorn: 1995,
  country: "USA",
};

export default function ProfilePage() {
  const user = mockUser;

  return (
    <div className="mx-auto max-w-2xl bg-white mt-4 rounded-md">
      <div className="border-border border-b">
        <div className="flex items-center flex-col gap-1 bg-amber-100 p-4 ">
          <Image src={icon} width={100} height={100} alt="Icon" />
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>

        <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground p-4">
          <div className="flex justify-between">
            <span className="font-medium text-foreground">Email:</span>
            <span>{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-foreground">Year Born:</span>
            <span>{user.yearBorn}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-foreground">Country:</span>
            <span>{user.country}</span>
          </div>
        </div>
      </div>
      <div className="mt-1 flex flex-col gap-4">
        {mockShouts.map((shout) => (
          <ShoutItem key={shout.key} shout={shout} />
        ))}
      </div>
    </div>
  );
}
