import { getCompRegistrationInfo, getScoresBatch } from "@/hooks/api";
import { RegisterToCompResponse, ScoreBatchResponse } from "@/types";
import { Button } from "@radix-ui/themes";
import { useEffect, useState } from "react";

type ScoresProps = {
  competition_id: number;
};

export default function Scores({ competition_id }: ScoresProps) {
  const [choosenComphInfo, setChoosenCompInfo] = useState<RegisterToCompResponse | null>(null);
  const [scoreBatch, setScoreBatch] = useState<ScoreBatchResponse[]>([]);

  useEffect(() => {
    const fetchCompInfo = async () => {
      try {
        const info = await getCompRegistrationInfo(competition_id);
        if (info) setChoosenCompInfo(info);
      } catch (error) {
        console.error("Error fetching competition info:", error);
      }
    };

    fetchCompInfo();
  }, [competition_id]);

  const getBatchScore = async () => {
    if (!choosenComphInfo) {
      alert("Ingen tävlingsinfo tillgänglig.");
      return;
    }

    try {
      const result = await getScoresBatch({
        comp_id: competition_id,
        level: choosenComphInfo.level,
      });

      if (result) setScoreBatch(result);
    } catch (error) {
      console.error("Error viewing scorebatch:", error);
      alert("Kunde inte hämta poäng. Försök igen.");
    }
  };

  return (
    <div className="mt-6 w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-[#505654]">Poäng per problem</h2>

      <div className="flex justify-end mb-4">
        <Button
          className="bg-[#505654] hover:bg-[#868f79] disabled:bg-[#505654]/50 disabled:cursor-not-allowed"
          onClick={getBatchScore}
        >
          Visa
        </Button>
      </div>

      {scoreBatch.length === 0 ? (
        <p className="text-gray-600 text-center">Inga poäng tillgängliga.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {scoreBatch.map((score) => (
            <div
              key={score.problem_no}
              className="p-4 rounded-xl shadow-sm hover:shadow-lg transition-all border border-[#ccd0c7] bg-white"
            >
              <h3 className="text-lg font-semibold text-[#505654] mb-2">
                Problem #{score.problem_no}
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>
                  <strong>Försök totalt:</strong> {score.score.attempts_total}
                </li>
                <li>
                  <strong>Bonus:</strong> {score.score.got_bonus ? "Ja" : "Nej"} (
                  {score.score.attempts_to_bonus ?? "-"} försök)
                </li>
                <li>
                  <strong>Top:</strong> {score.score.got_top ? "Ja" : "Nej"} (
                  {score.score.attempts_to_top ?? "-"} försök)
                </li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
