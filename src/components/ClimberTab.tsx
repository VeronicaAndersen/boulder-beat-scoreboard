import { ProblemGrid } from "./ProblemGrid";

export default function ClimberTab() {
  return (
    <ProblemGrid
      problems={[]}
      registeredClimber={{
        id: "",
        name: "",
        selected_grade: "",
      }}
    />
  );
}
