import CalloutMessage from "./CalloutMessage";
import { Spinner } from "@radix-ui/themes";
import { useSeasons } from "@/hooks/useSeasons";

interface SeasonListProps {
  refreshKey?: number;
}

export function SeasonList({ refreshKey }: SeasonListProps = {}) {
  const { seasons: seasonList, loading, error } = useSeasons(refreshKey);

  return (
    <div className="mb-6 h-fit flex flex-col bg-white/90 backdrop-blur p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Säsonger</h2>
      {error && <CalloutMessage message={error} color="red" />}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Spinner size="3" />
          <span className="ml-2">Hämtar säsonger...</span>
        </div>
      ) : seasonList && seasonList.length > 0 ? (
        <ul>
          {seasonList.map((season) => (
            <li key={season.id} className="mb-2">
              <span className="font-medium">
                {season.id} - {season.name}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Inga säsonger tillgängliga.</p>
      )}
    </div>
  );
}
