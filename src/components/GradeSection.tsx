
import { Card } from "./ui/card";
import { ProblemGrid } from "./ProblemGrid";
import type { Grade } from "@/types";

interface GradeSectionProps {
  grade: Grade;
}

export function GradeSection({ grade }: GradeSectionProps) {
  return (
    <Card className="p-6 bg-white/95 backdrop-blur">
      <div className="flex items-center gap-4 mb-6">
        <div
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: grade.color }}
        />
        <h2 className="text-2xl font-bold">{grade.name}</h2>
      </div>
      <ProblemGrid problems={grade.problems} />
    </Card>
  );
}
