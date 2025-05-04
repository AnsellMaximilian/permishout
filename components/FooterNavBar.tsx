"use client";

import { useUser } from "@/hooks/user";
import { cn } from "@/lib/utils";
import { HomeIcon, Tag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function FooterNavBar() {
  const { currentUser } = useUser();

  const pathname = usePathname();

  const isHome = pathname === "/home";
  const isProfile = currentUser && pathname === `/profile/${currentUser?.key}`;
  const isTopic = currentUser && pathname.startsWith("/topic");

  return (
    <footer className="p-4 bg-white container mx-auto max-w-2xl mt-4 rounded-md">
      <nav>
        <ul className="flex gap-8 items-center justify-start">
          <li>
            <Link
              href="/home"
              className="flex items-center gap-2 hover:underline"
            >
              <HomeIcon strokeWidth={isHome ? 2 : 1} />
              <span className={cn(isHome ? "font-bold" : "")}>Home</span>
            </Link>
          </li>
          <li>
            <Link
              href={`/profile/${currentUser?.key}`}
              className="flex items-center gap-2 hover:underline"
            >
              <User strokeWidth={isProfile ? 2 : 1} />
              <span className={cn(isProfile ? "font-bold" : "")}>Profile</span>
            </Link>
          </li>
          <li>
            <Link
              href={`/topic`}
              className="flex items-center gap-2 hover:underline"
            >
              <Tag strokeWidth={isTopic ? 2 : 1} />
              <span className={cn(isTopic ? "font-bold" : "")}>Topics</span>
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
