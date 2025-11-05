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
} from "@/types";

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
let tokens = JSON.parse(localStorage.getItem("tokens"));
let accessToken = tokens.access_token;

export async function loginClimber(payload: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${apiUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to log in climber");
  }

  const data: LoginResponse = await response.json();
  return data;
}

function saveTokens(tokens: { access_token: string; refresh_token: string }) {
  localStorage.setItem("tokens", JSON.stringify(tokens));
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

    if (!response.ok) {
      console.error("Refresh token request failed", response.status);
      return null;
    }

    const data = await response.json();
    saveTokens(data); // store the new tokens in localStorage
    return data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}

export async function registerClimber(payload: RegistrationRequest) {
  const response = await fetch(`${apiUrl}/climber/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error("Failed registration payload:", payload, "Response:", response);
    throw new Error(errorData?.message || "Failed to register climber");
  }
}

export async function getMyInfo(): Promise<MyInfoResponse | null> {
  if (!accessToken) {
    console.warn("No access token found");
    return null;
  }

  try {
    const response = await fetch(`${apiUrl}/climber/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      refreshToken();
      tokens = JSON.parse(localStorage.getItem("tokens"));
      accessToken = tokens.access_token;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch climber info. Please try again.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching climber info:", error);
    return null;
  }
}

export async function getClimberById(climberId: number) {
  if (!climberId) return null;

  try {
    const response = await fetch(`${apiUrl}/climber/${climberId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch climber. Please try again.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching climber:", error);
    return null;
  }
}

//createCompetition
export async function createCompetition(payload: CompetitionRequest) {
  if (!accessToken) {
    console.warn("No access token found");
    return null;
  }

  try {
    const response = await fetch(`${apiUrl}/competition`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      refreshToken();
      tokens = JSON.parse(localStorage.getItem("tokens"));
      accessToken = tokens.access_token;
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to create competition (${response.status}): ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating competition:", error);
    return null;
  }
}
export async function getCompetitions(name?: string, year?: string) {
  try {
    const params = new URLSearchParams();
    if (name) params.append("name", name);
    if (year) params.append("year", year);

    const response = await fetch(`${apiUrl}/competition?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch competitions. Please try again.");
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching competitions:", error);
    return [];
  }
}

export async function getCompRegistrationInfo(
  competitionId: number
): Promise<RegisterToCompResponse | null> {
  if (!accessToken) {
    console.warn("No access token found");
    return null;
  }

  const fetchInfo = async (token: string) => {
    const response = await fetch(`${apiUrl}/competition/${competitionId}/registration`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  };

  try {
    let response = await fetchInfo(accessToken);

    if (response.status === 401) {
      // Try refreshing token
      const newTokens = await refreshToken();
      if (!newTokens) return null;

      // Retry request with new token
      response = await fetchInfo(newTokens.access_token);
      if (!response.ok) throw new Error("Failed again after token refresh.");
    }

    if (!response.ok) {
      throw new Error("Failed to fetch competition registration info.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching competition registration info:", error);
    return null;
  }
}

export async function registerClimberToCompetition(competitionId: number, level: number) {
  if (!accessToken) {
    console.warn("No access token found");
    return null;
  }

  const fetchInfo = async (token: string) => {
    const response = await fetch(`${apiUrl}/competition/${competitionId}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ level }),
    });

    return response;
  };

  try {
    let response = await fetchInfo(accessToken);

    if (response.status === 401) {
      // Try refreshing token
      const newTokens = await refreshToken();
      if (!newTokens) return null;

      // Retry request with new token
      response = await fetchInfo(newTokens.access_token);
      if (!response.ok) throw new Error("Failed again after token refresh.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error registering to competition:", error);
    return null;
  }
}

//Seasons
export async function createSeason(payload: SeasonRequest) {
  if (!accessToken) {
    console.warn("No access token found");
    return null;
  }

  try {
    const response = await fetch(`${apiUrl}/season`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      refreshToken();
      tokens = JSON.parse(localStorage.getItem("tokens"));
      accessToken = tokens.access_token;
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to create season (${response.status}): ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating season:", error);
    return null;
  }
}

export async function getSeasons(payload: SeasonRequest): Promise<SeasonResponse[] | null> {
  if (!accessToken) {
    console.warn("No access token found");
    return null;
  }

  const queryParams = new URLSearchParams();
  if (payload.name) queryParams.append("name", payload.name);
  if (payload.year) queryParams.append("year", payload.year.toString());

  const fetchSeasons = async (token: string) => {
    return await fetch(`${apiUrl}/season?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  try {
    let response = await fetchSeasons(accessToken);

    if (response.status === 401) {
      const newTokens = await refreshToken();
      if (!newTokens) return null;

      response = await fetchSeasons(newTokens.access_token);
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch seasons (${response.status}): ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching seasons:", error);
    return null;
  }
}

export async function getSeasonById(seasonId: number): Promise<SeasonResponse | null> {
  const tokens = JSON.parse(localStorage.getItem("tokens") || "{}");
  const accessToken = tokens.access_token;

  const fetchById = async (token?: string) => {
    return await fetch(`${apiUrl}/season/${seasonId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  };

  try {
    let response = await fetchById(accessToken);

    if (response.status === 401 && accessToken) {
      const newTokens = await refreshToken();
      if (!newTokens) return null;

      response = await fetchById(newTokens.access_token);
    }

    if (!response.ok) {
      throw new Error("Failed to fetch season. Please try again.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching season:", error);
    return null;
  }
}

//Scores
export async function getScoresBatch(urlParams: UrlParams) {
  try {
    const response = await fetch(
      `${apiUrl}/competitions/${urlParams.comp_id}/level/${urlParams.level}/scores/batch`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch scores. Please try again.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching scores:", error);
    return null;
  }
}

export async function updateScore(urlParams: UrlParams, payload: ScoreRequest) {
  try {
    const response = await fetch(
      `${apiUrl}/competitions/${urlParams.comp_id}/level/${urlParams.level}/problems/${urlParams.problem_no}/score`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to update score (${response.status}): ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error update score:", error);
    return null;
  }
}

export async function updateScoreBatch(urlParams: UrlParams, payload: ScoreBatch) {
  try {
    const response = await fetch(
      `${apiUrl}/competitions/${urlParams.comp_id}/level/${urlParams.level}/scores/batch`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to update score (${response.status}): ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error update score:", error);
    return null;
  }
}
