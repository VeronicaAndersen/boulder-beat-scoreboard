// updateScore
import { useState } from "react";
import { updateScore } from "@/hooks/api";
import { ScoreRequest } from "@/types";

type UseUpdateScore = {
  saving: boolean;
  error: string | null;
  saveMessage: string | null;
  saveAll: (
    competitionId: number,
    level: number,
    problem_no: number,
    problem: ScoreRequest
  ) => Promise<boolean>;
};

export function useUpdateScore(): UseUpdateScore {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const saveAll = async (
    competitionId: number,
    level: number,
    problem_no: number,
    problem: ScoreRequest
  ): Promise<boolean> => {
    setSaving(true);
    setError(null);
    setSaveMessage(null);

    try {
      const payload: ScoreRequest = {
        attempts_total: problem.attempts_total,
        got_bonus: problem.attempts_to_bonus > 0,
        got_top: problem.attempts_to_top > 0,
        attempts_to_bonus: problem.attempts_to_bonus,
        attempts_to_top: problem.attempts_to_top,
      };

      const result = await updateScore(
        { comp_id: competitionId, level: level, problem_no: problem_no },
        payload
      );

      if (!result) {
        setError("Misslyckades att spara.");
        return false;
      }

      setSaveMessage("Poäng sparades.");
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { saving, error, saveMessage, saveAll };
}
