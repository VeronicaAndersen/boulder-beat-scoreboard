import {
  CompetitionRequest,
  UrlParams,
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
  ScoreRequest,
  SeasonRequest,
  SeasonResponse,
  ScoreBatch,
  MyInfoResponse,
  RegisterToCompResponse,
  ProblemScoreBulkResult,
} from "@/types";

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

function saveTokens(tokens: { access_token: string; refresh_token: string }) {
  localStorage.setItem("tokens", JSON.stringify(tokens));
}

function getAccessToken(): string | null {
  const tokens = JSON.parse(localStorage.getItem("tokens") || "{}");
  return tokens.access_token || null;
}

export async function refreshToken(): Promise<{
  access_token: string;
  refresh_token: string;
} | null> {
  const tokens = JSON.parse(localStorage.getItem("tokens") || "{}");
  const refresh = tokens.refresh_token;
  if (!refresh) return null;

  try {
    const response = await fetch(`${apiUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    saveTokens(data);
    return data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}

async function fetchWithAuth(url: string, options: RequestInit): Promise<Response | null> {
  const accessToken = getAccessToken();
  if (!accessToken) return null;

  const doFetch = (token: string) =>
    fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

  let response = await doFetch(accessToken);

  if (response.status === 401) {
    const newTokens = await refreshToken();
    if (!newTokens) return null;

    response = await doFetch(newTokens.access_token);
  }

  return response;
}

export async function loginClimber(payload: LoginRequest): Promise<LoginResponse | null> {
  const response = await fetch(`${apiUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) return await response.json().catch(() => null);
  return await response.json();
}

export async function registerClimber(payload: RegistrationRequest) {
  const response = await fetch(`${apiUrl}/climber/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (response.status === 409) {
    return { success: false, message: "Detta namnet är redan taget." };
  }
  if (!response.ok) {
    return { success: false, message: "Något gick fel. Försök igen." };
  }
  return await response.json();
}

export async function getMyInfo(): Promise<MyInfoResponse | null> {
  const response = await fetchWithAuth(`${apiUrl}/climber/me`, { method: "GET" });
  if (!response || !response.ok) return null;
  return await response.json();
}

export async function getClimberById(climberId: number) {
  try {
    const response = await fetch(`${apiUrl}/climber/${climberId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch climber.");
    return await response.json();
  } catch (error) {
    console.error("Error fetching climber:", error);
    return null;
  }
}

export async function createCompetition(payload: CompetitionRequest) {
  const response = await fetchWithAuth(`${apiUrl}/competition`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response || !response.ok) return null;
  return await response.json();
}

export async function getCompetitions(name?: string, year?: string) {
  const params = new URLSearchParams();
  if (name) params.append("name", name);
  if (year) params.append("year", year);

  try {
    const response = await fetch(`${apiUrl}/competition?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch competitions.");
    return await response.json();
  } catch (error) {
    console.error("Error fetching competitions:", error);
    return [];
  }
}

export async function getCompRegistrationInfo(
  competitionId: number
): Promise<RegisterToCompResponse | null> {
  const response = await fetchWithAuth(`${apiUrl}/competition/${competitionId}/registration`, {
    method: "GET",
  });

  if (!response || !response.ok) return null;
  return await response.json();
}

export async function registerClimberToCompetition(competitionId: number, level: number) {
  const response = await fetchWithAuth(`${apiUrl}/competition/${competitionId}/register`, {
    method: "POST",
    body: JSON.stringify({ level }),
  });

  if (!response) return { success: false, message: "Autentisering krävs." };

  if (response.status === 409) {
    return { success: false, message: "Du är redan registrerad till tävlingen." };
  }

  if (!response.ok) {
    const text = await response.text();
    return { success: false, message: `Fel vid registrering: ${text}` };
  }

  const data = await response.json();
  return { success: true, data };
}

export async function createSeason(payload: SeasonRequest) {
  const response = await fetchWithAuth(`${apiUrl}/season`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response || !response.ok) return null;
  return await response.json();
}

export async function getSeasons(payload: SeasonRequest): Promise<SeasonResponse[] | null> {
  const params = new URLSearchParams();
  if (payload.name) params.append("name", payload.name);
  if (payload.year) params.append("year", payload.year.toString());

  const response = await fetchWithAuth(`${apiUrl}/season?${params.toString()}`, { method: "GET" });
  if (!response || !response.ok) return null;
  return await response.json();
}

export async function getSeasonById(seasonId: number): Promise<SeasonResponse | null> {
  const response = await fetchWithAuth(`${apiUrl}/season/${seasonId}`, { method: "GET" });
  if (!response || !response.ok) return null;
  return await response.json();
}

export async function getScoresBatch(urlParams: UrlParams) {
  const { comp_id, level } = urlParams;
  const response = await fetchWithAuth(
    `${apiUrl}/competitions/${comp_id}/level/${level}/scores/batch`,
    {
      method: "GET",
    }
  );
  if (!response || !response.ok) return null;

  return await response.json();
}

export async function updateScore(urlParams: UrlParams, payload: ScoreRequest) {
  const { comp_id, level, problem_no } = urlParams;
  try {
    const response = await fetch(
      `${apiUrl}/competitions/${comp_id}/level/${level}/problems/${problem_no}/score`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) throw new Error(`Failed to update score (${response.status})`);
    return await response.json();
  } catch (error) {
    console.error("Error update score:", error);
    return null;
  }
}

export async function updateScoreBatch(
  urlParams: UrlParams,
  payload: ScoreBatch
): Promise<ProblemScoreBulkResult[] | null> {
  const { comp_id, level } = urlParams;

  try {
    const response = await fetchWithAuth(
      `${apiUrl}/competitions/${comp_id}/level/${level}/scores/batch`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response || !response.ok) {
      console.error("Failed response", response);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating score batch:", error);
    return null;
  }
}
