import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { RegistrationData } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface RegistrationFormProps {
  grades: { id: number; name: string }[];
  onSubmit: (data: RegistrationData) => void;
}

export function RegistrationForm({ grades, onSubmit }: RegistrationFormProps) {
  const [formData, setFormData] = useState<RegistrationData>({
    id: uuidv4(),
    name: "",
    email: "",
    date: new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Europe/Stockholm",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .format(new Date())
      .split(" ")
      .join("-"),
    selectedGrade: 0,
  });

  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = import.meta.env.VITE_REACT_APP_API_TOKEN;

      // Construct the payload
      const payload = {
        registeredClimbers: [
          {
            id: formData.id,
            name: formData.name,
            email: formData.email,
            date: formData.date,
            selectedGrade: formData.selectedGrade,
          },
        ],
        problemAttempts: {}, // Empty problemAttempts for a new climber
      };

      console.log("Payload to send:", payload);
      console.log(JSON.stringify(payload));

      // Send the data to the API
      const response = await fetch("https://web-production-9e43d.up.railway.app//Climbers/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to register climber. Please try again.");
      }

      console.log("Climber registered successfully:", await response.json());
      alert("Climber registered successfully!");

      // Save the climber to localStorage
      const storedData = localStorage.getItem("appData");
      const parsedData = storedData ? JSON.parse(storedData) : { registeredClimbers: [], problemAttempts: {} };

      parsedData.registeredClimbers.push(payload.registeredClimbers[0]);
      localStorage.setItem("appData", JSON.stringify(parsedData));

      console.log("Climber saved to localStorage:", parsedData);

      // Call the onSubmit callback to update the parent component's state
      onSubmit(formData);
    } catch (error) {
      console.error("Error registering climber:", error);
      alert("Failed to register climber. Please check your connection and try again.");
    }
  };

  return (
    <Card className="w-full max-w-md p-6 bg-white/95 backdrop-blur shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
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
          <Label htmlFor="grade">Välj Grad</Label>
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

        <Button type="submit" className="w-full bg-[#505654] hover:bg-[#868f79]">
          Register
        </Button>
      </form>
    </Card>
  );
}