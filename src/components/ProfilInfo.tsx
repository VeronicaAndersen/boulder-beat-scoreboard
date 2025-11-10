import CalloutMessage from "./CalloutMessage";
import useGetUserInfo from "@/hooks/useGetUserInfo";

export default function ProfilInfo() {
  const { userInfo, messageInfo } = useGetUserInfo();

  return (
    <div className="mb-6 flex flex-col bg-white/90 backdrop-blur p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Min Profil</h2>
      {messageInfo && <CalloutMessage message={messageInfo.message} color={messageInfo.color} />}
      {userInfo ? (
        <div>
          <p>Namn: {userInfo.name}</p>
        </div>
      ) : (
        <p>Ingen information tillgänglig.</p>
      )}
    </div>
  );
}
