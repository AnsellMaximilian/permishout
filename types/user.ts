export type PermishoutUser = {
  key: string;
  name: string;
  email: string;
  createdAt: string;
} & PermishoutUserAttributes;

export type PermishoutUserAttributes = {
  yearBorn: number;
  country: string;
  username: string;
};
