import { useState } from "react";
import type { LoginData } from "@/types";
import { useAuthStore } from "@/store/auth";
import { Link, useNavigate } from "react-router-dom";
import { loginClimber } from "@/hooks/api";
import { Button, Card, TextField } from "@radix-ui/themes";
import { Label } from "@radix-ui/react-context-menu";

export function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginData>({ name: "", password: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { access_token, climber_id } = await loginClimber(formData);
      useAuthStore.getState().setToken(access_token);
      useAuthStore.getState().setClimberId(climber_id);
      localStorage.setItem(
        "climber",
        JSON.stringify({ climberId: climber_id, climberName: formData.name })
      );
      navigate("/profile");
    } catch (error) {
      console.error("Error logging in climber:", error);
      alert("Failed to log in climber. Please check your connection and try again.");
    }
  };

  return (
    <div className="min-h-screen w-80 flex items-center justify-center">
      <Card className="w-full h-fit max-w-md p-6 bg-white/95 backdrop-blur shadow-xl">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label>Namn</Label>
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
            <Label>Lösenord</Label>
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
            disabled={!formData.name || !formData.password}
          >
            Logga in
          </Button>

          <Link
            to="/register"
            className="text-sm text-center text-[#505654] hover:underline justify-center flex"
          >
            Registrera dig
          </Link>
        </form>
      </Card>
    </div>
  );
}
