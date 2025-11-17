import {
  CompetitionRequest,
  UrlParams,
  LoginRequest,
  LoginResponse,
  SignupResponse,
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
  try {
    const tokens = JSON.parse(localStorage.getItem("tokens") || "{}");
    if (!tokens.access_token) {
      console.error(`Hittade ingen token`);
      throw new Error(`Hittade ingen token`);
    }
    return tokens.access_token || null;
  } catch (error) {
    console.error(`Fel vid läsning av token:`, error);
    throw new Error(`Fel vid läsning av token`);
  }
}

export async function refreshToken(): Promise<{
  access_token: string;
  refresh_token: string;
} | null> {
  try {
    const tokens = JSON.parse(localStorage.getItem("tokens") || "{}");
    const refresh = tokens.refresh_token;

    if (!refresh) {
      console.error(`Hittade ingen token`);
      throw new Error(`Hittade ingen token`);
    }

    const response = await fetch(`${apiUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
    });

    if (!response.ok) {
      console.error(`Misslyckades att skapa ny token (${response.status})`);
      throw new Error(`Misslyckades att skapa ny token (${response.status})`);
    }

    try {
      const data = await response.json();
      saveTokens(data);
      return data;
    } catch (error) {
      console.error(`Fel vid parsning av token-svar:`, error);
      throw new Error(`Ogiltigt svar från servern`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error(`Oväntat fel vid uppdatering av token:`, error);
    throw new Error(`Misslyckades att uppdatera token`);
  }
}

async function fetchWithAuth(url: string, options: RequestInit): Promise<Response | null> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      console.error(`Misslyckades att hämta accessToken`);
      throw new Error(`Misslyckades att hämta accessToken`);
    }

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
      try {
        const newTokens = await refreshToken();
        if (!newTokens) {
          console.error(`Misslyckades att hämta ny token`);
          throw new Error(`Misslyckades att hämta ny token`);
        }

        response = await doFetch(newTokens.access_token);
      } catch (error) {
        console.error(`Fel vid token-uppdatering:`, error);
        throw error;
      }
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error(`Nätverksfel:`, error);
    throw new Error(`Nätverksfel vid autentiserad förfrågan`);
  }
}

export async function loginClimber(payload: LoginRequest): Promise<LoginResponse | null> {
  try {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.status === 422) {
      try {
        const errorData = await response.json();
        const detail = errorData.detail;
        if (Array.isArray(detail) && detail.length > 0) {
          const firstError = detail[0];
          const message = firstError.msg || "Valideringsfel";
          throw new Error(message);
        }
        throw new Error("Valideringsfel");
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Valideringsfel");
      }
    }

    if (!response.ok) {
      console.error(`Misslyckades att logga in (${response.status})`);
      throw new Error(`Misslyckades att logga in (${response.status})`);
    }

    const data = await response.json();
    await setTokenToLocalStorage(data);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error(`Nätverksfel vid registrering:`, error);
    throw new Error(`Misslyckades att ansluta till servern`);
  }
}

export async function signupClimber(payload: RegistrationRequest): Promise<SignupResponse | null> {
  try {
    const response = await fetch(`${apiUrl}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.status === 422) {
      try {
        const errorData = await response.json();
        const detail = errorData.detail;
        if (Array.isArray(detail) && detail.length > 0) {
          const firstError = detail[0];
          const message = firstError.msg || "Valideringsfel";
          throw new Error(message);
        }
        throw new Error("Valideringsfel");
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Valideringsfel");
      }
    }

    if (!response.ok) {
      console.error(`Misslyckades att registrera (${response.status})`);
      throw new Error(`Misslyckades att registrera (${response.status})`);
    }

    const data = await response.json();
    await setTokenToLocalStorage(data);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error(`Nätverksfel vid registrering:`, error);
    throw new Error(`Misslyckades att ansluta till servern`);
  }
}

async function setTokenToLocalStorage(data: { access_token: string; refresh_token: string }) {
  try {
    // Save tokens automatically on successful signup
    if (data.access_token && data.refresh_token) {
      saveTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });
    }
    return data;
  } catch (error) {
    console.error(`Fel vid parsning av registreringssvar:`, error);
    throw new Error(`Ogiltigt svar från servern`);
  }
}

export async function registerClimber(payload: RegistrationRequest) {
  try {
    const response = await fetch(`${apiUrl}/climber`, {
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

    try {
      return await response.json();
    } catch (error) {
      console.error(`Fel vid parsning av registreringssvar:`, error);
      return { success: false, message: "Ogiltigt svar från servern." };
    }
  } catch (error) {
    console.error(`Nätverksfel vid registrering:`, error);
    return { success: false, message: "Misslyckades att ansluta till servern." };
  }
}

export async function getMyInfo(): Promise<MyInfoResponse | null> {
  try {
    const response = await fetchWithAuth(`${apiUrl}/climber/me`, { method: "GET" });

    if (!response || !response.ok) {
      console.error(`Misslyckades att hämta klätterinfo (${response?.status || "unknown"})`);
      throw new Error(`Misslyckades att hämta klätterinfo (${response?.status || "unknown"})`);
    }

    try {
      return await response.json();
    } catch (error) {
      console.error(`Fel vid parsning av klätterinfo:`, error);
      throw new Error(`Ogiltigt svar från servern`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error(`Nätverksfel vid hämtning av klätterinfo:`, error);
    throw new Error(`Misslyckades att hämta klätterinfo`);
  }
}

export async function getClimberById(climberId: number) {
  try {
    const response = await fetch(`${apiUrl}/climber/${climberId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error(
        `Misslyckades att hämta klätter info via id: ${climberId} (${response.status})`
      );
      throw new Error(
        `Misslyckades att hämta klätter info via id: ${climberId} (${response.status})`
      );
    }

    try {
      return await response.json();
    } catch (error) {
      console.error(`Fel vid parsning av klätterinfo:`, error);
      throw new Error(`Ogiltigt svar från servern`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error(`Nätverksfel vid hämtning av klätterinfo:`, error);
    throw new Error(`Misslyckades att hämta klätterinfo`);
  }
}

export async function createCompetition(payload: CompetitionRequest) {
  try {
    const response = await fetchWithAuth(`${apiUrl}/competition`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!response || !response.ok) {
      console.error(`Misslyckades att skapa tävlingen (${response?.status || "unknown"})`);
      throw new Error(`Misslyckades att skapa tävlingen (${response?.status || "unknown"})`);
    }

    try {
      return await response.json();
    } catch (error) {
      console.error(`Fel vid parsning av tävlingssvar:`, error);
      throw new Error(`Ogiltigt svar från servern`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error(`Nätverksfel vid skapande av tävling:`, error);
    throw new Error(`Misslyckades att skapa tävling`);
  }
}

export async function getCompetitions(name?: string, year?: string) {
  try {
    const params = new URLSearchParams();
    if (name) params.append("name", name);
    if (year) params.append("year", year);

    const response = await fetch(`${apiUrl}/competition?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error(`Misslyckades att hämta tävlingar (${response.status})`);
      throw new Error(`Misslyckades att hämta tävlingar (${response.status})`);
    }

    try {
      return await response.json();
    } catch (error) {
      console.error(`Fel vid parsning av tävlingslista:`, error);
      throw new Error(`Ogiltigt svar från servern`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error(`Nätverksfel vid hämtning av tävlingar:`, error);
    throw new Error(`Misslyckades att hämta tävlingar`);
  }
}

export async function getCompRegistrationInfo(
  competitionId: number
): Promise<RegisterToCompResponse | null> {
  try {
    const response = await fetchWithAuth(`${apiUrl}/competition/${competitionId}/registration`, {
      method: "GET",
    });

    if (!response || !response.ok) {
      console.error(
        `Misslyckades att hämta info om du är anmäld till tävlingen (${response?.status || "unknown"})`
      );
      throw new Error(
        `Misslyckades att hämta info om du är anmäld till tävlingen (${response?.status || "unknown"})`
      );
    }

    try {
      return await response.json();
    } catch (error) {
      console.error(`Fel vid parsning av registreringsinfo:`, error);
      throw new Error(`Ogiltigt svar från servern`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error(`Nätverksfel vid hämtning av registreringsinfo:`, error);
    throw new Error(`Misslyckades att hämta registreringsinfo`);
  }
}

export async function checkRegistration(competitionId: number): Promise<boolean | null> {
  try {
    const response = await fetchWithAuth(
      `${apiUrl}/competition/${competitionId}/registration/check`,
      {
        method: "GET",
      }
    );
    if (!response || !response.ok) return null;

    try {
      return await response.json();
    } catch (error) {
      console.error(`Fel vid parsning av registreringskontroll:`, error);
      return null;
    }
  } catch (error) {
    console.error(`Nätverksfel vid kontroll av registrering:`, error);
    return null;
  }
}

export async function registerClimberToCompetition(competitionId: number, level: number) {
  try {
    const response = await fetchWithAuth(`${apiUrl}/competition/${competitionId}/register`, {
      method: "POST",
      body: JSON.stringify({ level }),
    });

    if (!response) return { success: false, message: "Autentisering krävs." };

    if (response.status === 409) {
      return { success: false, message: "Du är redan registrerad till tävlingen." };
    }

    if (!response.ok) {
      try {
        const text = await response.text();
        return { success: false, message: `Fel vid registrering: ${text}` };
      } catch (error) {
        console.error(`Fel vid läsning av felmeddelande:`, error);
        return { success: false, message: `Fel vid registrering (${response.status})` };
      }
    }

    try {
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error(`Fel vid parsning av registreringssvar:`, error);
      return { success: false, message: "Ogiltigt svar från servern." };
    }
  } catch (error) {
    console.error(`Nätverksfel vid registrering till tävling:`, error);
    return { success: false, message: "Misslyckades att ansluta till servern." };
  }
}

export async function createSeason(payload: SeasonRequest) {
  try {
    const response = await fetchWithAuth(`${apiUrl}/season`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!response || !response.ok) {
      console.error(`Misslyckades att skapa säsong (${response?.status || "unknown"})`);
      throw new Error(`Misslyckades att skapa säsong (${response?.status || "unknown"})`);
    }

    try {
      return await response.json();
    } catch (error) {
      console.error(`Fel vid parsning av säsongssvar:`, error);
      throw new Error(`Ogiltigt svar från servern`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error(`Nätverksfel vid skapande av säsong:`, error);
    throw new Error(`Misslyckades att skapa säsong`);
  }
}

export async function getSeasons(payload: SeasonRequest): Promise<SeasonResponse[] | null> {
  try {
    const params = new URLSearchParams();
    if (payload.name) params.append("name", payload.name);
    if (payload.year) params.append("year", payload.year.toString());

    const response = await fetchWithAuth(`${apiUrl}/season?${params.toString()}`, {
      method: "GET",
    });

    if (!response || !response.ok) {
      console.error(`Misslyckades att hämta säsong (${response?.status || "unknown"})`);
      throw new Error(`Misslyckades att hämta säsong (${response?.status || "unknown"})`);
    }

    try {
      return await response.json();
    } catch (error) {
      console.error(`Fel vid parsning av säsongslista:`, error);
      throw new Error(`Ogiltigt svar från servern`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error(`Nätverksfel vid hämtning av säsonger:`, error);
    throw new Error(`Misslyckades att hämta säsonger`);
  }
}

export async function getSeasonById(seasonId: number): Promise<SeasonResponse | null> {
  try {
    const response = await fetchWithAuth(`${apiUrl}/season/${seasonId}`, { method: "GET" });

    if (!response || !response.ok) {
      console.error(
        `Misslyckades att hämta säsong via id: ${seasonId} (${response?.status || "unknown"})`
      );
      throw new Error(
        `Misslyckades att hämta säsong via id: ${seasonId} (${response?.status || "unknown"})`
      );
    }

    try {
      return await response.json();
    } catch (error) {
      console.error(`Fel vid parsning av säsongsinfo:`, error);
      throw new Error(`Ogiltigt svar från servern`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error(`Nätverksfel vid hämtning av säsong:`, error);
    throw new Error(`Misslyckades att hämta säsong`);
  }
}

export async function updateSeasonById(
  seasonId: number,
  payload: SeasonRequest
): Promise<SeasonResponse | null> {
  try {
    const response = await fetchWithAuth(`${apiUrl}/season/${seasonId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    if (!response || !response.ok) {
      console.error(`Misslyckades att uppdatera säsong (${response?.status || "unknown"})`);
      throw new Error(`Misslyckades att uppdatera säsong (${response?.status || "unknown"})`);
    }

    try {
      return await response.json();
    } catch (error) {
      console.error(`Fel vid parsning av uppdateringssvar:`, error);
      throw new Error(`Ogiltigt svar från servern`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error(`Nätverksfel vid uppdatering av säsong:`, error);
    throw new Error(`Misslyckades att uppdatera säsong`);
  }
}

export async function deleteSeasonById(seasonId: number): Promise<SeasonResponse | null> {
  try {
    const response = await fetchWithAuth(`${apiUrl}/season/${seasonId}`, { method: "DELETE" });

    if (!response || !response.ok) {
      console.error(
        `Misslyckades att radera säsong via id: ${seasonId} (${response?.status || "unknown"})`
      );
      throw new Error(
        `Misslyckades att radera säsong via id: ${seasonId} (${response?.status || "unknown"})`
      );
    }

    // 204 No Content responses have no body, so return null
    if (response.status === 204 || response.status === 200) {
      try {
        const text = await response.text();
        // If response is empty, return null
        if (!text || text.trim() === "") {
          return null;
        }
        // Otherwise try to parse as JSON
        try {
          return JSON.parse(text);
        } catch (parseError) {
          console.error(`Fel vid parsning av raderingssvar:`, parseError);
          return null;
        }
      } catch (textError) {
        console.error(`Fel vid läsning av raderingssvar:`, textError);
        return null;
      }
    }

    return null;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error(`Nätverksfel vid radering av säsong:`, error);
    throw new Error(`Misslyckades att radera säsong`);
  }
}

export async function getScoresBatch(urlParams: UrlParams) {
  try {
    const { comp_id, level } = urlParams;
    const response = await fetchWithAuth(
      `${apiUrl}/competitions/${comp_id}/level/${level}/scores/batch`,
      {
        method: "GET",
      }
    );

    if (!response || !response.ok) {
      console.error(`Misslyckades att hämta scoreBatch (${response?.status || "unknown"})`);
      throw new Error(`Misslyckades att hämta scoreBatch (${response?.status || "unknown"})`);
    }

    try {
      return await response.json();
    } catch (error) {
      console.error(`Fel vid parsning av scoreBatch:`, error);
      throw new Error(`Ogiltigt svar från servern`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error(`Nätverksfel vid hämtning av scoreBatch:`, error);
    throw new Error(`Misslyckades att hämta scoreBatch`);
  }
}

export async function updateScore(urlParams: UrlParams, payload: ScoreRequest) {
  try {
    const { comp_id, level, problem_no } = urlParams;
    const response = await fetchWithAuth(
      `${apiUrl}/competitions/${comp_id}/level/${level}/problems/${problem_no}/score`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response) {
      throw new Error(`Misslyckades att uppdatera poäng`);
    }

    if (response.status === 422) {
      throw new Error(`Något ser fel ut med poängen. Vänligen se över!`);
    }

    if (!response.ok) {
      console.error(`Misslyckades att uppdatera poäng (${response.status})`);
      throw new Error(`Misslyckades att uppdatera poäng (${response.status})`);
    }

    try {
      return await response.json();
    } catch (error) {
      console.error(`Fel vid parsning av poängsvar:`, error);
      throw new Error(`Ogiltigt svar från servern`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error(`Nätverksfel vid uppdatering av poäng:`, error);
    throw new Error(`Misslyckades att uppdatera poäng`);
  }
}

export async function updateScoreBatch(
  urlParams: UrlParams,
  payload: ScoreBatch
): Promise<ProblemScoreBulkResult[] | null> {
  try {
    const { comp_id, level } = urlParams;
    const response = await fetchWithAuth(
      `${apiUrl}/competitions/${comp_id}/level/${level}/scores/batch`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response || !response.ok) {
      console.error(`Misslyckades att uppdatera scoreBatch (${response?.status || "unknown"})`);
      throw new Error(`Misslyckades att uppdatera scoreBatch (${response?.status || "unknown"})`);
    }

    try {
      return await response.json();
    } catch (error) {
      console.error(`Fel vid parsning av scoreBatch-svar:`, error);
      throw new Error(`Ogiltigt svar från servern`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error(`Nätverksfel vid uppdatering av scoreBatch:`, error);
    throw new Error(`Misslyckades att uppdatera scoreBatch`);
  }
}
