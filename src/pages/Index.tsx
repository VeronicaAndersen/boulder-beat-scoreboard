import { RegistrationForm } from "@/components/RegistrationForm";
import { GradeSection } from "@/components/GradeSection";
import type { Grade } from "@/types";

const grades: Grade[] = [
  {
    id: 1,
    name: "Lila",
    color: "#A78BFA",
    problems: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `Problem ${i + 1}`,
    })),
  },
  {
    id: 2,
    name: "Rosa",
    color: "#F472B6",
    problems: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `Problem ${i + 1}`,
    })),
  },
  {
    id: 3,
    name: "Orange",
    color: "#F97316",
    problems: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `Problem ${i + 1}`,
    })),
  },
  {
    id: 4,
    name: "Gul",
    color: "#FEF7CD",
    problems: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `Problem ${i + 1}`,
    })),
  },
  {
    id: 5,
    name: "Grön",
    color: "#4ADE80",
    problems: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `Problem ${i + 1}`,
    })),
  },
  {
    id: 6,
    name: "Vit",
    color: "#FFFFFF",
    problems: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `Problem ${i + 1}`,
    })),
  },
  {
    id: 7,
    name: "Svart",
    color: "#1A1F2C",
    problems: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `Problem ${i + 1}`,
    })),
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-[#6E59A5] text-gray-100">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
          Climbing Competition
        </h1>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center mb-6">Register Now</h2>
          <div className="flex justify-center">
            <RegistrationForm />
          </div>
        </div>

        <div className="space-y-8">
          {grades.map((grade) => (
            <GradeSection key={grade.id} grade={grade} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
