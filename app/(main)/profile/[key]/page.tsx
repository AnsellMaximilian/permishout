import { PermishoutUser } from "@/types/user";
import React from "react";
import icon from "@/assets/images/permishout-icon.svg";
import Image from "next/image";
import ShoutItem from "@/components/shouts/ShoutItem";
import { Cake, Calendar, MapPin } from "lucide-react";
import IconText from "@/components/IconText";
import { format } from "date-fns";
import api from "@/lib/api";
import { notFound } from "next/navigation";
import { Shout } from "@/types/shout";
import { getCountryFromKey } from "@/lib/utils";
import FollowSection from "@/components/profile/FollowSection";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  let user: null | PermishoutUser = null;
  try {
    const res = await api.get(`/users?userKey=${key}`);
    user = res.data as PermishoutUser;
  } catch {
    user = null;
  }

  if (!user) notFound();

  const shouts: Shout[] = (await api.get(`/shouts?shouterKey=${key}`)).data;

  return (
    <div className="bg-white rounded-md">
      <div className="border-border border-b">
        <div className="flex items-center flex-col gap-1 bg-amber-100 p-4 rounded-t-md">
          <Image src={icon} width={100} height={100} alt="Icon" />
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>

        <div className="p-4 flex gap-2 justify-between flex-wrap">
          <IconText icon={MapPin} text={getCountryFromKey(user.country)} />
          <IconText icon={Cake} text={`Born ${user.yearBorn}`} />
          <IconText
            icon={Calendar}
            text={`Joined ${format(new Date(user.createdAt), "MMMM yyyy")}`}
          />
        </div>

        <FollowSection userKey={key} />
      </div>
      <div className="flex flex-col gap-4">
        {shouts.map((shout) => (
          <ShoutItem key={shout.key} shout={shout} />
        ))}
      </div>
    </div>
  );
}
