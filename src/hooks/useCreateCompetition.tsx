import { useState } from "react";
import { createCompetition } from "@/hooks/api";
import { CompetitionRequest } from "@/types";

interface UseCreateCompetitionResult {
  loading: boolean;
  error: string | null;
  success: boolean;
  createCompetition: (data: CompetitionRequest) => Promise<boolean>;
  reset: () => void;
}

export function useCreateCompetition(): UseCreateCompetitionResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleCreate = async (data: CompetitionRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await createCompetition(data);
      if (!result) {
        setError("Ett fel uppstod vid skapandet av tävlingen.");
        return false;
      }
      setSuccess(true);
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ett fel uppstod vid skapandet av tävlingen.";
      setError(message);
      console.error("Error creating competition:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    loading,
    error,
    success,
    createCompetition: handleCreate,
    reset,
  };
}
