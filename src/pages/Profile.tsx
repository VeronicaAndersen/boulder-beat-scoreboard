import ProblemGrid from "@/components/ProblemGrid";
import { getClimberById, getCompetitions } from "@/hooks/api";
import { useAuthStore } from "@/store/auth";
import { Climber, Competition } from "@/types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { climberId, setClimberId, setToken } = useAuthStore();
  const navigate = useNavigate();

  const [, setClimberData] = useState<Climber>({
    id: "",
    name: "",
    selected_grade: "",
    problemAttempts: [],
  });

  const [competition_id, setComp] = useState<Competition>({
    id: null,
    name: "",
    date: "",
    participants: null,
    visible: false,
  });

  useEffect(() => {
    const storedClimber = localStorage.getItem("climber");
    if (!storedClimber) {
      navigate("/");
      return;
    }

    try {
      const parsed = JSON.parse(storedClimber);
      if (parsed.climberId) {
        setClimberId(parsed.climberId);
      } else {
        console.error("Invalid climber data in localStorage:", parsed);
        navigate("/");
      }
    } catch {
      console.error("Failed to parse climber data from localStorage");
      navigate("/");
    }
  }, [navigate, setClimberId]);

  useEffect(() => {
    if (!climberId) return;

    getClimberById(climberId)
      .then((climber) => {
        if (climber) {
          setClimberData(climber);
        } else {
          console.error("No climber data found for id:", climberId);
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
      <h1 className="mt-4 mb-2 text-4xl font-semibold">{competition_id.name}</h1>

      <ProblemGrid competitionId={competition_id.id} />

      <button
        className="absolute bg-[#505654] hover:bg-[#868f79] rounded px-4 py-2 mt-4 text-white top-4 right-4"
        onClick={handleLogout}
      >
        Logga ut
      </button>
    </div>
  );
}
