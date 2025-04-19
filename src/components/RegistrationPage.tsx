import { useState } from "react";
import { RegistrationForm } from "@/components/RegistrationForm";
import { GradeSection } from "@/components/GradeSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Grade, RegistrationData } from "@/types";

interface RegistrationPageProps {
  grades: Grade[];
  registeredClimber: RegistrationData[];
  handleRegistration: (data: RegistrationData) => void;
  handleGradeChange: (index: number, newGradeId: number) => void;
  handleAddClimber: () => void;
}

export function RegistrationPage({
  grades,
  registeredClimber: registeredClimber,
  handleRegistration,
  handleGradeChange,
  handleAddClimber: handleAddClimber,
}: RegistrationPageProps) {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  return (
    <>
      {registeredClimber.length === 0 || showRegistrationForm ? (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Registrera dig
          </h2>
          <div className="flex justify-center">
            <RegistrationForm
              grades={grades.map(({ id, name }) => ({ id, name }))}
              onSubmit={(data) => {
                handleRegistration(data);
                setShowRegistrationForm(false); // Hide the form after registration
              }}
            />
          </div>
        </div>
      ) : registeredClimber.length === 1 ? (
        <GradeSection
          grade={grades.find((g) => g.id === registeredClimber[0].selectedGrade)!}
          name={registeredClimber[0].name}
          grades={grades}
          onGradeChange={(newGradeId) => handleGradeChange(0, newGradeId)}
          onAddClimber={() => {
            setShowRegistrationForm(true); // Show the form for the second climber
          }}
          registeredClimber={{
            id: registeredClimber[0].id,
            name: registeredClimber[0].name,
            email: registeredClimber[0].email,
            date: registeredClimber[0].date,
            selectedGrade: registeredClimber[0].selectedGrade,
          }}
        />
      ) : (
        <Tabs defaultValue="climber1">
          <TabsList className="flex justify-center mb-6">
            {registeredClimber.map((climber, index) => (
              <TabsTrigger key={index} value={`climber${index + 1}`}>
                {climber.name}
              </TabsTrigger>
            ))}
        </TabsList>
        {registeredClimber.map((climber, index) => {
            const selectedGrade = grades.find(
                (g) => g.id === climber.selectedGrade
            );
            return (
                <TabsContent key={index} value={`climber${index + 1}`}>
                {selectedGrade && (
                    <GradeSection
                    grade={selectedGrade}
                    name={climber.name}
                    grades={grades}
                    onGradeChange={(newGradeId) =>
                        handleGradeChange(index, newGradeId)
                    }
                    onAddClimber={handleAddClimber}
                    registeredClimber={climber}
                />
                )}
            </TabsContent>
            );
          })}
        </Tabs>
      )}
    </>
  );
}
