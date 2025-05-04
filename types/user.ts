export type PermishoutUser = {
  key: string;
  name: string;
  email: string;
  createdAt: string;
} & PermishoutUserAttributes &
  PermishoutUserExtraProperties;

export type PermishoutUserAttributes = {
  yearBorn: number;
  country: string;
  username: string;
};

export type PermishoutUserExtraProperties = {
  roles: string[];
};
