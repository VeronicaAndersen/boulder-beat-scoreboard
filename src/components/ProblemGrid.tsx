import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Medal, Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import type { Problem } from "@/types";

interface ProblemGridProps {
  problems: Problem[];
  registeredClimber: { id: string; name: string; email: string };
}

const LOCAL_STORAGE_KEY = "appData";

export function ProblemGrid({ problems: initialProblems, registeredClimber: registeredClimber }: ProblemGridProps) {
  const [problems, setProblems] = useState<Problem[]>([]);

  // Load problem attempts from appData in localStorage when the component mounts
  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const climbAttempts = parsedData.problemAttempts?.[registeredClimber.id] || initialProblems;
      setProblems(climbAttempts);
    } else {
      setProblems(initialProblems);
    }
  }, [initialProblems, registeredClimber.id]);

  // Update problem attempts and save to appData in localStorage
  const updateProblem = async (id: number, updates: Partial<Problem>) => {
    setProblems((currentProblems) => {
      const updatedProblems = currentProblems.map((problem) =>
        problem.id === id ? { ...problem, ...updates } : problem
      );

      // Save updated problems to appData in localStorage
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsedData = storedData ? JSON.parse(storedData) : {};
      parsedData.problemAttempts = {
        ...parsedData.problemAttempts,
        [registeredClimber.id]: updatedProblems,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsedData));


      return updatedProblems;
    });
  };


  // Send updated problemAttempts to the API
  const sendUpdatesToAPI = async () => {
    try {
      const token = import.meta.env.VITE_REACT_APP_API_TOKEN;

      // Construct the payload to match the API's expected structure
      const payload = {
        attempts: problems.map((problem) => ({
          id: problem.id,
          name: problem.name,
          attempts: problem.attempts,
          bonusAttempt: problem.bonusAttempt || null, // Use null if not set
          topAttempt: problem.topAttempt || null, // Use null if not set
        })),
      };

      console.log("Payload to send:", JSON.stringify(payload));

      const response = await fetch(
        `https://web-production-9e43d.up.railway.app/Climbers/${registeredClimber.id}/attempts`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        console.error("API Error:", errorData);
        alert(`Failed to update problem attempts: ${errorData.error || "Unknown error"}`);
        return;
      }

      console.log("Problem attempts updated successfully on the server.");
      alert("Problem attempts updated successfully!");
    } catch (error) {
      console.error("Error updating problem attempts on the server:", error);
      alert("Failed to update problem attempts. Please check your connection and try again.");
    }
  };

  const getProblemScore = (problem: Problem) => {
    let displayName = "";
    if (problem.bonusAttempt && problem.topAttempt) {
      displayName = `B${problem.bonusAttempt} T${problem.topAttempt}`;
    } else if (problem.bonusAttempt) {
      displayName = `B${problem.bonusAttempt}`;
    } else if (problem.topAttempt) {
      displayName = `T${problem.topAttempt}`;
    }

    return displayName;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {problems.map((problem) => (
        <Card key={problem.id} className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">{problem.name}</h3>
            <h3 className="font-semibold">{getProblemScore(problem)}</h3>
            <div className="flex items-center gap-2">
              {problem.bonusAttempt && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Medal className="w-5 h-5 text-yellow-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Bonus på försök {problem.bonusAttempt}</p>
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
                      <p>Topp på försök {problem.topAttempt}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>

          {/* Editable fields */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={`attempts-${problem.id}`}>Försök:</Label>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateProblem(problem.id, {
                      attempts: Math.max(0, problem.attempts - 1),
                    })
                  }
                >
                  -
                </Button>
                <span className="w-8 text-center">{problem.attempts}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateProblem(problem.id, {
                      attempts: problem.attempts + 1,
                    })
                  }
                >
                  +
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor={`bonus-${problem.id}`}>Bonus försök:</Label>
              <Input
                id={`bonus-${problem.id}`}
                type="number"
                min="0"
                value={problem.bonusAttempt || ""}
                onChange={(e) =>
                  updateProblem(problem.id, {
                    bonusAttempt: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
                className="w-20"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor={`top-${problem.id}`}>Topp försök:</Label>
              <Input
                id={`top-${problem.id}`}
                type="number"
                min="0"
                value={problem.topAttempt || ""}
                onChange={(e) =>
                  updateProblem(problem.id, {
                    topAttempt: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
                className="w-20"
              />
            </div>
          </div>
        </Card>
      ))}
      
      {/* Submit button */}
      <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-end">
        <Button
          onClick={sendUpdatesToAPI}
          className="bg-[#505654] hover:bg-[#868f79]"
        >
          Spara försök för {registeredClimber.name}
        </Button>
      </div>
    </div>
  );
}
