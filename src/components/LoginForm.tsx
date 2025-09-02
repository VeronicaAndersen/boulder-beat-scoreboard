import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import type { LoginData } from "@/types";
import { useAuthStore } from "@/store/auth";
import { Link, useNavigate } from "react-router-dom";
import { loginClimber } from "@/hooks/api"; // ✅ import our new API function

export function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginData>({ name: "", password: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token, id } = await loginClimber(formData); // ✅ call API function
      useAuthStore.getState().setToken(token);
      useAuthStore.getState().setClimberId(id);
      localStorage.setItem("climbers", JSON.stringify({ climberId: id }));
      navigate("/profile");
    } catch (error) {
      console.error("Error logging in climber:", error);
      alert("Failed to log in climber. Please check your connection and try again.");
    }
  };

  return (
    <Card className="w-full max-w-md p-6 bg-white/95 backdrop-blur shadow-xl flex flex-col">
      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Namn</Label>
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
          <Label htmlFor="password">Lösenord</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            className="w-full"
          />
        </div>

        <Button type="submit" className="w-full bg-[#505654] hover:bg-[#868f79]">
          Logga in
        </Button>

        <Link to="/register" className="text-sm text-center text-[#505654] hover:underline justify-center flex">
          Registrera dig
        </Link>
      </form>
    </Card>
  );
}
