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

type ProblemAttempt = {
  id: number;
  problem_id: number;
  name: string;
  number: number;
  grade: string;
  attempts: number;
  top: number;
  bonus: number;
};

interface ProblemGridProps {
  competitionId: number;
}

export default function ProblemGrid({ competitionId }: ProblemGridProps) {
  const climberId = useAuthStore((s) => s.climberId);
  const [attempts, setAttempts] = useState<ProblemAttempt[]>([]);
  const [initialAttempts, setInitialAttempts] = useState<ProblemAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // 🧠 Load attempts
  useEffect(() => {
    if (!climberId || !competitionId) return;
    let alive = true;

    const fetchAttempts = async (): Promise<void> => {
      try {
        setLoading(true);
        const data: ProblemAttempt[] = await getProblemAttempts(climberId, competitionId);
        if (!alive) return;

        const normalized = (data || []).map((a) => ({
          ...a,
          problem_id: a.problem_id ?? a.id,
        }));

        setAttempts(normalized);
        setInitialAttempts(JSON.parse(JSON.stringify(normalized)));
      } catch (err) {
        if (alive) {
          const message = err instanceof Error ? err.message : "Kunde inte hämta försök.";
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
  }, [climberId, competitionId]);

  const updateField = (problemId: number, field: keyof ProblemAttempt, value: number) => {
    setAttempts((prev) =>
      prev.map((a) => (a.problem_id === problemId ? { ...a, [field]: Math.max(0, value) } : a))
    );
  };

  const inc = (problemId: number, field: keyof ProblemAttempt) =>
    setAttempts((prev) =>
      prev.map((a) =>
        a.problem_id === problemId ? { ...a, [field]: (a[field] as number) + 1 } : a
      )
    );

  const dec = (problemId: number, field: keyof ProblemAttempt) =>
    setAttempts((prev) =>
      prev.map((a) =>
        a.problem_id === problemId ? { ...a, [field]: Math.max(0, (a[field] as number) - 1) } : a
      )
    );

  // Save only changed fields
  const onSave = async (): Promise<void> => {
    if (!climberId) {
      setError("Ingen klättrare är inloggad.");
      return;
    }

    const changed = attempts.filter((a) => {
      const orig = initialAttempts.find((o) => o.problem_id === a.problem_id);
      if (!orig) return true;
      return a.attempts !== orig.attempts || a.top !== orig.top || a.bonus !== orig.bonus;
    });

    if (changed.length === 0) {
      setSaveMessage("Inga ändringar att spara.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSaveMessage(null);

      for (const a of changed) {
        const orig = initialAttempts.find((o) => o.problem_id === a.problem_id);
        if (!orig) continue;

        // Skicka endast fält som ändrats
        const updatedFields: Record<string, number> = {};
        if (a.attempts !== orig.attempts) updatedFields.attempts = a.attempts;
        if (a.top !== orig.top) updatedFields.top = a.top;
        if (a.bonus !== orig.bonus) updatedFields.bonus = a.bonus;

        await submitProblemAttempt(climberId, a.problem_id, updatedFields);
      }

      setInitialAttempts(JSON.parse(JSON.stringify(attempts)));
      setSaveMessage("Försök uppdaterades!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Kunde inte spara försök.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-600">Hämtar försök...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="w-full max-w-6xl mx-auto bg-gradient-to-br from-[#eef1eb] to-[#f9faf8] rounded-2xl shadow-lg p-8 border border-[#d4d7d0]">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {attempts.map((a) => {
          const grade = a.grade ?? "Vit";
          const color = gradeColors[grade] || "#D1D5DB";
          const summary = `B${a.bonus ?? 0}T${a.top ?? 0}`;

          return (
            <div
              key={a.problem_id}
              className="p-5 border border-[#ccd0c7] rounded-xl bg-white/90 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-[#505654] truncate">
                    {a.name || `Problem #${a.number}`}
                  </h3>
                  <span
                    className="w-5 h-5 rounded-full border border-gray-300 shadow-sm"
                    style={{ backgroundColor: color }}
                    title={`Grad: ${grade}`}
                  ></span>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm italic font-semibold text-[#505654]">{summary}</p>
                  <div className="flex gap-1">
                    {a.bonus > 0 && <Medal className="w-5 h-5 text-yellow-500" />}
                    {a.top > 0 && <Star className="w-5 h-5 text-green-500" />}
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
                    className="flex justify-between items-center bg-gray-50 rounded-md px-3 py-2"
                  >
                    <label className="text-sm font-medium text-gray-700">{label}</label>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => dec(a.problem_id, key as keyof ProblemAttempt)}
                        disabled={saving}
                        className="w-7 h-7 rounded-full bg-[#505654] hover:bg-[#868f79] text-white text-lg font-semibold"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={a[key as keyof ProblemAttempt] as number}
                        onChange={(e) =>
                          updateField(
                            a.problem_id,
                            key as keyof ProblemAttempt,
                            parseInt(e.target.value || "0", 10)
                          )
                        }
                        className="w-14 text-center border border-gray-300 rounded-md text-sm p-1"
                      />
                      <button
                        onClick={() => inc(a.problem_id, key as keyof ProblemAttempt)}
                        disabled={saving}
                        className="w-7 h-7 rounded-full bg-[#505654] hover:bg-[#868f79] text-white text-lg font-semibold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={onSave}
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
      </div>
    </div>
  );
}
