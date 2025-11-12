import CalloutMessage from "./CalloutMessage";
import useGetUserInfo from "@/hooks/useGetUserInfo";
import { Spinner } from "@radix-ui/themes";

export default function ProfilInfo() {
  const { userInfo, messageInfo, loading } = useGetUserInfo();

  return (
    <div className="mb-6 flex flex-col bg-white/90 backdrop-blur p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Min Profil</h2>
      {messageInfo && <CalloutMessage message={messageInfo.message} color={messageInfo.color} />}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Spinner size="3" />
          <span className="ml-2">Hämtar profilinformation...</span>
        </div>
      ) : userInfo ? (
        <div>
          <p>Namn: {userInfo.name}</p>
        </div>
      ) : (
        <p>Ingen information tillgänglig.</p>
      )}
    </div>
  );
}
