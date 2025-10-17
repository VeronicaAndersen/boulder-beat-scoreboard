import { useState, useEffect } from "react";
import type { RegistrationData } from "@/types";
import { getGrades, registerClimber } from "@/hooks/api";
import { Link, useNavigate } from "react-router-dom";
import * as Label from "@radix-ui/react-label";
import { Card, Button, TextField } from "@radix-ui/themes";

export function RegistrationForm() {
  const navigate = useNavigate();

  // Controlled from first render
  const [formData, setFormData] = useState<RegistrationData>({
    name: "",
    password: "",
  });

  const [, setGrades] = useState<string[]>([]);
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

    try {
      const payload: RegistrationData = {
        name: formData.name,
        password: formData.password,
      };

      await registerClimber(payload);
      alert("Registration successful! You can now log in.");
      navigate("/");
    } catch (error) {
      console.error("Error registering climber:", error);
      alert("Failed to register climber. Please check your connection and try again.");
    }
  };

  const isSubmitDisabled = loadingGrades || !formData.name || !formData.password;

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
            <Label.Root htmlFor="password">Lösenord</Label.Root>
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

          <Button
            type="submit"
            className="w-full bg-[#505654] hover:bg-[#868f79] disabled:bg-[#505654]/50 disabled:cursor-not-allowed"
            disabled={isSubmitDisabled}
          >
            Registrera dig
          </Button>

          <Link
            to="/"
            className="text-sm text-center text-[#505654] hover:underline justify-center flex"
          >
            Till Logga in
          </Link>
        </form>
      </Card>
    </div>
  );
}
