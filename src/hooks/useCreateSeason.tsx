import { useState } from "react";
import { createSeason } from "@/hooks/api";
import { SeasonRequest } from "@/types";

interface UseCreateSeasonResult {
  loading: boolean;
  error: string | null;
  success: boolean;
  createSeason: (data: SeasonRequest) => Promise<boolean>;
  reset: () => void;
}

export function useCreateSeason(): UseCreateSeasonResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleCreate = async (data: SeasonRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await createSeason(data);
      if (!result) {
        setError("Ett fel uppstod vid skapandet av säsongen.");
        return false;
      }
      setSuccess(true);
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ett fel uppstod vid skapandet av säsongen.";
      setError(message);
      console.error("Error creating season:", err);
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
    createSeason: handleCreate,
    reset,
  };
}
