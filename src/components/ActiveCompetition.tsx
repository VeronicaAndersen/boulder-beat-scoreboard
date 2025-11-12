import { checkRegistration, getCompetitions, getCompRegistrationInfo } from "@/hooks/api";
import { CompetitionResponse, MessageProps, RegisterToCompResponse } from "@/types";
import { useState, useEffect } from "react";
import CalloutMessage from "./CalloutMessage";
import ProblemGrid from "./ProblemGrid";
import { Spinner } from "@radix-ui/themes";

export default function ActiveCompetition() {
  const [activeCompetition, setActiveCompetition] = useState<CompetitionResponse | null>(null);
  const [messageInfo, setMessageInfo] = useState<MessageProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchActiveCompetition = async () => {
      setLoading(true);
      try {
        // Get all competitions
        const competitions = await getCompetitions();
        
        if (competitions.length === 0) {
          setLoading(false);
          return;
        }

        // Check registration status for each competition
        const registeredCompetitions: Array<{
          competition: CompetitionResponse;
          registrationInfo: RegisterToCompResponse;
        }> = [];

        for (const comp of competitions) {
          try {
            const isRegistered = await checkRegistration(comp.id);
            if (isRegistered === true) {
              // Get registration info to know the level
              const regInfo = await getCompRegistrationInfo(comp.id);
              if (regInfo) {
                registeredCompetitions.push({
                  competition: comp,
                  registrationInfo: regInfo,
                });
              }
            }
          } catch (error) {
            console.error(`Error checking registration for competition ${comp.id}:`, error);
          }
        }

        if (registeredCompetitions.length > 0) {
          // Sort by comp_date (latest first) and get the most recent one
          const sorted = registeredCompetitions.sort((a, b) => {
            const dateA = new Date(a.competition.comp_date).getTime();
            const dateB = new Date(b.competition.comp_date).getTime();
            return dateB - dateA; // Latest first
          });

          const latest = sorted[0];
          setActiveCompetition(latest.competition);
        }
      } catch (error) {
        console.error("Error fetching active competition:", error);
        setMessageInfo({ message: "Ett fel uppstod vid hämtning av aktiv tävling.", color: "red" });
      } finally {
        setLoading(false);
      }
    };

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
      </div>

      <ProblemGrid competitionId={activeCompetition.id} />
    </div>
  );
}

