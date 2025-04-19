import { useState, useEffect } from "react";
import type { Grade, RegistrationData } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { RegistrationPage } from "@/components/RegistrationPage";
import { v4 as uuidv4 } from "uuid";

const grades: Grade[] = [
  {
    id: 1,
    name: "Lila",
    color: "#A78BFA",
    problems: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `Problem ${i + 1}`,
      attempts: 0,
      bonusAttempt: null,
      topAttempt: null,
    })),
  },
  {
    id: 2,
    name: "Rosa",
    color: "#F472B6",
    problems: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `Problem ${i + 1}`,
      attempts: 0,
      bonusAttempt: null,
      topAttempt: null,
    })),
  },
  {
    id: 3,
    name: "Orange",
    color: "#F97316",
    problems: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `Problem ${i + 1}`,
      attempts: 0,
      bonusAttempt: null,
      topAttempt: null,
    })),
  },
  {
    id: 4,
    name: "Gul",
    color: "#f4ed87",
    problems: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `Problem ${i + 1}`,
      attempts: 0,
      bonusAttempt: null,
      topAttempt: null,
    })),
  },
  {
    id: 5,
    name: "Grön",
    color: "#4ADE80",
    problems: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `Problem ${i + 1}`,
      attempts: 0,
      bonusAttempt: null,
      topAttempt: null,
    })),
  },
  {
    id: 6,
    name: "Vit",
    color: "#FFFFFF",
    problems: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `Problem ${i + 1}`,
      attempts: 0,
      bonusAttempt: null,
      topAttempt: null,
    })),
  },
  {
    id: 7,
    name: "Svart",
    color: "#1A1F2C",
    problems: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `Problem ${i + 1}`,
      attempts: 0,
      bonusAttempt: null,
      topAttempt: null,
    })),
  },
];

const LOCAL_STORAGE_KEY = "appData";

const Index = () => {
  const [registeredClimbers, setRegisteredClimbers] = useState<RegistrationData[]>([]);
  const { toast } = useToast();

  // Load data from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setRegisteredClimbers(parsedData.registeredClimbers || []);
    }
  }, []);

  // Save data to localStorage whenever registeredClimbers changes
  useEffect(() => {
    const appData = {
      registeredClimbers: registeredClimbers,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appData));
  }, [registeredClimbers]);

  const handleRegistration = (data: RegistrationData) => {
    setRegisteredClimbers((prev) => [...prev, data]);

    toast({
      title: "Registrering genomförd",
      description: `Välkommen ${data.name}! Du har nu registrerat dig på ${grades.find((g) => g.id === data.selectedGrade)?.name} nivå.`,
    });
  };

  const handleGradeChange = async (climberIndex: number, newGradeId: number) => {
    setRegisteredClimbers((prevClimbers) =>
      prevClimbers.map((climber, index) =>
        index === climberIndex ? { ...climber, selectedGrade: newGradeId } : climber
      )
    );

    const climber = registeredClimbers[climberIndex];

    try {
      const token = import.meta.env.VITE_REACT_APP_API_TOKEN;

      // Construct the payload
      const payload = {
        id: climber.id,
        name: climber.name,
        email: climber.email,
        date: climber.date,
        selectedGrade: newGradeId,
      };

      console.log("Payload to send:", payload);

      // Send the data to the API
      const response = await fetch(
        `https://web-production-9e43d.up.railway.app/Climbers/${climber.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        alert(`Failed to update climber grade: ${errorData.error || "Unknown error"}`);
        return;
      }

      console.log("Climber grade updated successfully on the server.");
      alert("Climber grade updated successfully!");
    } catch (error) {
      console.error("Error updating climber grade on the server:", error);
      alert("Failed to update climber grade. Please check your connection and try again.");
    }
  };

  const handleAddClimber = () => {
    setRegisteredClimbers((prev) => {
      if (prev.length < 2) {
        const newClimber = {
          id: uuidv4(),
          name: "",
          email: "",
          date: new Date().toISOString().split("T")[0],
          selectedGrade: grades[0].id,
        };
        return [...prev, newClimber];
      }
      return prev;
    });
  };

  // Logout function to clear localStorage and reset state
  const handleLogout = () => {
    localStorage.clear();
    setRegisteredClimbers([]);
    toast({
      title: "Logged out",
      description: "All data has been cleared.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#505654] to-[#c6d1b8] text-gray-100">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
          Greppmästerskapen
        </h1>
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#c58179] text-white rounded hover:bg-[#c16f65]"
          >
            Logga ut alla klättrare
          </button>
        </div>
        <RegistrationPage
          grades={grades}
          registeredClimber={registeredClimbers}
          handleRegistration={handleRegistration}
          handleGradeChange={handleGradeChange}
          handleAddClimber={handleAddClimber}
        />
      </div>
    </div>
  );
};

export default Index;