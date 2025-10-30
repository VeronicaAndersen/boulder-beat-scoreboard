import { getCompetitions } from "@/hooks/api";
import { CompetitionResponse } from "@/types";
import { useState, useEffect } from "react";

export function CompetitionList() {
  const [competitionList, setCompetitionList] = useState<CompetitionResponse[]>([]);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const competitions = await getCompetitions();
        console.log("competitions data:", competitions);
        if (competitions) {
          setCompetitionList(competitions);
        }
        console.log("Fetched competitions:", competitions);
      } catch (error) {
        console.error("Error fetching competitions:", error);
        alert("Failed to fetch competitions. Please check your connection and try again.");
      }
    };

    fetchCompetitions();
  }, []);

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Tävlingar</h2>
      {competitionList && competitionList.length > 0 ? (
        <ul className="mb-4">
          {competitionList.map((comps) => (
            <li key={comps.id} className="mb-2">
              <span className="font-medium">{comps.name}</span> - {comps.comp_date}
            </li>
          ))}
        </ul>
      ) : (
        <p>Inga säsonger tillgängliga.</p>
      )}
    </div>
  );
}
