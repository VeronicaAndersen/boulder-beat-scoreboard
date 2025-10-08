export type Problem = {
  id: number;
  name: string;
  number: number;
  grade: string;
  sector?: string | null;
  visible?: boolean;
  competitionId?: number;
};

export type Grade = {
  name: string;
};

export type RegistrationData = {
  name: string;
  password: string;
  roles: "Climber" | "Admin" | "";
  grade: string;
};

export type LoginData = {
  name: string;
  password: string;
};

export type Climber = {
  id: string;
  name: string;
  selected_grade: string;
  problemAttempts: Problem[];
};

export type Competition = {
  id: number;
  name: string;
  date: string;
  participants: number;
  visible: boolean;
};
