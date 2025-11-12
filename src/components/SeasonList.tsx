import { getSeasons } from "@/hooks/api";
import { MessageProps, SeasonResponse } from "@/types";
import { useEffect, useState } from "react";
import CalloutMessage from "./CalloutMessage";
import { Spinner } from "@radix-ui/themes";

export function SeasonList() {
  const [seasonList, setSeasonList] = useState<SeasonResponse[]>([]);
  const [messageInfo, setMessageInfo] = useState<MessageProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSeasons = async () => {
      setLoading(true);
      try {
        const seasons = await getSeasons({});
        if (seasons) {
          setSeasonList(seasons);
        }
      } catch (error) {
        console.error("Error fetching seasons:", error);
        setMessageInfo({ message: "Ett fel uppstod vid hämtning av säsonger.", color: "red" });
      } finally {
        setLoading(false);
      }
    };

    fetchSeasons();
  }, []);

  return (
    <div className="mb-6 flex flex-col bg-white/90 backdrop-blur p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Säsonger</h2>
      {messageInfo && <CalloutMessage message={messageInfo.message} color={messageInfo.color} />}
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
