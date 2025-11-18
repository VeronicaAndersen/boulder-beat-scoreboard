import { api, tokens } from "@/lib/apiClient";
import {
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
  SignupResponse,
  CompetitionRequest,
  UrlParams,
  ScoreRequest,
  ScoreBatch,
  SeasonRequest,
  SeasonResponse,
  MyInfoResponse,
  RegisterToCompResponse,
  ProblemScoreBulkResult,
  SignupRequest,
  ScoreBatchResponse,
  CompetitionResponse,
} from "@/types";

// Auth
export async function loginClimber(payload: LoginRequest): Promise<LoginResponse | null> {
  const data = await api.post<LoginResponse, LoginRequest>("/auth/login", payload);
  tokens.saveTokens(data);
  return data;
}

export async function signupClimber(payload: RegistrationRequest): Promise<SignupResponse | null> {
  const data = await api.post<SignupResponse, SignupRequest>("/auth/signup", payload);
  tokens.saveTokens(data);
  return data;
}

// Climber
export const getMyInfo = () => api.get<MyInfoResponse>("/climber/me", true);

export const getClimberById = (id: number) => api.get(`/climber/${id}`);

export const registerClimber = (payload: RegistrationRequest) => api.post("/climber", payload);

// Competition
export const createCompetition = (payload: CompetitionRequest) =>
  api.post("/competition", payload, true);

export const getCompetitions = (name?: string, year?: string) => {
  const params = new URLSearchParams();
  if (name) params.append("name", name);
  if (year) params.append("year", year);

  return api.get<CompetitionResponse[]>(`/competition?${params.toString()}`);
};

export const updateCompetitionById = (competitionId: number, payload: CompetitionRequest) =>
  api.put(`/competition/${competitionId}`, payload, true);

export const deleteCompetitionById = (competitionId: number) =>
  api.delete(`/competition/${competitionId}`, true);

export const getCompRegistrationInfo = (competitionId: number) =>
  api.get<RegisterToCompResponse>(`/competition/${competitionId}/registration`, true);

export const checkRegistration = (competitionId: number) =>
  api.get<boolean>(`/competition/${competitionId}/registration/check`, true);

export const registerClimberToCompetition = (competitionId: number, level: number) =>
  api.post(`/competition/${competitionId}/register`, { level }, true);

// Seasons
export const createSeason = (payload: SeasonRequest) => api.post("/season", payload, true);

export const getSeasons = (payload: SeasonRequest) => {
  const params = new URLSearchParams(payload as SeasonRequest);
  return api.get<SeasonResponse[]>(`/season?${params.toString()}`, true);
};

export const getSeasonById = (seasonId: number) =>
  api.get<SeasonResponse>(`/season/${seasonId}`, true);

export const updateSeasonById = (seasonId: number, payload: SeasonRequest) =>
  api.put(`/season/${seasonId}`, payload, true);

export const deleteSeasonById = (seasonId: number) => api.delete(`/season/${seasonId}`, true);

// Scores
export const getScoresBatch = ({ comp_id, level }: UrlParams) =>
  api.get<ScoreBatchResponse[]>(`/competitions/${comp_id}/level/${level}/scores/batch`, true);

export const updateScore = ({ comp_id, level, problem_no }: UrlParams, payload: ScoreRequest) =>
  api.put(`/competitions/${comp_id}/level/${level}/problems/${problem_no}/score`, payload, true);

export const updateScoreBatch = ({ comp_id, level }: UrlParams, payload: ScoreBatch) =>
  api.put<ProblemScoreBulkResult[], ScoreBatch>(
    `/competitions/${comp_id}/level/${level}/scores/batch`,
    payload,
    true
  );
