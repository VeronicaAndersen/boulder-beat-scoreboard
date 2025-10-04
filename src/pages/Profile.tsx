import { ProblemGrid } from "@/components/ProblemGrid";
import { getClimberById, getCompetitions } from "@/hooks/api";
import { useAuthStore } from "@/store/auth";
import { Climber, Competition, Problem } from "@/types";
import { set } from "date-fns";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const climberId = useAuthStore((state) => state.climberId);
  const navigate = useNavigate();
  // const getAllCompetitions = [] as Competition[];

  const [climberData, setClimberData] = useState<Climber>({
    id: "",
    name: "",
    selected_grade: "",
    problemAttempts: [],
  });

  // const [problems, setProblems] = useState<Problem[]>([]);
  const [comp, setComp] = useState<Competition>({
    id: null,
    compname: "",
    compdate: "",
    comppart: null,
    visible: false,
  });

  useEffect(() => {
    if (!climberId) return;

    // fetch climber
    getClimberById(climberId).then((climber) => {
      if (climber) setClimberData(climber);
    });

    // fetch competitions
    getCompetitions().then((competitions) => {
      if (competitions && competitions.length > 0) {
        setComp(competitions[0]);
        console.log(competitions);
      }
    });
  }, [climberId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#c6d2b8] p-4">
      <div className="bg-white/95 backdrop-blur shadow-xl rounded-lg p-6 w-full max-w-md mt-4">
        <p>
          <strong>Namn:</strong> {climberData.name}
        </p>
        <p>
          <strong>Vald grad:</strong> {climberData.selected_grade}
        </p>
      </div>

    <p className="mt-4 mb-2 text-lg font-semibold">
      Competitions: {comp.compname + " " + comp.comppart}
    </p>

      {/* <ProblemGrid
        problems={problems}
        registeredClimber={climberData}
      /> */}

      <button
        className="absolute bg-[#505654] hover:bg-[#868f79] rounded px-4 py-2 mt-4 text-white top-4 right-4"
        onClick={() => {
          useAuthStore.getState().setToken(null);
          useAuthStore.getState().setClimberId(null);
          localStorage.removeItem("climbers");
          navigate("/");
        }}
      >
        Logga ut
      </button>
    </div>
  );
}
