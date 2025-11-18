const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

// ----------------------------------------------------------
// Token helpers
// ----------------------------------------------------------
function saveTokens(tokens: { access_token: string; refresh_token: string }) {
  localStorage.setItem("tokens", JSON.stringify(tokens));
}

function readTokens(): { access_token?: string; refresh_token?: string } {
  try {
    return JSON.parse(localStorage.getItem("tokens") || "{}");
  } catch {
    return {};
  }
}

function getAccessToken(): string | null {
  return readTokens().access_token ?? null;
}

// ----------------------------------------------------------
// Refresh
// ----------------------------------------------------------
async function refreshToken() {
  const tokens = readTokens();
  const refresh = tokens.refresh_token;
  if (!refresh) return null;

  const response = await fetch(`${apiUrl}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refresh }),
  });

  if (!response.ok) return null;

  const data = await response.json().catch(() => null);
  if (data) saveTokens(data);
  return data;
}

// ----------------------------------------------------------
// Generic API handler
// ----------------------------------------------------------
interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: string;
}

async function apiRequest<T>(
  url: string,
  options: ApiOptions = {},
  requiresAuth = false
): Promise<T> {
  const fetchWithToken = async (token?: string) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    };

    if (requiresAuth && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers,
    });
  };

  const initialToken = requiresAuth ? getAccessToken() : null;
  let response = await fetchWithToken(initialToken ?? undefined);

  if (requiresAuth && response.status === 401) {
    const newTokens = await refreshToken();
    if (!newTokens) throw new Error("Autentisering misslyckades");
    response = await fetchWithToken(newTokens.access_token);
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Fel: ${response.status}`);
  }

  const raw = await response.text();
  if (!raw) return null as T;

  return JSON.parse(raw) as T;
}

// ----------------------------------------------------------
// Safe helper methods
// ----------------------------------------------------------
export const api = {
  get: <T>(path: string, auth = false) =>
    apiRequest<T>(`${apiUrl}${path}`, { method: "GET" }, auth),

  post: <T, B extends object>(path: string, body: B, auth = false) =>
    apiRequest<T>(`${apiUrl}${path}`, { method: "POST", body: JSON.stringify(body) }, auth),

  put: <T, B extends object>(path: string, body: B, auth = false) =>
    apiRequest<T>(`${apiUrl}${path}`, { method: "PUT", body: JSON.stringify(body) }, auth),

  delete: <T>(path: string, auth = false) =>
    apiRequest<T>(`${apiUrl}${path}`, { method: "DELETE" }, auth),
};

export const tokens = { saveTokens };
