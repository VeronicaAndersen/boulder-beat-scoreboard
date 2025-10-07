import { useState, useEffect } from "react";
import type { RegistrationData } from "@/types";
import { getGrades, registerClimber } from "@/hooks/api";
import { Link, useNavigate } from "react-router-dom";
import * as Label from "@radix-ui/react-label";
import { Card, Button, TextField, Select } from "@radix-ui/themes";

export function RegistrationForm() {
  const navigate = useNavigate();

  // Controlled from first render
  const [formData, setFormData] = useState<RegistrationData>({
    name: "",
    password: "",
    roles: "",
    grade: "",
  });

  const [grades, setGrades] = useState<string[]>([]);
  const [loadingGrades, setLoadingGrades] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getGrades();
        setGrades(Array.isArray(data) ? data.filter(Boolean) : []);
      } catch (err) {
        console.error("Failed to fetch grades:", err);
      } finally {
        setLoadingGrades(false);
      }
    })();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.grade) {
      alert("Please select a grade.");
      return;
    }

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
      alert("Failed to register climber. Please check your connection and try again.");
    }
  };

  const isSubmitDisabled = loadingGrades || !formData.name || !formData.password || !formData.grade;

  return (
    <div className="min-h-screen w-80 flex items-center justify-center">
      <Card className="w-full h-fit max-w-md p-6 bg-white/95 backdrop-blur shadow-xl">
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <Label.Root htmlFor="name">Namn</Label.Root>
            <TextField.Root
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
            <Label.Root htmlFor="password">Password</Label.Root>
            <TextField.Root
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label.Root>Välj Grad</Label.Root>
            <Select.Root
              value={formData.grade}
              onValueChange={(value) => setFormData({ ...formData, grade: value })}
              disabled={loadingGrades}
            >
              <Select.Trigger
                placeholder={loadingGrades ? "Loading grades..." : "Select a grade"}
                className="w-full"
              />
              <Select.Content>
                <Select.Group>
                  <Select.Label>Grades</Select.Label>
                  {/* IMPORTANT: no <Select.Item value=""> here */}
                  {grades.map((grade) => (
                    <Select.Item key={grade} value={grade}>
                      {grade}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#505654] hover:bg-[#868f79] disabled:bg-[#505654]/50 disabled:cursor-not-allowed"
            disabled={isSubmitDisabled}
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
