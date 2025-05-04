import {
  AtSign,
  Earth,
  LucideProps,
  ShieldCheck,
  // UserCheck,
} from "lucide-react";

export interface Shout extends ShoutAttributes {
  key: string;
}

export interface ShoutAttributes {
  name: string;
  content: string;
  userId: string;
  createdAt: string;
  replyMode: ShoutReplyType;
  username: string;
  replyTo?: string;
  replyToUsername?: string;
}

export enum ShoutReplyType {
  EVERYONE = "EVERYONE",
  // PEOPLE_FOLLOWED = "PEOPLE_FOLLOWED",
  MENTIONED = "MENTIONED",
  ADMIN = "ADMIN",
}

export const ShoutReplyLabels: Record<ShoutReplyType, string> = {
  [ShoutReplyType.EVERYONE]: "Everyone",
  // [ShoutReplyType.PEOPLE_FOLLOWED]: "People you follow",
  [ShoutReplyType.MENTIONED]: "Only people you mention",
  [ShoutReplyType.ADMIN]: "Verified accunts (admins).",
};

export function isValidReplyMode(value: unknown): value is ShoutReplyType {
  return Object.values(ShoutReplyType).includes(value as ShoutReplyType);
}

export const ShoutReplyIcons: Record<
  ShoutReplyType,
  React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >
> = {
  [ShoutReplyType.EVERYONE]: Earth,
  // [ShoutReplyType.PEOPLE_FOLLOWED]: UserCheck,
  [ShoutReplyType.MENTIONED]: AtSign,
  [ShoutReplyType.ADMIN]: ShieldCheck,
};
