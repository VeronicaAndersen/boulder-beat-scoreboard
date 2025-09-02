import { LoginData, RegistrationData } from "@/types";
import { Climber } from "@/types";

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

export default async function getClimberById(climberId: string | null): Promise<Climber | null> {
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
    return data.climber; // or data.climber if your API wraps it like that
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
