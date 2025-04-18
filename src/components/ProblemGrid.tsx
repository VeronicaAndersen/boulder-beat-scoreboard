
import { Card } from "./ui/card";
import type { Problem } from "@/types";

interface ProblemGridProps {
  problems: Problem[];
}

export function ProblemGrid({ problems }: ProblemGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {problems.map((problem) => (
        <Card
          key={problem.id}
          className="p-4 hover:shadow-md transition-shadow cursor-pointer"
        >
          <h3 className="font-semibold">{problem.name}</h3>
          {problem.description && (
            <p className="text-sm text-gray-600 mt-2">{problem.description}</p>
          )}
        </Card>
      ))}
    </div>
  );
}
