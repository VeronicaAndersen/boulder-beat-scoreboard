import getClimberById from "@/hooks/api";
import { useAuthStore } from "@/store/auth";
import { Climber } from "@/types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const climberId = useAuthStore((state) => state.climberId);
  const navigate = useNavigate();

  const [climberData, setClimberData] = useState<Climber>({
    id: "",
    name: "",
    selected_grade: "",
    problemAttempts: [],
  });

  useEffect(() => {
    if (!climberId) return;

    getClimberById(climberId).then((data) => {
      if (data) setClimberData(data);
    });
  }, [climberId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#a3b18a] to-[#506d4a] p-4">
      <div className="bg-white/95 backdrop-blur shadow-xl rounded-lg p-6 w-full max-w-md mt-4">
        <p><strong>Namn:</strong> {climberData.name}</p>
        <p><strong>Vald grad:</strong> {climberData.selected_grade}</p>
        <p><strong>Antal problemförsök:</strong> {climberData.problemAttempts?.length || 0}</p>
      </div>
      <button
        className="bg-[#505654] hover:bg-[#868f79] rounded px-4 py-2 mt-4"
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
