import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import type { RegistrationData } from "@/types";
import { getGrades, registerClimber } from "@/hooks/api";
import { Link, useNavigate } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RegistrationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegistrationData>({
    name: "",
    password: "",
    roles: "",
    grade: "",
  });
  const [grades, setGrades] = useState<string[]>([]);
  const [loadingGrades, setLoadingGrades] = useState(true);

  useEffect(() => {
    async function fetchGrades() {
      try {
        const data = await getGrades();
        setGrades(data);
      } catch (err) {
        console.error("Failed to fetch grades:", err);
      } finally {
        setLoadingGrades(false);
      }
    }
    fetchGrades();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload: RegistrationData = {
        name: formData.name,
        password: formData.password,
        roles: "Climber",
        grade: formData.grade,
      };

      await registerClimber(payload);
      alert("Registration successful! You can now log in.");
      navigate("/");
    } catch (error) {
      console.error("Error registering climber:", error);
      alert(
        "Failed to register climber. Please check your connection and try again."
      );
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center">
    <Card className="w-full h-fit max-w-md p-6 bg-white/95 backdrop-blur shadow-xl">
      <form onSubmit={handleRegister} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Namn</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="grade">Välj Grad</Label>
          <Select
            value={formData.grade}
            onValueChange={(value) =>
              setFormData({ ...formData, grade: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  loadingGrades ? "Loading grades..." : "Select a grade"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {grades.map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#505654] hover:bg-[#868f79]"
        >
          Register
        </Button>

        <Link
          to="/"
          className="text-sm text-center text-[#505654] hover:underline justify-center flex"
        >
          Back to Login
        </Link>
      </form>
    </Card>
  </div>

  );
}
