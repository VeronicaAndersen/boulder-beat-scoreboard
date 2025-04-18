import { Card } from "./ui/card";
import { ProblemGrid } from "./ProblemGrid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button"; // Import Button component
import type { Grade, RegistrationData } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { RegistrationForm } from "./RegistrationForm";
import { useState } from "react";

interface GradeSectionProps {
  grade: Grade;
  name: string;
  grades: Grade[]; // Add all available grades
  onGradeChange: (newGradeId: number) => void; // Callback for grade change
  onAddUser: () => void; // Callback for adding another user
}

export function GradeSection({ grade, name, grades, onGradeChange, onAddUser }: GradeSectionProps) {
  return (
    <>
      <div className="mt-6 flex justify-end">
        <Button onClick={onAddUser} className="bg-[#505654] hover:bg-[#868f79]">
          Add Another User
        </Button>
      </div>
      <Card className="p-6 bg-white/95 backdrop-blur">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{name.toUpperCase()}</h1>
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: grade.color, boxShadow: `0 4px 6px rgba(0, 0, 0, 0.1)` }}
            />
          </div>
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Ändra nivå: </h2>
            <Select
              value={grade.id.toString()}
              onValueChange={(value) => onGradeChange(parseInt(value))}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Change Grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((g) => (
                  <SelectItem key={g.id} value={g.id.toString()}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <ProblemGrid problems={grade.problems} />
      </Card>
    </>
  );
}
