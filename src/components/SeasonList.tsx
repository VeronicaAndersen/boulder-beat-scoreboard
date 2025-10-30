import { getSeasons } from "@/hooks/api";
import { SeasonResponse } from "@/types";
import { useEffect, useState } from "react";

export function SeasonList() {
  const [seasonList, setSeasonList] = useState<SeasonResponse[]>([]);

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const seasons = await getSeasons();
        if (seasons) {
          setSeasonList(seasons);
        }
      } catch (error) {
        console.error("Error fetching seasons:", error);
        alert("Failed to fetch seasons. Please check your connection and try again.");
      }
    };

    fetchSeasons();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Säsonger</h2>
      {seasonList && seasonList.length > 0 ? (
        <ul>
          {seasonList.map((season) => (
            <li key={season.id} className="mb-2">
              <span className="font-medium">{season.name}</span> - {season.year}{" "}
              {/* Year not in db */}
            </li>
          ))}
        </ul>
      ) : (
        <p>Inga säsonger tillgängliga.</p>
      )}
    </div>
  );
}
