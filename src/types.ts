export type Viewer = {
  displayName: string;
  email: string;
  image: string | null;
};

export type Health = {
  ok: boolean;
  authConfigured: boolean;
  databaseBound: boolean;
  network: "validation";
  operatorContact: string | null;
};
