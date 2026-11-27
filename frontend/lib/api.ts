import type {
  GenerationResult,
  Plan,
  PlanInput,
  Subscription,
  User,
  UserCreateRequest,
  Waypoint,
  WaypointInput,
} from "./types";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const OFFLINE_MESSAGE = "Serverul nu răspunde. Pornește backend-ul (web-api) pe portul 8080.";

function messageFor(status: number, body: unknown): string {
  // GlobalExceptionHandler trimite mesajul ca text simplu.
  if (typeof body === "string") {
    const text = body.trim();
    if (text && text.length < 300 && !text.startsWith("<")) return text;
  }
  if (body && typeof body === "object" && "message" in body && typeof body.message === "string" && body.message) {
    return body.message;
  }
  if (status === 404) return "Nu am găsit ce căutai.";
  if (status === 409) return "Operația intră în conflict cu datele existente.";
  if (status >= 500) return OFFLINE_MESSAGE;
  return `Cererea a eșuat (${status}).`;
}

async function request<T>(path: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const { json, headers, ...rest } = init ?? {};
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      ...rest,
      headers: {
        Accept: "application/json",
        ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: json !== undefined ? JSON.stringify(json) : rest.body,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, OFFLINE_MESSAGE, null);
  }

  let body: unknown = null;
  if (res.status !== 204) {
    const type = res.headers.get("content-type") ?? "";
    body = type.includes("json") ? await res.json().catch(() => null) : await res.text().catch(() => "");
  }

  if (!res.ok) throw new ApiError(res.status, messageFor(res.status, body), body);
  return body as T;
}

export const api = {
  pricing: () => request<Plan[]>("/pricing"),

  plans: {
    list: () => request<Plan[]>("/plans"),
    get: (id: number) => request<Plan>(`/plans/${id}`),
    create: (plan: PlanInput) => request<Plan>("/plans", { method: "POST", json: plan }),
    update: (id: number, plan: PlanInput) => request<Plan>(`/plans/${id}`, { method: "PUT", json: plan }),
    remove: (id: number) => request<void>(`/plans/${id}`, { method: "DELETE" }),
  },

  users: {
    list: () => request<User[]>("/users"),
    get: (id: number) => request<User>(`/users/${id}`),
    create: (data: UserCreateRequest) => request<User>("/users", { method: "POST", json: data }),
    update: (id: number, user: Omit<User, "id">) =>
      request<User>(`/users/${id}`, { method: "PUT", json: { id, ...user } }),
  },

  subscriptions: {
    list: () => request<Subscription[]>("/subscriptions"),
    get: (id: number) => request<Subscription>(`/subscriptions/${id}`),
    update: (id: number, sub: Omit<Subscription, "id">) =>
      request<Subscription>(`/subscriptions/${id}`, { method: "PUT", json: sub }),
    remove: (id: number) => request<void>(`/subscriptions/${id}`, { method: "DELETE" }),
    changePlan: (userId: number, planId: number) =>
      request<Subscription>(`/subscriptions/user/${userId}/change-plan`, { method: "POST", json: { planId } }),
  },

  waypoints: {
    list: () => request<Waypoint[]>("/waypoints"),
    create: (data: WaypointInput) => request<Waypoint>("/waypoints", { method: "POST", json: data }),
    update: (id: number, data: WaypointInput) => request<Waypoint>(`/waypoints/${id}`, { method: "PUT", json: data }),
    remove: (id: number) => request<void>(`/waypoints/${id}`, { method: "DELETE" }),
  },

  generations: {
    canGenerate: (userId: number) => request<boolean>(`/users/${userId}/can-generate`),
    /** 201 = FREE / EXTRA; 402 = LIMIT_REACHED (aruncă ApiError cu GenerationResult în body). */
    request: (userId: number, documentsCount: number, acceptExtra: boolean) =>
      request<GenerationResult>(`/users/${userId}/generations`, {
        method: "POST",
        json: { documentsCount, acceptExtra },
      }),
  },
};

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "A apărut o eroare neașteptată.";
}
