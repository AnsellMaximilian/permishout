export interface Shout extends ShoutAttributes {
  key: string;
}

export interface ShoutAttributes {
  name: string;
  content: string;
  userId: string;
  createdAt: string;
  replyMode: string;
  username: string;
}

export enum ShoutReplyType {
  EVERYONE = "EVERYONE",
  FOLLOWERS = "FOLLOWERS",
  PEOPLE_FOLLOWED = "PEOPLE_FOLLOWED",
  MENTIONED = "MENTIONED",
}

export const ShoutReplyLabels: Record<ShoutReplyType, string> = {
  [ShoutReplyType.EVERYONE]: "Everyone",
  [ShoutReplyType.FOLLOWERS]: "Your followers",
  [ShoutReplyType.PEOPLE_FOLLOWED]: "People you follow",
  [ShoutReplyType.MENTIONED]: "Only people you mention",
};

export function isValidReplyMode(value: unknown): value is ShoutReplyType {
  return Object.values(ShoutReplyType).includes(value as ShoutReplyType);
}
