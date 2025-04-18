
import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { CircleDot, Medal, Star, Edit2, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Input } from "./ui/input";
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
  const [editingProblem, setEditingProblem] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{
    attempts: number;
    bonusAttempt: number | null;
    topAttempt: number | null;
  }>({ attempts: 0, bonusAttempt: null, topAttempt: null });

  const handleEditStart = (problem: Problem) => {
    setEditingProblem(problem.id);
    setEditValues({
      attempts: problem.attempts,
      bonusAttempt: problem.bonusAttempt,
      topAttempt: problem.topAttempt,
    });
  };

  const handleEditSave = () => {
    if (editingProblem === null) return;
    
    setProblems(currentProblems =>
      currentProblems.map(problem => {
        if (problem.id === editingProblem) {
          return {
            ...problem,
            attempts: editValues.attempts,
            bonusAttempt: editValues.bonusAttempt,
            topAttempt: editValues.topAttempt,
          };
        }
        return problem;
      })
    );
    setEditingProblem(null);
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
          
          {editingProblem === problem.id ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="attempts">Attempts:</Label>
                <Input
                  id="attempts"
                  type="number"
                  min="0"
                  value={editValues.attempts}
                  onChange={(e) => setEditValues({
                    ...editValues,
                    attempts: parseInt(e.target.value) || 0
                  })}
                  className="w-20"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="bonus">Bonus attempt:</Label>
                <Input
                  id="bonus"
                  type="number"
                  min="0"
                  value={editValues.bonusAttempt || ''}
                  onChange={(e) => setEditValues({
                    ...editValues,
                    bonusAttempt: e.target.value ? parseInt(e.target.value) : null
                  })}
                  className="w-20"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="top">Top attempt:</Label>
                <Input
                  id="top"
                  type="number"
                  min="0"
                  value={editValues.topAttempt || ''}
                  onChange={(e) => setEditValues({
                    ...editValues,
                    topAttempt: e.target.value ? parseInt(e.target.value) : null
                  })}
                  className="w-20"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingProblem(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditSave}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <CircleDot className="w-4 h-4" />
                <span className="text-sm">Attempts: {problem.attempts}</span>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditStart(problem)}
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </div>
            </>
          )}
        </Card>
      ))}
    </div>
  );
}
