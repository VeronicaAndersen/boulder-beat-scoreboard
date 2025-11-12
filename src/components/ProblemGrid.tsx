import { Star, Medal } from "lucide-react";
import { ScoreBatchResponse } from "@/types";
import { useScores } from "@/hooks/useScores";
import CalloutMessage from "./CalloutMessage";
import { useUpdateScoreBatch } from "@/hooks/useUpdateScoreBatchResult";
import { Button, Spinner } from "@radix-ui/themes";

interface ProblemGridProps {
  competitionId: number;
}
//change gradeLevel to hex color codes for different levels
const gradeColors: Record<number, string> = {
  1: "#C084FC",
  2: "#F9A8D4",
  3: "#FDBA74",
  4: "#FACC15",
  5: "#4ADE80",
  6: "#FFFFFF",
  7: "#000000",
};


export default function ProblemGrid({ competitionId }: ProblemGridProps) {
  const { problems, initialProblems, setProblems, isLoading, error, gradeLevel } = useScores(competitionId);
  const { saving, error: saveError, saveMessage, saveAll } = useUpdateScoreBatch();
  
  const gradeColor = gradeLevel ? gradeColors[gradeLevel] ?? "#D1D5DB" : "#D1D5DB";
  const updateField = (
    problemNo: number,
    field: keyof ScoreBatchResponse["score"],
    value: number
  ) => {
    setProblems((prev) =>
      prev.map((p) =>
        p.problem_no === problemNo
          ? { ...p, score: { ...p.score, [field]: Math.max(0, value) } }
          : p
      )
    );
  };

  const inc = (p: ScoreBatchResponse, key: keyof ScoreBatchResponse["score"]) => {
    updateField(p.problem_no, key, typeof p.score[key] === "number" ? p.score[key] + 1 : 1);
  };

  const dec = (p: ScoreBatchResponse, key: keyof ScoreBatchResponse["score"]) => {
    updateField(p.problem_no, key, Math.max(0, Number(p.score[key]) - 1));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner size="3" />
        <span className="ml-2">Hämtar poäng...</span>
      </div>
    );
  }
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      {saveMessage && <CalloutMessage message={saveMessage} color="blue" />}
      {saveError && <CalloutMessage message={saveError} color="red" />}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {problems.map((p) => {
          const orig = initialProblems.find((o) => o.problem_no === p.problem_no);
          const isChanged = orig && JSON.stringify(orig.score) !== JSON.stringify(p.score);

          return (
            <div
              key={p.problem_no}
              className={`relative p-4 rounded-xl shadow-sm flex flex-col border transition-all
                ${isChanged ? "border-yellow-500 bg-yellow-50" : "border-gray-300 bg-white"}
              `}
            >
              {isChanged && (
                <span className="absolute top-2 right-2 text-xs font-medium text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-md px-2 py-0.5">
                  Ej sparad
                </span>
              )}

              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Problem {p.problem_no}
                  </h3>
                  <span
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: gradeColor }}
                    title={`Gradnivå: ${gradeLevel}`}
                  />
                </div>
                <div className="flex gap-1">
                  {p.score.attempts_to_bonus > 0 && <Medal className="w-5 h-5 text-yellow-500" />}
                  {p.score.attempts_to_top > 0 && <Star className="w-5 h-5 text-green-500" />}
                </div>
              </div>

              {(["attempts_total", "attempts_to_bonus", "attempts_to_top"] as const).map((key) => (
                <div key={key} className="mb-3">
                  <label
                    htmlFor={`problem-${p.problem_no}-${key}`}
                    className="block text-sm text-[#7b8579] font-medium capitalize mb-1"
                  >
                    {key.replace(/_/g, " ")}
                  </label>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => dec(p, key)}
                      disabled={saving}
                      className="w-8 h-8 rounded-full bg-[#505654] hover:bg-[#7b8579] text-white font-bold text-lg cursor-pointer"
                      aria-label={`Minska ${key}`}
                    >
                      −
                    </Button>
                    <input
                      id={`problem-${p.problem_no}-${key}`}
                      type="number"
                      value={String(p.score[key])}
                      onChange={(e) => updateField(p.problem_no, key, Number(e.target.value))}
                      className="w-14 text-center border border-gray-300 rounded-md px-2 py-1 text-sm"
                    />
                    <Button
                      onClick={() => inc(p, key)}
                      disabled={saving}
                      className="w-8 h-8 rounded-full bg-[#505654] hover:bg-[#7b8579] text-white font-bold text-lg cursor-pointer"
                      aria-label={`Öka ${key}`}
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={() => saveAll(competitionId, gradeLevel!, problems)}
          disabled={saving}
          className="bg-[#505654] hover:bg-[#7b8579] text-white px-6 py-2 rounded-full shadow font-medium cursor-pointer"
        >
          {saving ? "Sparar..." : "Spara alla försök"}
        </Button>
      </div>
    </div>
  );
}
