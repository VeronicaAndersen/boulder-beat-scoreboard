import { useEffect, useState } from "react";
import { getProblemAttempts, submitProblemAttempt } from "@/hooks/api";
import { useAuthStore } from "@/store/auth";
import { Button, TextField } from "@radix-ui/themes";

const gradeColors: Record<string, string> = {
  Lila: "#C084FC",
  Rosa: "#F9A8D4",
  Orange: "#FDBA74",
  Gul: "#FACC15",
  Grön: "#4ADE80",
  Vit: "#FFFFFF",
  Svart: "#000000",
};

export interface ProblemAttempt {
  id: number;
  problem_id: number;
  name: string;
  number: number;
  grade: string;
  attempts: number;
  top: number;
  bonus: number;
}

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

  useEffect(() => {
    if (!climberId || !competitionId) return;

    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getProblemAttempts(climberId, competitionId);

        if (!alive) return;

        const normalized: ProblemAttempt[] = (data ?? []).map((a: ProblemAttempt) => ({
          ...a,
          problem_id: a.problem_id ?? a.id,
        }));

        setAttempts(normalized);
        setInitialAttempts(JSON.parse(JSON.stringify(normalized)));
      } catch (err) {
        if (!alive) return;
        const message = err instanceof Error ? err.message : "Kunde inte hämta försök.";
        setError(message);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [climberId, competitionId]);

  // 🧮 Update helpers
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

  // 💾 Save logic
  const onSave = async () => {
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
        if (!a.problem_id) continue;
        await submitProblemAttempt(climberId, a.problem_id, a.attempts, a.top, a.bonus);
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
    <div className="w-full max-w-5xl mx-auto bg-gradient-to-br from-[#e5eadf] to-[#f5f7f3] rounded-2xl shadow-xl p-8 border border-[#505654]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#505654]">
          Dina försök – <span className="text-[#7d8c6e]">Tävling #{competitionId}</span>
        </h2>
        <Button
          onClick={onSave}
          disabled={saving}
          className="bg-[#505654] hover:bg-[#7b8579] text-white shadow-md transition-all"
        >
          {saving ? "Sparar..." : "Spara ändringar"}
        </Button>
      </div>

      {saveMessage && (
        <p className="text-green-700 text-sm mb-4 bg-green-100/70 border border-green-200 rounded-md px-3 py-2 w-fit">
          {saveMessage}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {attempts.map((a) => {
          const grade = a.grade ?? "Vit";
          const color = gradeColors[grade] || "#D1D5DB";

          return (
            <div
              key={a.problem_id}
              className="relative rounded-xl bg-white shadow-md border border-[#505654] hover:shadow-lg transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-[#505654] truncate">
                    {a.name || `Problem #${a.number}`}
                  </h3>
                  <span
                    title={grade}
                    className="w-5 h-5 rounded-full border border-gray-400 shadow-sm"
                    style={{ backgroundColor: color }}
                  ></span>
                </div>
                <p className="text-xs text-gray-500 mb-4">Grad: {grade}</p>
              </div>

              <div className="space-y-3">
                {[
                  { key: "attempts" as keyof ProblemAttempt, label: "Försök" },
                  { key: "bonus" as keyof ProblemAttempt, label: "Bonus" },
                  { key: "top" as keyof ProblemAttempt, label: "Top" },
                ].map(({ key, label }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                  >
                    <label className="text-sm font-medium text-gray-700">{label}</label>
                    <div className="flex items-center gap-1">
                      <Button
                        size="1"
                        onClick={() => dec(a.problem_id, key)}
                        disabled={saving}
                        className="w-7 h-7 rounded-full text-lg bg-[#505654] hover:bg-[#868f79]"
                      >
                        −
                      </Button>
                      <TextField.Root
                        type="number"
                        value={a[key] as number}
                        onChange={(e) =>
                          updateField(a.problem_id, key, parseInt(e.target.value || "0", 10))
                        }
                        className="w-14 text-center text-sm border-gray-300 rounded-md"
                      />
                      <Button
                        size="1"
                        onClick={() => inc(a.problem_id, key)}
                        disabled={saving}
                        className="w-7 h-7 rounded-full text-lg bg-[#505654] hover:bg-[#868f79]"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
