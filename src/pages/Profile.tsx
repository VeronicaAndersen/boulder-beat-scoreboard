import { getClimberById, getCompetitions } from "@/hooks/api";
import { useAuthStore } from "@/store/auth";
import { Climber, Competition, Problem } from "@/types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { climberId, setClimberId, setToken } = useAuthStore();
  const navigate = useNavigate();

  const [climberData, setClimberData] = useState<Climber>({
    id: "",
    name: "",
    selected_grade: "",
    problemAttempts: [],
  });

  const [problems, setProblems] = useState<Problem[]>([]);
  const [comp, setComp] = useState<Competition>({
    id: null,
    compname: "",
    compdate: "",
    comppart: null,
    visible: false,
  });

  useEffect(() => {
    const storedClimber = localStorage.getItem("climber");

    if (storedClimber) {
      try {
        const parsed = JSON.parse(storedClimber);
        if (parsed.climberId) {
          setClimberId(parsed.climberId);
          return;
        }
      } catch (err) {
        console.error("Failed to parse stored climber:", err);
      }
    }

    // No climber found, redirect to login
    navigate("/");
  }, [navigate, setClimberId]);

  useEffect(() => {
    if (!climberId) return;

    getClimberById(climberId)
      .then((climber) => {
        if (climber) {
          setClimberData(climber);
        } else {
          // invalid climber id, redirect to login
          navigate("/");
        }
      })
      .catch(() => navigate("/"));

    getCompetitions().then((competitions) => {
      if (competitions && competitions.length > 0) {
        setComp(competitions[0]);
      }
    });
  }, [climberId, navigate]);

  const handleLogout = () => {
    setToken(null);
    setClimberId(null);
    localStorage.removeItem("climber");
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#c6d2b8] p-4">
      <h1 className="mt-4 mb-2 text-lg font-semibold">{comp.compname + " del " + comp.comppart}</h1>

      <div className="bg-white/95 backdrop-blur shadow-xl rounded-lg p-6 w-full max-w-md mt-4">
        <p>
          <strong>Namn:</strong> {climberData.name}
        </p>
        <p>
          <strong>Vald grad:</strong> {climberData.selected_grade}
        </p>
      </div>

      {/* <ProblemGrid problems={problems} registeredClimber={climberData} /> */}

      <button
        className="absolute bg-[#505654] hover:bg-[#868f79] rounded px-4 py-2 mt-4 text-white top-4 right-4"
        onClick={handleLogout}
      >
        Logga ut
      </button>
    </div>
  );
}
