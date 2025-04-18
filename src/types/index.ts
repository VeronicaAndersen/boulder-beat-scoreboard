
export type Problem = {
  id: number;
  name: string;
  description?: string;
  attempts: number;
  bonusAttempt: number | null;
  topAttempt: number | null;
};

export type Grade = {
  id: number;
  name: string;
  color: string;
  problems: Problem[];
};

export type RegistrationData = {
  name: string;
  email: string;
  date: string;
  selectedGrade: number;
};
