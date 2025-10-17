import ProblemGrid from "@/components/ProblemGrid";
import { getClimberById, getCompetitions } from "@/hooks/api";
import { useAuthStore } from "@/store/auth";
import { Climber, Competitions } from "@/types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { climberId, setClimberId, setToken } = useAuthStore();
  const navigate = useNavigate();

  const [climber, setClimberData] = useState<Climber>({
    id: "",
    name: "",
    problemAttempts: [],
  });

  const [competitionsList, setCompetitions] = useState<Competitions>();
  const [comp, setComp] = useState<number | null>(null);

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
          navigate("/");
        }
      })
      .catch(() => navigate("/"));

    getCompetitions()
      .then((competitions) => {
        if (competitions) {
          setCompetitions({ competitions: competitions });
        }
      })
      .catch((err) => {
        console.error("Failed to fetch competitions:", err);
      });
  }, [climberId, navigate]);

  const handleLogout = () => {
    setToken(null);
    setClimberId(null);
    localStorage.removeItem("climber");
    navigate("/");
  };

  const selectCompetition = (compId: number) => {
    setComp(compId);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#c6d2b8] px-4">
      <div className="flex flex-col items-center">
        {/* Logo */}
        <img
          src="/grepp.svg"
          alt="Grepp logo"
          className="w-24 h-24 object-contain drop-shadow-md"
        />

        <div className="flex flex-col items-center justify-center min-h-screen bg-[#c6d2b8] p-4">
          <h1 className="mt-4 mb-2 text-4xl font-semibold">
            Välkommen {climber.name.toUpperCase()}
          </h1>
          <div className="w-full max-w-md mb-6">
            <h2 className="text-2xl font-semibold mb-4">Tävlingar</h2>
            <ul className="space-y-2">
              {competitionsList?.competitions.map((comp) => (
                <li
                  key={comp.id}
                  className="p-4 bg-white/90 rounded-2xl shadow hover:bg-white cursor-pointer"
                  onClick={() => selectCompetition(comp.id)}
                >
                  <h3 className="text-xl font-medium">{comp.name}</h3>
                  <p className="text-sm text-gray-600">Datum: {comp.date}</p>
                </li>
              ))}
            </ul>
          </div>

          <ProblemGrid competitionId={comp} selectedGrade="Gul" />

          <button
            className="absolute bg-[#505654] hover:bg-[#868f79] rounded px-4 py-2 mt-4 text-white top-4 right-4"
            onClick={handleLogout}
          >
            Logga ut
          </button>
        </div>
      </div>
    </div>
  );
}
