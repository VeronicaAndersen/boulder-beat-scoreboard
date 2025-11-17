import RegisterToCompForm from "./forms/RegisterToCompForm";
import CalloutMessage from "./user_feedback/CalloutMessage";
import { Spinner } from "@radix-ui/themes";
import { useCompetitions } from "@/hooks/useCompetitions";

export function CompetitionList() {
  const {
    competitions: competitionList,
    loading,
    error,
    registrationStatus,
    checkingRegistration,
    refreshRegistrationStatus,
  } = useCompetitions();

  return (
    <div className="mb-6 flex flex-col bg-white/90 backdrop-blur p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Tävlingar</h2>
      {error && <CalloutMessage message={error} color="red" />}
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
                    <p className="text-sm text-green-600 mb-2">
                      ✓ Du är registrerad för denna tävling
                    </p>
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
