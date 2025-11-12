import { checkRegistration, getCompetitions } from "@/hooks/api";
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
  const [registrationStatus, setRegistrationStatus] = useState<Record<number, boolean>>({});
  const [checkingRegistration, setCheckingRegistration] = useState<Record<number, boolean>>({});

  const refreshRegistrationStatus = async (competitionId: number) => {
    setCheckingRegistration((prev) => ({ ...prev, [competitionId]: true }));
    try {
      const isRegistered = await checkRegistration(competitionId);
      setRegistrationStatus((prev) => ({ ...prev, [competitionId]: isRegistered === true }));
    } catch (error) {
      console.error(`Error checking registration for competition ${competitionId}:`, error);
      setRegistrationStatus((prev) => ({ ...prev, [competitionId]: false }));
    } finally {
      setCheckingRegistration((prev) => ({ ...prev, [competitionId]: false }));
    }
  };

  useEffect(() => {
    const fetchCompetitions = async () => {
      setLoading(true);
      try {
        const competitions = await getCompetitions();

        if (competitions.length > 0) {
          setCompetitionList(competitions);
          
          // Check registration status for each competition
          const statusMap: Record<number, boolean> = {};
          const checkingMap: Record<number, boolean> = {};
          
          for (const comp of competitions) {
            checkingMap[comp.id] = true;
            try {
              const isRegistered = await checkRegistration(comp.id);
              statusMap[comp.id] = isRegistered === true;
            } catch (error) {
              console.error(`Error checking registration for competition ${comp.id}:`, error);
              statusMap[comp.id] = false;
            } finally {
              checkingMap[comp.id] = false;
            }
          }
          
          setRegistrationStatus(statusMap);
          setCheckingRegistration(checkingMap);
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
          {competitionList.map((comp) => {
            const isRegistered = registrationStatus[comp.id] === true;
            const isChecking = checkingRegistration[comp.id] === true;

            return (
              <li key={comp.id} className="m-2 p-4 border border-gray-300 rounded-lg flex flex-col">
                <p>
                  <b>{comp.name}</b> - {comp.comp_date}
                </p>
                
                {isChecking ? (
                  <div className="flex items-center py-2">
                    <Spinner size="2" />
                    <span className="ml-2 text-sm">Kontrollerar registrering...</span>
                  </div>
                ) : isRegistered ? (
                  <>
                    <p className="text-sm text-green-600 mb-2">✓ Du är registrerad för denna tävling</p>
                  </>
                ) : (
                  <RegisterToCompForm
                    id={comp.id}
                    name={comp.name}
                    comp_date={comp.comp_date}
                    description={comp.description}
                    comp_type={comp.comp_type}
                    season_id={comp.season_id}
                    round_no={comp.round_no}
                    onRegistrationSuccess={() => refreshRegistrationStatus(comp.id)}
                  />
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Inga tävlingar tillgängliga.</p>
      )}
    </div>
  );
}
