
export type Problem = {
  id: number;
  name: string;
  description?: string;
  attempts: number;
  bonusAttempt: number | null;
  topAttempt: number | null;
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
  compname: string;
  compdate: string;
  comppart: number;
  visible: boolean;
};