import { useState } from "react";
import { RegistrationForm } from "@/components/RegistrationForm";
import { GradeSection } from "@/components/GradeSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Grade, RegistrationData } from "@/types";

interface RegistrationPageProps {
  grades: Grade[];
  registeredUsers: RegistrationData[];
  handleRegistration: (data: RegistrationData) => void;
  handleGradeChange: (index: number, newGradeId: number) => void;
  handleAddUser: () => void;
}

export function RegistrationPage({
  grades,
  registeredUsers,
  handleRegistration,
  handleGradeChange,
  handleAddUser,
}: RegistrationPageProps) {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  return (
    <>
      {registeredUsers.length === 0 || showRegistrationForm ? (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Register Now
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
      ) : registeredUsers.length === 1 ? (
        <GradeSection
          grade={grades.find((g) => g.id === registeredUsers[0].selectedGrade)!}
          name={registeredUsers[0].name}
          grades={grades}
          onGradeChange={(newGradeId) => handleGradeChange(0, newGradeId)}
          onAddUser={() => {
            setShowRegistrationForm(true); // Show the form for the second user
          }}
        />
      ) : (
        <Tabs defaultValue="user1">
          <TabsList className="flex justify-center mb-6">
            {registeredUsers.map((user, index) => (
              <TabsTrigger key={index} value={`user${index + 1}`}>
                {user.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {registeredUsers.map((user, index) => {
            const selectedGrade = grades.find(
              (g) => g.id === user.selectedGrade
            );
            return (
              <TabsContent key={index} value={`user${index + 1}`}>
                {selectedGrade && (
                  <GradeSection
                    grade={selectedGrade}
                    name={user.name}
                    grades={grades}
                    onGradeChange={(newGradeId) =>
                      handleGradeChange(index, newGradeId)
                    }
                    onAddUser={handleAddUser}
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
