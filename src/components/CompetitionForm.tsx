import { createCompetition } from "@/hooks/api";
import { CompetitionRequest, MessageProps } from "@/types";
import { Button, Spinner } from "@radix-ui/themes";
import { useState } from "react";
import CalloutMessage from "./CalloutMessage";

export function CompetitionForm() {
  const [competitionData, setCompetitionData] = useState<CompetitionRequest>({
    name: "",
    description: "",
    comp_type: "",
    comp_date: "",
    season_id: 0,
    round_no: 0,
  });
  const [messageInfo, setMessageInfo] = useState<MessageProps | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createCompetition(competitionData);
      if (!result) {
        console.error("Failed to create competition:", result.statusText);
        setMessageInfo({ message: "Ett fel uppstod vid skapandet av tävlingen.", color: "red" });
        return;
      }
      setMessageInfo({ message: "Tävling skapad!", color: "blue" });
      // Reset form after submission
      setCompetitionData({
        name: "",
        description: "",
        comp_type: "",
        comp_date: "",
        season_id: 0,
        round_no: 0,
      });
    } catch (error) {
      console.error("Error creating competition:", error);
      setMessageInfo({ message: "Ett fel uppstod vid skapandet av tävlingen.", color: "red" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mb-6 h-fit flex flex-col bg-white/90 backdrop-blur p-4 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-semibold text-center mb-4">Skapa tävling</h1>
        {messageInfo && <CalloutMessage message={messageInfo.message} color={messageInfo.color} />}
        <label htmlFor="competition_name" className="block mb-1">
          Namn
        </label>
        <input
          id="competition_name"
          type="text"
          placeholder="Namn"
          value={competitionData.name}
          onChange={(e) => setCompetitionData({ ...competitionData, name: e.target.value })}
          className="w-full p-2 rounded-lg border"
          disabled={loading}
        />

        <label htmlFor="competition_description" className="block mb-1">
          Beskrivning
        </label>
        <input
          id="competition_description"
          type="text"
          placeholder="Beskrivning"
          value={competitionData.description}
          onChange={(e) => setCompetitionData({ ...competitionData, description: e.target.value })}
          className="w-full p-2 rounded-lg border"
          disabled={loading}
        />

        <label htmlFor="competition_type" className="block mb-1">
          Typ
        </label>
        <input
          id="competition_type"
          type="text"
          placeholder="Typ"
          value={competitionData.comp_type}
          onChange={(e) => setCompetitionData({ ...competitionData, comp_type: e.target.value })}
          className="w-full p-2 rounded-lg border"
          disabled={loading}
        />

        <label htmlFor="competition_date" className="block mb-1">
          Datum
        </label>
        <input
          id="competition_date"
          type="date"
          placeholder="Datum"
          value={competitionData.comp_date}
          onChange={(e) => setCompetitionData({ ...competitionData, comp_date: e.target.value })}
          className="w-full p-2 rounded-lg border"
          disabled={loading}
        />

        <label htmlFor="season_id" className="block mb-1">
          Säsong ID
        </label>
        <input
          id="season_id"
          type="number"
          placeholder="Säsong ID"
          value={competitionData.season_id}
          onChange={(e) =>
            setCompetitionData({ ...competitionData, season_id: Number(e.target.value) })
          }
          className="w-full p-2 rounded-lg border"
          disabled={loading}
        />

        <label htmlFor="round_no" className="block mb-1">
          Omgångsnummer
        </label>
        <input
          id="round_no"
          type="number"
          placeholder="Omgångsnummer"
          value={competitionData.round_no}
          onChange={(e) =>
            setCompetitionData({ ...competitionData, round_no: Number(e.target.value) })
          }
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
              <Spinner size="2" className="mr-2" /> Skapar tävling...
            </>
          ) : (
            "Skapa tävling"
          )}
        </Button>
      </form>
    </>
  );
}
