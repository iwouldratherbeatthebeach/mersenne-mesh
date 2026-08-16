export type Viewer = {
  id: string;
  displayName: string;
  email: string;
  image: string | null;
  publicHandle: string;
};

export type Health = {
  ok: boolean;
  authConfigured: boolean;
  googleConfigured: boolean;
  emailConfigured: boolean;
  databaseBound: boolean;
  schemaReady: boolean;
  explorationReady?: boolean;
  network: "validation" | "validation+exploration";
  operatorContact: string | null;
};

export type ContributionStats = {
  cpuCoreMilliseconds: number;
  gpuMilliseconds: number;
  candidates: number;
  factors: number;
  validatedUnits: number;
  pendingUnits?: number;
};
