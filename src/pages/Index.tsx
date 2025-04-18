import { useState, useEffect } from "react";
import type { Grade, RegistrationData } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { RegistrationPage } from "@/components/RegistrationPage";

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
const Index = () => {
  const [registeredUsers, setRegisteredUsers] = useState<RegistrationData[]>([]);
  const { toast } = useToast();

  const handleRegistration = (data: RegistrationData) => {
    setRegisteredUsers((prev) => [...prev, data]);

    // Save user registration data in localStorage
    localStorage.setItem("registeredUsers", JSON.stringify([...registeredUsers, data]));

    toast({
      title: "Registrering genomförd",
      description: `Välkommen ${data.name}! Du har nu registrerat dig på ${grades.find(g => g.id === data.selectedGrade)?.name} nivå.`,
    });
  };

  useEffect(() => {
    const storedUsers = localStorage.getItem("registeredUsers");
    if (storedUsers) {
      setRegisteredUsers(JSON.parse(storedUsers));
    }
  }, []);

  const handleGradeChange = (userIndex: number, newGradeId: number) => {
    setRegisteredUsers((prevUsers) =>
      prevUsers.map((user, index) =>
        index === userIndex ? { ...user, selectedGrade: newGradeId } : user
      )
    );

    const updatedUsers = registeredUsers.map((user, index) =>
      index === userIndex ? { ...user, selectedGrade: newGradeId } : user
    );
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
  };

  const handleAddUser = () => {
    setRegisteredUsers((prev) => {
      if (prev.length < 2) {
        const newUser = {
          name: "",
          email: "",
          date: new Date().toISOString().split("T")[0],
          selectedGrade: grades[0].id,
        };
        const updatedUsers = [...prev, newUser];
        localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
        return updatedUsers;
      }
      return prev;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#505654] to-[#c6d1b8] text-gray-100">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
          Greppmästerskapen
        </h1>
        <RegistrationPage
          grades={grades}
          registeredUsers={registeredUsers}
          handleRegistration={handleRegistration}
          handleGradeChange={handleGradeChange}
          handleAddUser={handleAddUser}
        />
      </div>
    </div>
  );
};

export default Index;