import { LoginData, RegistrationData } from "@/types";

const apiToken = import.meta.env.VITE_REACT_APP_API_TOKEN;
const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

export interface LoginResponse {
  token: string;
  id: string;
  message?: string;
  name?: string;
}

export async function loginClimber(payload: LoginData): Promise<LoginResponse> {
  const response = await fetch(`${apiUrl}/Climbers/Login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
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

export async function registerClimber(payload: RegistrationData): Promise<void> {
  const response = await fetch(`${apiUrl}/Climbers/Register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error("Failed registration payload:", payload, "Response:", response);
    throw new Error(errorData?.message || "Failed to register climber");
  }
}

export async function getClimberById(climberId: string) {
  if (!climberId) return null;

  try {
    const response = await fetch(`${apiUrl}/Climbers/Climber/${climberId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch climber. Please try again.");
    }

    const data = await response.json();
    return data.climber;
  } catch (error) {
    console.error("Error fetching climber:", error);
    return null;
  }
}

export async function getGrades(): Promise<string[]> {
  try {
    const response = await fetch(`${apiUrl}/Grades/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch grades. Please try again.");
    }

    const data = await response.json();
    return data.grades || [];
  } catch (error) {
    console.error("Error fetching grades:", error);
    return [];
  }
}

export async function getCompetitions() {
  try {
    const response = await fetch(`${apiUrl}/Competitions/visible`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch competitions. Please try again.");
    }

    const data = await response.json();
    return data.competitions || [];
  } catch (error) {
    console.error("Error fetching competitions:", error);
    return [];
  }
}

export async function getProblemsByCompetitionId(compId: number) {
  try {
    const response = await fetch(`${apiUrl}/Problems/competition/${compId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch problems. Please try again.");
    }

    const data = await response.json();
    return data.problems || [];
  } catch (error) {
    console.error("Error fetching problems:", error);
    return [];
  }
}

export async function getProblemsByClimberId(climberId: string) {
  try {
    const response = await fetch(`${apiUrl}/Problems/climber/${climberId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch problems. Please try again.");
    }

    const data = await response.json();
    return data.problems || [];
  } catch (error) {
    console.error("Error fetching problems:", error);
    return [];
  }
}

export async function submitProblemAttempt(climberId: string, problemId: number, attempts: number) {
  const payload = {
    climber_id: climberId,
    problem_id: problemId,
    attempts: attempts,
  };

  try {
    const response = await fetch(`${apiUrl}/ProblemAttempts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to submit problem attempt");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error submitting problem attempt:", error);
    throw error;
  }
}
