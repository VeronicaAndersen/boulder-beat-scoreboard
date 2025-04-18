
import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import type { RegistrationData } from "@/types";

export function RegistrationForm() {
  const [formData, setFormData] = useState<RegistrationData>({
    name: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just log the data
    console.log("Registration submitted:", formData);
    // Clear form
    setFormData({ name: "", email: "" });
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
        <Button type="submit" className="w-full bg-[#6E59A5] hover:bg-[#5D4A94]">
          Register
        </Button>
      </form>
    </Card>
  );
}
