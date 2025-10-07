import type { Problem } from "@/types";
import { Button } from "@radix-ui/themes";

interface ProblemGridProps {
  problems: Problem[];
  registeredClimber: { id: string; name: string; selected_grade: string };
}

export function ProblemGrid({
  problems: initialProblems,
  registeredClimber: registeredClimber,
}: ProblemGridProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#505654]">Problem</h2>
        <Button className="bg-[#505654] hover:bg-[#868f79] text-white">Spara Resultat</Button>
      </div>
    </div>
  );
}
