import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SeasonForm } from "@/components/SeasonForm";
import { SeasonList } from "@/components/SeasonList";
import { CompetitionForm } from "@/components/CompetitionForm";
import { CompetitionList } from "@/components/CompetitionList";
import { Box, Button, Tabs } from "@radix-ui/themes/components/index";
import ProfilInfo from "@/components/ProfilInfo";

export default function Profile() {
  const { setClimber, setToken } = useAuthStore();
  const navigate = useNavigate();

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#c6d2b8] px-4">
      <div className="flex flex-col items-center">
        {/* Logo */}
        <img src="/grepp.svg" alt="Grepp logo" className="w-48 h-28 drop-shadow-md" />

        <Tabs.Root
          defaultValue="competition"
          className="w-full max-w-2xl mt-6 bg-white/90 backdrop-blur rounded-lg shadow-lg p-4"
        >
          <Tabs.List color="cyan">
            <Tabs.Trigger
              value="season"
              className="mt-6 bg-white/90 backdrop-blur rounded-lg shadow-lg p-4"
            >
              Säsong
            </Tabs.Trigger>
            <Tabs.Trigger
              value="competition"
              className="mt-6 bg-white/90 backdrop-blur rounded-lg shadow-lg p-4"
            >
              Tävlingar
            </Tabs.Trigger>
            <Tabs.Trigger
              value="profil"
              className="mt-6 bg-white/90 backdrop-blur rounded-lg shadow-lg p-4"
            >
              Profil
            </Tabs.Trigger>
          </Tabs.List>

          <Box pt="3">
            <Tabs.Content
              value="season"
              className="w-full max-w-2xl mt-6 bg-white/90 backdrop-blur rounded-lg shadow-lg p-4"
            >
              <SeasonForm />
              <SeasonList />
            </Tabs.Content>

            <Tabs.Content
              value="competition"
              className="w-full max-w-2xl mt-6 bg-white/90 backdrop-blur rounded-lg shadow-lg p-4"
            >
              <CompetitionForm />
              <CompetitionList />
            </Tabs.Content>

            <Tabs.Content
              value="profil"
              className="w-full max-w-2xl mt-6 bg-white/90 backdrop-blur rounded-lg shadow-lg p-4"
            >
              <h2 className="text-xl font-semibold mb-4">Profilinformation</h2>
              <ProfilInfo />
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </div>
      <Button
        className="absolute bg-[#505654] hover:bg-[#868f79] rounded px-4 py-2 mt-4 text-white top-4 right-4"
        onClick={handleLogout}
      >
        Logga ut
      </Button>
    </div>
  );
}
