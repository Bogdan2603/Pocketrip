// Oglindesc DTO-urile din backend/web-api (ro.pocketrip.dto).

export type Plan = {
  id: number;
  name: string;
  price: number;
  /** null = nelimitat */
  maxUsesPerDay: number | null;
  /** null = nelimitat */
  maxUsesPerMonth: number | null;
  mapEnabled: boolean;
  pdfExportEnabled: boolean;
  extraPrice: number;
};

export type PlanInput = Omit<Plan, "id">;

export type Role = "USER" | "ADMIN";
export type Language = "ro" | "en";

export type User = {
  id: number;
  email: string;
  role: Role;
  displayName: string | null;
  preferredLanguage: Language;
};

export type UserCreateRequest = {
  email: string;
  password: string;
  role?: Role;
  displayName?: string;
  preferredLanguage?: Language;
};

export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED";

export type Subscription = {
  id: number;
  userId: number;
  planId: number;
  startDate: string;
  endDate: string | null;
  status: SubscriptionStatus;
};

export type Waypoint = {
  id: number;
  name: string;
  city: string;
  countryCode: string;
};

export type WaypointInput = Omit<Waypoint, "id">;

export type GenerationOutcome = "FREE" | "EXTRA" | "LIMIT_REACHED";

export type GenerationResult = {
  outcome: GenerationOutcome;
  price: number;
  generationId: number | null;
};
