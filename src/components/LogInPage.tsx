import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL; 

const LogInPage = ({ onLogin }: { onLogin: (name: string) => void }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = { name, password };

      const response = await fetch(
        API_URL + "Climbers/Login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      console.log("API Response:", data); // Debug the response

      localStorage.setItem("userName", data.name);
      onLogin(data.name);

      toast({
        title: "Login Successful",
        description: `Welcome, ${data.name}!`,
      });
    } catch (error: unknown) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description:
          (error instanceof Error ? error.message : String(error)) ||
          "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#505654] to-[#c6d1b8] text-gray-100">
      <Card className="w-full max-w-md p-6 bg-white/95 backdrop-blur shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#505654] hover:bg-[#868f79]"
          >
            Login
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">Don't have an account?</p>
          <Button
            onClick={() => navigate("/register")} // Navigate to the registration page
            className="mt-2 w-full bg-gray-500 hover:bg-gray-600 text-white"
          >
            Register New Climber
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LogInPage;
