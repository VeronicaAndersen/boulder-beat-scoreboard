import { checkRegistration, getCompetitions, getCompRegistrationInfo } from "@/hooks/api";
import { CompetitionResponse, MessageProps, RegisterToCompResponse } from "@/types";
import { useState, useEffect } from "react";
import CalloutMessage from "./CalloutMessage";
import ProblemGrid from "./ProblemGrid";
import { Spinner } from "@radix-ui/themes";

export default function ActiveCompetition() {
  const [activeCompetition, setActiveCompetition] = useState<CompetitionResponse | null>(null);
  const [regInfo, setRegInfo] = useState<RegisterToCompResponse | null>(null);
  const [messageInfo, setMessageInfo] = useState<MessageProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchActiveCompetition() {
      setLoading(true);
      try {
        const competitions = await getCompetitions();

        if (!Array.isArray(competitions) || competitions.length === 0) {
          setActiveCompetition(null);
          setRegInfo(null);
          setLoading(false);
          return;
        }

        // Only pick competitions with registration, prefer latest (higher comp_date)
        let best: {
          competition: CompetitionResponse;
          registrationInfo: RegisterToCompResponse;
        } | null = null;

        for (const comp of competitions) {
          try {
            const isRegistered = await checkRegistration(comp.id);
            if (isRegistered === true) {
              const regInfo = await getCompRegistrationInfo(comp.id);
              if (regInfo) {
                if (
                  !best ||
                  new Date(comp.comp_date).getTime() >
                    new Date(best.competition.comp_date).getTime()
                ) {
                  best = { competition: comp, registrationInfo: regInfo };
                }
              }
            }
          } catch (error) {
            console.error(`Error for competition ${comp.id}:`, error);
          }
        }

        if (best) {
          setActiveCompetition(best.competition);
          setRegInfo(best.registrationInfo);
        } else {
          setActiveCompetition(null);
          setRegInfo(null);
        }
      } catch (error) {
        console.error("Error fetching active competition:", error);
        setMessageInfo({ message: "Ett fel uppstod vid hämtning av aktiv tävling.", color: "red" });
        setActiveCompetition(null);
        setRegInfo(null);
      } finally {
        setLoading(false);
      }
    }

    fetchActiveCompetition();
  }, []);

  if (loading) {
    return (
      <div className="mb-6 flex flex-col bg-white/90 backdrop-blur p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Aktiv Tävling</h2>
        <div className="flex items-center justify-center py-8">
          <Spinner size="3" />
          <span className="ml-2">Hämtar aktiv tävling...</span>
        </div>
      </div>
    );
  }

  if (!activeCompetition) {
    return (
      <div className="mb-6 flex flex-col bg-white/90 backdrop-blur p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Aktiv Tävling</h2>
        {messageInfo && <CalloutMessage message={messageInfo.message} color={messageInfo.color} />}
        <p className="text-center text-gray-600">Du är inte registrerad för någon tävling ännu.</p>
      </div>
    );
  }

  return (
    <div className="mb-6 flex flex-col bg-white/90 backdrop-blur p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Aktiv Tävling</h2>
      {messageInfo && <CalloutMessage message={messageInfo.message} color={messageInfo.color} />}

      <div className="mb-4 p-4 border border-gray-300 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">{activeCompetition.name}</h3>
        <p className="text-gray-600 mb-1">
          <strong>Datum:</strong> {activeCompetition.comp_date}
        </p>
        {activeCompetition.description && (
          <p className="text-gray-600 mb-1">
            <strong>Beskrivning:</strong> {activeCompetition.description}
          </p>
        )}
        {regInfo?.level && (
          <p className="text-gray-600 mb-1">
            <strong>Din tävlingsnivå:</strong> {String(regInfo.level)}
          </p>
        )}
      </div>

      <ProblemGrid competitionId={activeCompetition.id} />
    </div>
  );
}
