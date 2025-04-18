
import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { RegistrationData } from "@/types";

interface RegistrationFormProps {
  grades: { id: number; name: string }[];
  onSubmit: (data: RegistrationData) => void;
}

export function RegistrationForm({ grades, onSubmit }: RegistrationFormProps) {
  const [formData, setFormData] = useState<RegistrationData>({
    name: "",
    email: "",
    selectedGrade: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-md p-6 bg-white/95 backdrop-blur shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="grade">Select Grade</Label>
          <Select
            value={formData.selectedGrade.toString()}
            onValueChange={(value) =>
              setFormData({ ...formData, selectedGrade: parseInt(value) })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a grade" />
            </SelectTrigger>
            <SelectContent>
              {grades.map((grade) => (
                <SelectItem key={grade.id} value={grade.id.toString()}>
                  {grade.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full bg-[#6E59A5] hover:bg-[#5D4A94]">
          Register
        </Button>
      </form>
    </Card>
  );
}
