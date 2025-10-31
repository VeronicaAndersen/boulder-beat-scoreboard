import { CompetitionRequest, UrlParams, LoginRequest, LoginResponse, RegistrationRequest, ScoreRequest, SeasonRequest, SeasonResponse, ScoreBatch } from "@/types";

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

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
// Refresh token Not working properly yet
export async function refreshToken() {
  const tokens = JSON.parse(localStorage.getItem("tokens") || "{}");
  const refresh = tokens.refresh_token;
  console.log("Refreshing token with refresh token:", refresh);
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

    saveTokens(data);
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

export async function getMyInfo() {
  const tokens = JSON.parse(localStorage.getItem("tokens"));
  const accessToken = tokens.access_token;

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

//TODO: name?: string, year?: string is not used yet
export async function getCompetitions(name?: string, year?: string) {
  try {
    const response = await fetch(`${apiUrl}/competition`, {
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

export async function registerClimberToCompetition(competitionId: number) {
  try {
    const response = await fetch(`${apiUrl}/competition/${competitionId}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to register to competition. Please try again.");
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
  const tokens = JSON.parse(localStorage.getItem("tokens"));
  const accessToken = tokens.access_token;

  if (!accessToken) {
    console.warn("No access token found");
    return null;
  }

  const makeRequest = async (token: string) => {
    return fetch(`${apiUrl}/season`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  };

  try {
    let response = await makeRequest(accessToken);

    // If token expired → try refresh once
    if (response.status === 401) {
      const newTokens = await refreshToken();
      if (!newTokens) throw new Error("Token refresh failed");

      response = await makeRequest(newTokens.access_token);
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
//TODO: use payload that consist of name and year
export async function getSeasons(payload: SeasonRequest): Promise<SeasonResponse[] | null> {
  const tokens = JSON.parse(localStorage.getItem("tokens"));
  const accessToken = tokens.access_token;

  if (!accessToken) {
    console.warn("No access token found");
    return null;
  }

  const makeRequest = async (token: string) => {
    return fetch(`${apiUrl}/season`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  try {
    let response = await makeRequest(accessToken);

    // If token expired → try refresh once
    if (response.status === 401) {
      const newTokens = await refreshToken();
      if (!newTokens) throw new Error("Token refresh failed");

      response = await makeRequest(newTokens.access_token);
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

export async function getSeasonById(seasonId: number) {
  try {
    const response = await fetch(`${apiUrl}/season/${seasonId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

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

//createCompetition
export async function createCompetition(payload: CompetitionRequest) {
  const tokens = JSON.parse(localStorage.getItem("tokens"));
  const accessToken = tokens.access_token;

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

//Scores
export async function updateScore(urlParams: UrlParams,payload: ScoreRequest) {
  try {
    const response = await fetch(
      `${apiUrl}/competitions/${urlParams.comp_id}
                                  /level/${urlParams.level_no}
                                  /problems/${urlParams.problem_no}/score`,
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

export async function updateScoreBatch(
  urlParams: UrlParams,
  payload: ScoreBatch
) {
  try {
    const response = await fetch(
      `${apiUrl}/competitions/${urlParams.comp_id}
                                  /level/${urlParams.level_no}/scores/batch`,
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
