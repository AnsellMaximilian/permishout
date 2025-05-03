import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { X } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateUsername(username: string): boolean {
  const regex = /^[a-zA-Z0-9_]{4,15}$/;
  return regex.test(username);
}
export function splitName(name: string): {
  firstName: string;
  lastName: string;
} {
  const parts = name.trim().split(/\s+/);
  const firstName = parts[0] || "";
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
  return { firstName, lastName };
}

export function toastError(message: string) {
  toast(message, {
    style: {
      backgroundColor: "#f44336",
      color: "#fff",
    },
    icon: <X />,
  });
}

export function joinName(firstName?: string, lastName?: string): string {
  return [firstName?.trim(), lastName?.trim()].filter(Boolean).join(" ");
}

export function sortByDateDesc<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any>,
  K extends keyof T
>(array: T[], key: K): T[] {
  return [...array].sort((a, b) => {
    const dateA = new Date(a[key] as string).getTime();
    const dateB = new Date(b[key] as string).getTime();
    return dateB - dateA;
  });
}

export function getCountryFromKey(key: string) {
  return key.split("-")[1] || "Not specified";
}
