import { useState } from "react";
import type { RegistrationRequest } from "@/types";
import { registerClimber } from "@/hooks/api";
import { Link, useNavigate } from "react-router-dom";
import * as Label from "@radix-ui/react-label";
import { Card, Button, TextField } from "@radix-ui/themes";

export function RegistrationForm() {
  const navigate = useNavigate();

  // Controlled from first render
  const [RegisterClimberData, setRegisterClimberData] = useState<RegistrationRequest>({
    name: "",
    password: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload: RegistrationRequest = {
        name: RegisterClimberData.name,
        password: RegisterClimberData.password,
      };

      await registerClimber(payload);
      alert("Registration successful! You can now log in.");
      navigate("/");
    } catch (error) {
      console.error("Error registering climber:", error);
      alert("Failed to register climber. Please check your connection and try again.");
    }
  };

  const isSubmitDisabled = !RegisterClimberData.name || !RegisterClimberData.password;

  return (
    <div className="w-80 flex items-center justify-center">
      <Card className="w-full h-fit max-w-md p-6 bg-white/95 backdrop-blur shadow-xl">
        <form onSubmit={handleRegister} className="space-y-6">
          <h2 className="text-2xl font-semibold text-center mb-4">Registrera dig</h2>
          <div className="space-y-2">
            <Label.Root htmlFor="name">Namn</Label.Root>
            <TextField.Root
              id="name"
              type="text"
              placeholder="Enter your name"
              value={RegisterClimberData.name}
              onChange={(e) =>
                setRegisterClimberData({ ...RegisterClimberData, name: e.target.value })
              }
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
              value={RegisterClimberData.password}
              onChange={(e) =>
                setRegisterClimberData({ ...RegisterClimberData, password: e.target.value })
              }
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

          <Link to="/" className="text-sm text-center text-[#505654] underline justify-center flex">
            Redan ett konto? Klicka här!
          </Link>
        </form>
      </Card>
    </div>
  );
}
