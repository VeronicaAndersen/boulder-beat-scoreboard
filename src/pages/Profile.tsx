import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SeasonForm } from "@/components/SeasonForm";
import { SeasonList } from "@/components/SeasonList";
import { CompetitionForm } from "@/components/CompetitionForm";
import { CompetitionList } from "@/components/CompetitionList";
import { Box, Button, Tabs } from "@radix-ui/themes/components/index";
import ProfilInfo from "@/components/ProfilInfo";
import useGetUserInfo from "@/hooks/useGetUserInfo";
import CalloutMessage from "@/components/CalloutMessage";

export default function Profile() {
  const { setClimber, setToken } = useAuthStore();
  const navigate = useNavigate();

  const { userInfo, messageInfo } = useGetUserInfo();

  useEffect(() => {
    const storedUser = localStorage.getItem("tokens");
    if (!storedUser) {
      navigate("/");
      return;
    }

    try {
      const parsed = JSON.parse(storedUser);
      if (parsed) {
        setClimber(parsed);
      } else {
        console.error("Invalid user data in localStorage:", parsed);
        navigate("/");
      }
    } catch {
      console.error("Failed to parse user data from localStorage");
      navigate("/");
    }
  }, [navigate, setClimber]);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("tokens");
    navigate("/");
  };

  return (
    <div className="h-fit flex flex-col items-center justify-center">
      <div className="flex flex-col items-center my-24 p-4 shadow-md rounded-lg bg-[#c6d1b8]/80 backdrop-blur">
        {messageInfo && <CalloutMessage message={messageInfo.message} color={messageInfo.color} />}
        <Tabs.Root defaultValue="profil" className="w-80">
          <Tabs.List color="cyan">
            <Tabs.Trigger value="competition">Tävlingar</Tabs.Trigger>
            <Tabs.Trigger value="profil">Profil</Tabs.Trigger>
            {userInfo?.user_scope === "admin" && <Tabs.Trigger value="admin">Admin</Tabs.Trigger>}
          </Tabs.List>

          <Box pt="3">
            <Tabs.Content value="competition">
              <CompetitionList />
            </Tabs.Content>

            <Tabs.Content value="profil">
              <ProfilInfo />
            </Tabs.Content>

            {userInfo?.user_scope === "admin" &&
            <Tabs.Content value="admin">
              <SeasonList />
              <SeasonForm />
              <CompetitionForm />
            </Tabs.Content>
            } 
          </Box>
        </Tabs.Root>
      </div>
      <Button
        className="absolute cursor-pointer bg-[#505654] hover:bg-[#868f79] rounded-full px-4 py-2 mt-4 text-white top-4 right-4"
        onClick={handleLogout}
      >
        Logga ut {userInfo?.name}
      </Button>
    </div>
  );
}
