import { getCompetitions } from "@/hooks/api";
import { CompetitionResponse, MessageProps } from "@/types";
import { useState, useEffect } from "react";
import RegisterToCompForm from "./RegisterToCompForm";
import CalloutMessage from "./CalloutMessage";
import ProblemGrid from "./ProblemGrid";
import { Spinner } from "@radix-ui/themes";

export function CompetitionList() {
  const [competitionList, setCompetitionList] = useState<CompetitionResponse[]>([]);
  const [messageInfo, setMessageInfo] = useState<MessageProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCompetitions = async () => {
      setLoading(true);
      try {
        const competitions = await getCompetitions();

        if (competitions.length > 0) {
          setCompetitionList(competitions);
        }
      } catch (error) {
        console.error("Error fetching competitions:", error);
        setMessageInfo({ message: "Ett fel uppstod vid hämtning av tävlingar.", color: "red" });
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  return (
    <div className="mb-6 flex flex-col bg-white/90 backdrop-blur p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Tävlingar</h2>
      {messageInfo && <CalloutMessage message={messageInfo.message} color={messageInfo.color} />}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Spinner size="3" />
          <span className="ml-2">Hämtar tävlingar...</span>
        </div>
      ) : competitionList.length > 0 ? (
        <ul className="space-y-4">
          {competitionList.map((comp) => (
            <li key={comp.id} className="m-2 p-4 border border-gray-300 rounded-lg flex flex-col">
              <p>
                <b>{comp.name}</b> - {comp.comp_date}
              </p>
              <RegisterToCompForm
                id={comp.id}
                name={comp.name}
                comp_date={comp.comp_date}
                description={comp.description}
                comp_type={comp.comp_type}
                season_id={comp.season_id}
                round_no={comp.round_no}
              />
              <ProblemGrid competitionId={comp.id} />
            </li>
          ))}
        </ul>
      ) : (
        <p>Inga tävlingar tillgängliga.</p>
      )}
    </div>
  );
}
