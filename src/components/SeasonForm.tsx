import { createSeason } from "@/hooks/api";
import { SeasonRequest } from "@/types";
import { Button } from "@radix-ui/themes";
import { useState } from "react";

export function SeasonForm() {
  const [seasonData, setSeasonData] = useState<SeasonRequest>({ name: "", year: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createSeason(seasonData);
      setSeasonData({ name: "", year: "" });
    } catch (error) {
      console.error("Error creating season:", error);
      alert("Failed to create season. Please check your connection and try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white/90 backdrop-blur rounded-lg shadow-md"
    >
      <h1 className="text-2xl font-semibold text-center mb-4">Skapa säsong</h1>

      <label htmlFor="season_name" className="block mb-1">
        Namn
      </label>
      <input
        id="season_name"
        type="text"
        placeholder="Namn"
        value={seasonData.name}
        onChange={(e) => setSeasonData({ ...seasonData, name: e.target.value })}
        className="w-full p-2 rounded-lg border"
      />

      <label htmlFor="season_year" className="block mt-3 mb-1">
        År
      </label>
      <input
        id="season_year"
        type="number"
        placeholder="År"
        value={seasonData.year}
        onChange={(e) => setSeasonData({ ...seasonData, year: e.target.value })}
        className="w-full p-2 rounded-lg border"
      />

      <Button
        className="mt-4 w-full bg-[#505654] hover:bg-[#868f79] disabled:bg-[#505654]/50 disabled:cursor-not-allowed"
        type="submit"
      >
        Skapa säsong
      </Button>
    </form>
  );
}
