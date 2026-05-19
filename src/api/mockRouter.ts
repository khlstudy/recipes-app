import { recipesHandler } from "./handlers/recipesHandler";
import { authHandler } from "./handlers/authHandler";
import { favoritesHandler } from "./handlers/favoritesHandler";
import { usersHandler } from "./handlers/usersHandler";

type Handler = (_params: string[], _body: unknown) => unknown;

// "METHOD /path/:param" — colons mark captured segments
const routes: Record<string, Handler> = {
  "GET /api/recipes": (_, b) =>
    recipesHandler.getAll(b as Record<string, unknown>),
  "GET /api/recipes/:id": ([id]) => recipesHandler.getById(id),
  "POST /api/recipes": (_, b) =>
    recipesHandler.create(b as Parameters<typeof recipesHandler.create>[0]),
  "PUT /api/recipes/:id": ([id], b) =>
    recipesHandler.update(id, b as Parameters<typeof recipesHandler.update>[1]),
  "DELETE /api/recipes/:id": ([id]) => recipesHandler.remove(id),
  "GET /api/recipes/:id/comments": ([id]) => recipesHandler.getComments(id),
  "POST /api/recipes/:id/comments": ([id], b) =>
    recipesHandler.addComment(
      id,
      b as Parameters<typeof recipesHandler.addComment>[1]
    ),

  "POST /api/auth/login": (_, b) =>
    authHandler.login(b as Parameters<typeof authHandler.login>[0]),
  "POST /api/auth/register": (_, b) =>
    authHandler.register(b as Parameters<typeof authHandler.register>[0]),

  "GET /api/users/:id": ([id]) => usersHandler.getProfile(id),
  "PUT /api/users/:id/preferences": ([id], b) =>
    usersHandler.updatePreferences(
      id,
      b as Parameters<typeof usersHandler.updatePreferences>[1]
    ),
  "GET /api/users/:id/favorites": ([id]) => favoritesHandler.getFavorites(id),
  "POST /api/users/:id/favorites": ([id], b) =>
    favoritesHandler.add(id, b as Parameters<typeof favoritesHandler.add>[1]),
  "DELETE /api/users/:id/favorites/:recipeId": ([id, recipeId]) =>
    favoritesHandler.remove(id, recipeId),
  "GET /api/users/:id/history": ([id]) => usersHandler.getHistory(id),
  "POST /api/users/:id/history": ([id], b) =>
    usersHandler.addHistory(
      id,
      b as Parameters<typeof usersHandler.addHistory>[1]
    ),
  "GET /api/users/:id/collections": ([id]) => usersHandler.getCollections(id),
  "POST /api/users/:id/collections": ([id], b) =>
    usersHandler.createCollection(
      id,
      b as Parameters<typeof usersHandler.createCollection>[1]
    ),
  "PUT /api/users/:id/collections/:colId": ([id, colId], b) =>
    usersHandler.updateCollection(
      id,
      colId,
      b as Parameters<typeof usersHandler.updateCollection>[2]
    ),
};

// Build a regex + param-name list from a route pattern like "GET /api/users/:id/favorites"
function buildMatcher(pattern: string): {
  method: string;
  regex: RegExp;
  params: string[];
} {
  const [method, path] = pattern.split(" ");
  const params: string[] = [];
  const regexStr = path.replace(/:([^/]+)/g, (_, name) => {
    params.push(name);
    return "([^/]+)";
  });
  return { method, regex: new RegExp(`^${regexStr}$`), params };
}

const compiled = Object.entries(routes).map(([pattern, handler]) => ({
  ...buildMatcher(pattern),
  handler,
}));

const MOCK_DELAY_MS = 80;

export async function mockRouter<T>(
  path: string,
  method: string,
  body?: unknown
): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  // Strip query string before matching; body carries params for GET
  const [pathname, qs] = path.split("?");
  const parsedBody =
    method.toUpperCase() === "GET" && qs
      ? Object.fromEntries(new URLSearchParams(qs))
      : body;

  for (const { method: m, regex, params, handler } of compiled) {
    if (m !== method.toUpperCase()) continue;
    const match = pathname.match(regex);
    if (match) {
      const captured = params.map((_, i) => match[i + 1]);
      return handler(captured, parsedBody) as T;
    }
  }

  throw {
    success: false,
    message: `No mock route for ${method} ${path}`,
    code: "NOT_FOUND",
    statusCode: 404,
  };
}
