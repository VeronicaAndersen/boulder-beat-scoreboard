import { createSeason } from "@/hooks/api";
import { MessageProps, SeasonRequest } from "@/types";
import { Button, Spinner } from "@radix-ui/themes";
import { useState } from "react";
import CalloutMessage from "./CalloutMessage";

export function SeasonForm() {
  const [seasonData, setSeasonData] = useState<SeasonRequest>({ name: "", year: "" });
  const [messageInfo, setMessageInfo] = useState<MessageProps | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createSeason(seasonData);
      if (!result) {
        console.error("Failed to create season:", result.statusText);
        setMessageInfo({ message: "Ett fel uppstod vid skapandet av säsongen.", color: "red" });
        return;
      }
      setMessageInfo({ message: "Säsong skapad!", color: "blue" });
      setSeasonData({ name: seasonData.name, year: seasonData.year });
    } catch (error) {
      console.error("Error creating season:", error);
      setMessageInfo({ message: "Ett fel uppstod vid skapandet av säsongen.", color: "red" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 h-fit flex flex-col bg-white/90 backdrop-blur p-4 rounded-lg shadow-md"
    >
      <h1 className="text-2xl font-semibold text-center mb-4">Skapa säsong</h1>
      {messageInfo && <CalloutMessage message={messageInfo.message} color={messageInfo.color} />}
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
        disabled={loading}
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
        disabled={loading}
      />

      <Button
        className="mt-4 w-full cursor-pointer rounded-full bg-[#505654] hover:bg-[#868f79] disabled:bg-[#505654]/50 disabled:cursor-not-allowed flex items-center justify-center"
        type="submit"
        disabled={loading}
      >
        {loading ? (
          <>
            <Spinner size="2" className="mr-2" /> Skapar säsong...
          </>
        ) : (
          "Skapa säsong"
        )}
      </Button>
    </form>
  );
}
