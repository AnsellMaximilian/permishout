import { PermishoutUser } from "@/types/user";
import React from "react";
import icon from "@/assets/images/permishout-icon.svg";
import Image from "next/image";
import ShoutItem from "@/components/shouts/ShoutItem";
import { mockShouts } from "@/const/shout";
import { Cake, Calendar, MapPin } from "lucide-react";
import IconText from "@/components/IconText";
import { format } from "date-fns";
import api from "@/lib/api";
import { notFound } from "next/navigation";

export default async function ProfilePage({
  params,
}: {
  params: { key: string };
}) {
  const { key } = params;
  let user: null | PermishoutUser = null;

  try {
    const res = await api.get(`/users?userKey=${key}`);
    user = res.data as PermishoutUser;
  } catch {
    user = null;
  }

  if (!user) notFound();
  return (
    <div className="mx-auto max-w-2xl bg-white mt-4 rounded-md">
      <div className="border-border border-b">
        <div className="flex items-center flex-col gap-1 bg-amber-100 p-4 ">
          <Image src={icon} width={100} height={100} alt="Icon" />
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>

        <div className="p-4 flex gap-2 justify-between flex-wrap">
          <IconText icon={MapPin} text="Indonesia" />
          <IconText icon={Cake} text={`Born ${user.yearBorn}`} />
          <IconText
            icon={Calendar}
            text={`Joined ${format(new Date(user.createdAt), "MMMM yyyy")}`}
          />
        </div>

        <div className="flex items-center gap-2 p-4">
          <div className="font-bold">Following</div> <div>30</div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {mockShouts.map((shout) => (
          <ShoutItem key={shout.key} shout={shout} />
        ))}
      </div>
    </div>
  );
}
