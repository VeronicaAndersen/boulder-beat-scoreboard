import { useEffect, useState } from "react";
import { getProblemAttempts, submitProblemAttempt } from "@/hooks/api";
import { useAuthStore } from "@/store/auth";
import { Star, Medal } from "lucide-react";

const gradeColors: Record<string, string> = {
  Lila: "#C084FC",
  Rosa: "#F9A8D4",
  Orange: "#FDBA74",
  Gul: "#FACC15",
  Grön: "#4ADE80",
  Vit: "#FFFFFF",
  Svart: "#000000",
};

type Problem = {
  problem_id: number;
  problem_name: string;
  grade: string;
  attempts: number;
  bonus: number;
  top: number;
};

interface ProblemGridProps {
  competitionId: number;
  selectedGrade: string;
}

export default function ProblemGrid({ competitionId, selectedGrade }: ProblemGridProps) {
  const climberId = useAuthStore((s) => s.climberId);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [initialProblems, setInitialProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Load attempts
  useEffect(() => {
    if (!climberId || !competitionId || !selectedGrade) return;
    let alive = true;

    const fetchAttempts = async (): Promise<void> => {
      try {
        setLoading(true);
        const data = await getProblemAttempts(climberId, competitionId, selectedGrade);
        if (!alive) return;

        const normalized = (data?.problems || []).map((p: Problem, index: number) => ({
          ...p,
          number: index + 1,
        }));

        setProblems(normalized);
        setInitialProblems(JSON.parse(JSON.stringify(normalized)));
      } catch (err) {
        if (alive) {
          const message = err instanceof Error ? err.message : "Kunde inte hämta problemförsök.";
          setError(message);
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchAttempts();
    return () => {
      alive = false;
    };
  }, [climberId, competitionId, selectedGrade]);

  const updateField = (problemId: number, field: keyof Problem, value: number) => {
    setProblems((prev) =>
      prev.map((p) => (p.problem_id === problemId ? { ...p, [field]: Math.max(0, value) } : p))
    );
  };

  const inc = (problemId: number, field: keyof Problem) =>
    setProblems((prev) =>
      prev.map((p) =>
        p.problem_id === problemId ? { ...p, [field]: (p[field] as number) + 1 } : p
      )
    );

  const dec = (problemId: number, field: keyof Problem) =>
    setProblems((prev) =>
      prev.map((p) =>
        p.problem_id === problemId ? { ...p, [field]: Math.max(0, (p[field] as number) - 1) } : p
      )
    );

  // Save only changed fields
  // Save a single problem
  const saveProblem = async (problemId: number): Promise<void> => {
    if (!climberId) {
      setError("Ingen klättrare är inloggad.");
      return;
    }

    const problem = problems.find((p) => p.problem_id === problemId);
    if (!problem) return;

    try {
      setSaving(true);
      setError(null);
      setSaveMessage(null);

      const payload = {
        attempts: problem.attempts,
        bonus: problem.bonus,
        top: problem.top,
      };

      await submitProblemAttempt(climberId, competitionId, problem.problem_id, payload);

      // Update initial state for that specific problem
      setInitialProblems((prev) =>
        prev.map((p) => (p.problem_id === problemId ? { ...problem } : p))
      );

      setSaveMessage(
        `Försök sparat för ${problem.problem_name || "problem " + problem.problem_id}.`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Kunde inte spara försök.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-600">Välj en tävling ovan</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="w-full max-w-6xl mx-auto bg-gradient-to-br from-[#eef1eb] to-[#f9faf8] rounded-2xl shadow-lg p-4 border border-[#d4d7d0]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#505654]">
          Dina försök – <span className="text-[#7b8579]">Tävling #{competitionId}</span>
        </h2>
      </div>

      {saveMessage && (
        <p className="text-green-700 text-sm mb-4 bg-green-100 border border-green-200 rounded-md px-3 py-2 w-fit">
          {saveMessage}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        {problems.map((p) => {
          const color = gradeColors[p.grade] || "#D1D5DB";
          const summary = `B${p.bonus ?? 0}T${p.top ?? 0}`;

          const isChanged = (() => {
            const orig = initialProblems.find((o) => o.problem_id === p.problem_id);
            if (!orig) return false;
            return p.attempts !== orig.attempts || p.bonus !== orig.bonus || p.top !== orig.top;
          })();

          return (
            <div
              key={p.problem_id}
              className={`relative p-4 rounded-xl shadow-sm hover:shadow-lg transition-all flex flex-col justify-between border
    ${isChanged ? "border-yellow-400 bg-yellow-50" : "border-[#ccd0c7] bg-white/90"}
  `}
            >
              {isChanged && (
                <span className="absolute top-2 right-2 text-xs font-medium text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-md px-2 py-0.5">
                  Ej sparad
                </span>
              )}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-[#505654] truncate">
                    {p.problem_name || `Problem #${p.problem_id}`}
                  </h3>
                  <span
                    className="w-5 h-5 rounded-full border border-gray-300 shadow-sm"
                    style={{ backgroundColor: color }}
                    title={`Grad: ${p.grade}`}
                  ></span>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm italic font-semibold text-[#505654]">{summary}</p>
                  <div className="flex gap-1">
                    {p.bonus > 0 && <Medal className="w-5 h-5 text-yellow-500" />}
                    {p.top > 0 && <Star className="w-5 h-5 text-green-500" />}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { key: "attempts", label: "Försök" },
                  { key: "bonus", label: "Bonus" },
                  { key: "top", label: "Top" },
                ].map(({ key, label }) => (
                  <div
                    key={key}
                    className="flex justify-between items-center bg-gray-50 rounded-md"
                  >
                    <label className="text-sm text-gray-700">{label}</label>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => dec(p.problem_id, key as keyof Problem)}
                        disabled={saving}
                        className="w-7 h-7 rounded-full bg-[#505654] hover:bg-[#868f79] text-white text-lg font-semibold"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={p[key as keyof Problem] as number}
                        onChange={(e) =>
                          updateField(
                            p.problem_id,
                            key as keyof Problem,
                            parseInt(e.target.value || "0", 10)
                          )
                        }
                        className="w-12 text-center border border-gray-300 rounded-md text-sm p-1"
                      />
                      <button
                        onClick={() => inc(p.problem_id, key as keyof Problem)}
                        disabled={saving}
                        className="w-7 h-7 rounded-full bg-[#505654] hover:bg-[#868f79] text-white text-lg font-semibold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => saveProblem(p.problem_id)}
                  disabled={saving}
                  className={`mt-3 px-4 py-2 rounded-md font-medium text-white shadow transition ${
                    saving ? "bg-gray-500 cursor-not-allowed" : "bg-[#505654] hover:bg-[#7b8579]"
                  }`}
                >
                  {saving ? "Sparar..." : "Spara ändringar"}
                </button>
              </div>
            </div>
          );
        })}
        {/* create a button to save all */}
        <div className="col-span-full flex justify-center mt-8">
          <button
            onClick={async () => {
              if (!climberId) {
                setError("Ingen klättrare är inloggad.");
                return;
              }
              try {
                setSaving(true);
                setError(null);
                setSaveMessage(null);

                // save every problem’s current state
                for (const p of problems) {
                  const payload = {
                    attempts: p.attempts,
                    bonus: p.bonus,
                    top: p.top,
                  };
                  await submitProblemAttempt(climberId, competitionId, p.problem_id, payload);
                }

                setInitialProblems(JSON.parse(JSON.stringify(problems)));
                setSaveMessage("Alla försök sparades!");
              } catch (err) {
                const message = err instanceof Error ? err.message : "Kunde inte spara försök.";
                setError(message);
              } finally {
                setSaving(false);
              }
            }}
            disabled={saving}
            className={`px-6 py-3 rounded-md font-medium text-white shadow transition ${
              saving ? "bg-gray-500 cursor-not-allowed" : "bg-[#505654] hover:bg-[#7b8579]"
            }`}
          >
            {saving ? "Sparar alla..." : "Spara alla försök"}
          </button>
        </div>
      </div>
    </div>
  );
}
