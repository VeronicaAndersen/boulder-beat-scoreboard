
import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { CircleDot, Medal, Star } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import type { Problem } from "@/types";

interface ProblemGridProps {
  problems: Problem[];
}

export function ProblemGrid({ problems: initialProblems }: ProblemGridProps) {
  const [problems, setProblems] = useState(
    initialProblems.map(p => ({
      ...p,
      attempts: p.attempts || 0,
      bonusAttempt: p.bonusAttempt || null,
      topAttempt: p.topAttempt || null,
    }))
  );

  const handleAttempt = (problemId: number) => {
    setProblems(currentProblems =>
      currentProblems.map(problem => {
        if (problem.id === problemId) {
          return {
            ...problem,
            attempts: problem.attempts + 1,
          };
        }
        return problem;
      })
    );
  };

  const handleBonus = (problemId: number) => {
    setProblems(currentProblems =>
      currentProblems.map(problem => {
        if (problem.id === problemId && !problem.bonusAttempt) {
          return {
            ...problem,
            bonusAttempt: problem.attempts,
          };
        }
        return problem;
      })
    );
  };

  const handleTop = (problemId: number) => {
    setProblems(currentProblems =>
      currentProblems.map(problem => {
        if (problem.id === problemId && !problem.topAttempt) {
          return {
            ...problem,
            topAttempt: problem.attempts,
          };
        }
        return problem;
      })
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {problems.map((problem) => (
        <Card
          key={problem.id}
          className="p-4 space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">{problem.name}</h3>
            <div className="flex items-center gap-2">
              {problem.bonusAttempt && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Medal className="w-5 h-5 text-yellow-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Bonus on attempt {problem.bonusAttempt}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {problem.topAttempt && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Star className="w-5 h-5 text-green-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Top on attempt {problem.topAttempt}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <CircleDot className="w-4 h-4" />
            <span className="text-sm">Attempts: {problem.attempts}</span>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleAttempt(problem.id)}
            >
              Try
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBonus(problem.id)}
              disabled={!!problem.bonusAttempt}
            >
              Bonus
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTop(problem.id)}
              disabled={!!problem.topAttempt}
            >
              Top
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
