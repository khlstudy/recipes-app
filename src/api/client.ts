import { mockRouter } from "./mockRouter";

const API_URL = import.meta.env.VITE_API_URL as string | undefined;

export interface RequestOptions extends Omit<RequestInit, "body"> {
  token?: string;
  body?: unknown;
  params?: Record<string, string | number | boolean | string[]>;
}

function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | string[]>
): string {
  if (!params || Object.keys(params).length === 0) return path;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((v) => query.append(key, String(v)));
    } else {
      query.set(key, String(value));
    }
  }
  return `${path}?${query.toString()}`;
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, token, params, ...rest } = options;

  if (!API_URL) {
    const fullPath = buildUrl(path, params);
    return mockRouter<T>(fullPath, method, body);
  }

  const url = buildUrl(`${API_URL}${path}`, params);
  const res = await fetch(url, {
    ...rest,
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(rest.headers ?? {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) throw await res.json();
  return res.json() as Promise<T>;
}
