import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function RegistrationPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [grade, setGrade] = useState("");
  const [grades, setGrades] = useState<string[]>([]); // State to store grades
  const { toast } = useToast();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL; 
  
  // Fetch grades from the /Grades endpoint
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await fetch(API_URL + "Grades");
        if (!response.ok) {
          throw new Error("Failed to fetch grades");
        }
        const data = await response.json();
        setGrades(data.grades); // Set the grades in state
      } catch (error) {
        console.error("Error fetching grades:", error);
        toast({
          title: "Error",
          description: "Failed to load grades. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchGrades();
  }, [toast]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        name,
        password,
        role: "climber", // Hardcoded role
        grade,
      };

      console.log("Payload to send:", payload);

      const response = await fetch(API_URL + "Climbers/Register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      console.log("Registration successful:", data);

      toast({
        title: "Registration Successful",
        description: `Welcome, ${data.name}! You have been registered successfully.`,
      });

      // Clear the form fields
      setName("");
      setPassword("");
      setGrade("");

      // Navigate to the Grade section page
      navigate("/grade-section");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#505654] to-[#c6d1b8] text-gray-100">
      <Card className="w-full max-w-md p-6 bg-white/95 backdrop-blur shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6">Register New Climber</h1>
        <form onSubmit={handleRegister} className="space-y-6">
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
          <div className="space-y-2">
            <Label htmlFor="grade">Grade</Label>
            <select
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
              className="w-full p-2 border rounded"
            >
              <option value="" disabled>
                Select your grade
              </option>
              {grades.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" className="w-full bg-[#505654] hover:bg-[#868f79] text-white">
            Register
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">Already have an account?</p>
          <Button
            onClick={() => navigate("/")}
            className="mt-2 w-full bg-gray-500 hover:bg-gray-600 text-white"
          >
            Go to Login
          </Button>
        </div>
      </Card>
    </div>
  );
}
