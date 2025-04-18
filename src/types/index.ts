
export type Problem = {
  id: number;
  name: string;
  description?: string;
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
};
