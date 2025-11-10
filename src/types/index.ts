// Auth
export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

//Climber
export type RegistrationRequest = {
  name: string;
  password: string;
};

export type MyInfoResponse = {
  id: number;
  name: string;
  user_scope: string;
  created_at: string;
};
// Competition
export type CompetitionRequest = {
  name: string;
  description: string;
  comp_type: string;
  comp_date: string;
  season_id: number;
  round_no: number;
};

export type CompetitionResponse = {
  id: number;
  name: string;
  description: string;
  comp_type: string;
  comp_date: string;
  season_id: number;
  round_no: number;
};

// Season
export type SeasonRequest = {
  name?: string;
  year?: string;
};

export type SeasonResponse = {
  id: number;
  name: string;
  year: string;
  created_at: string;
};

//Register climber to comp by level
export type RegisterToComp = {
  level: number;
};

export type RegisterToCompResponse = {
  comp_id: number;
  user_id: number;
  level: number;
  created_at: string;
};

//Score
export type ScoreRequest = {
  attempts_total: number;
  got_bonus: boolean;
  got_top: boolean;
  attempts_to_bonus: number;
  attempts_to_top: number;
};

// export type ScoreResponse = {
//   attempts_total: number;
//   got_bonus: boolean;
//   got_top: boolean;
//   attempts_to_bonus: number;
//   attempts_to_top: number;
//   problem_no: number;
// };

// export type ScoreBatch = {
//   items: ScoreResponse[];
// };

export type ScoreBatchResponse = {
  problem_no: number;
  score: {
    attempts_total: number;
    got_bonus: boolean;
    got_top: boolean;
    attempts_to_bonus: number;
    attempts_to_top: number;
  };
};

export type ScoreBatch = {
  items: {
    problem_no: number;
    attempts_total: number;
    got_bonus: boolean;
    got_top: boolean;
    attempts_to_bonus: number;
    attempts_to_top: number;
  }[];
};

export type ScoreResponse = {
  attempts_total: number;
  got_bonus: boolean;
  got_top: boolean;
  attempts_to_bonus: number;
  attempts_to_top: number;
};

export type ProblemScoreBulkResult = {
  problem_no: number;
  score: ScoreResponse;
};

export type CompetitionProps = {
  competition_id: number;
};

//Grade
export type Grade = {
  level: number;
};

//UrlParams
export type UrlParams = {
  id?: number;
  comp_id?: number;
  level?: number;
  problem_no?: number;
};

export type MessageProps = {
  message: string;
  color:
    | "ruby"
    | "gray"
    | "gold"
    | "bronze"
    | "brown"
    | "yellow"
    | "amber"
    | "orange"
    | "tomato"
    | "red"
    | "crimson"
    | "pink"
    | "plum"
    | "purple"
    | "violet"
    | "iris"
    | "indigo"
    | "blue"
    | "sky";
};
