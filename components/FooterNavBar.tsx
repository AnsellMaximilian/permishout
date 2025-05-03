"use client";

import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { HomeIcon, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function FooterNavBar() {
  const user = useUser();

  const pathname = usePathname();

  const isHome = pathname === "/home";
  const isProfile = user && pathname === `/profile/${user.user?.id}`;

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
              href={`/profile/${user.user?.id}`}
              className="flex items-center gap-2 hover:underline"
            >
              <User strokeWidth={isProfile ? 2 : 1} />
              <span className={cn(isProfile ? "font-bold" : "")}>Profile</span>
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
