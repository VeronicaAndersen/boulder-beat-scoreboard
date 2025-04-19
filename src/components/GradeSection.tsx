import { Card } from "./ui/card";
import { ProblemGrid } from "./ProblemGrid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import type { Grade, RegistrationData } from "@/types";

interface GradeSectionProps {
  grade: Grade;
  name: string;
  grades: Grade[]; // Add all available grades
  onGradeChange: (newGradeId: number) => void; // Callback for grade change
  onAddClimber: () => void; // Callback for adding another user
  registeredClimber: RegistrationData; // Add registeredUser as a prop
}

export function GradeSection({
  grade,
  name,
  grades,
  onGradeChange,
  onAddClimber,
  registeredClimber,
}: GradeSectionProps) {
  // const handleSubmitAllClimbers = async () => {
  //   try {
  //     // Retrieve all data from localStorage
  //     const appData = localStorage.getItem("appData");
  //     if (!appData) {
  //       alert("No data found in localStorage to submit.");
  //       return;
  //     }

  //     // Parse the data
  //     const parsedData = JSON.parse(appData);
  //     const token = import.meta.env.VITE_REACT_APP_API_TOKEN;
  //     // Send the data to the API endpoint
  //     const response = await fetch("https://web-production-9e43d.up.railway.app/Climbers/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(parsedData),
  //     });

  //     if (response.ok) {
  //       alert("All climbers submitted successfully!");
  //       console.log("Response:", await response.json());
  //     } else {
  //       alert("Failed to submit climbers. Please try again.");
  //       console.error("Error:", await response.text());
  //     }
  //   } catch (error) {
  //     console.error("An error occurred while submitting climbers:", error);
  //     alert("An error occurred. Please check the console for details.");
  //   }
  // };

  return (
    <>
      <div className="mt-6 flex justify-end">
        <Button onClick={onAddClimber} className="bg-[#505654] hover:bg-[#868f79]">
          Lägg till ny klättrare
        </Button>
      </div>
      <Card className="p-6 bg-white/95 backdrop-blur">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{name.toUpperCase()}</h1>
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: grade.color, boxShadow: `0 4px 6px rgba(0, 0, 0, 0.1)` }}
            />
          </div>
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Ändra nivå: </h2>
            <Select
              value={grade.id.toString()}
              onValueChange={(value) => onGradeChange(parseInt(value))}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Change Grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((g) => (
                  <SelectItem key={g.id} value={g.id.toString()}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <ProblemGrid problems={grade.problems} registeredClimber={registeredClimber} />
      </Card>
      {/* <div className="mt-6 flex justify-end">
        <Button onClick={handleSubmitAllClimbers} className="bg-[#505654] hover:bg-[#868f79]">
          Submit All Climbers
        </Button>
      </div> */}
    </>
  );
}
