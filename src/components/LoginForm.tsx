import { useState } from "react";
import type { LoginRequest } from "@/types";
import { useAuthStore } from "@/store/auth";
import { Link, useNavigate } from "react-router-dom";
import { loginClimber } from "@/hooks/api";
import { Button, Card, TextField } from "@radix-ui/themes";
import { Label } from "@radix-ui/react-context-menu";
import CalloutMessage from "./CalloutMessage";

export function LoginForm() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState<LoginRequest>({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { access_token, refresh_token } = await loginClimber(loginData);
    if (!access_token || !refresh_token) {
      setErrorMessage("Inloggning misslyckades. Kontrollera dina uppgifter och försök igen.");
      return;
    }
    useAuthStore.getState().setToken(access_token);

    localStorage.setItem(
      "tokens",
      JSON.stringify({ access_token: access_token, refresh_token: refresh_token })
    );
    navigate("/profile");
  };

  return (
    <div className="w-80 flex items-center justify-center">
      <Card className="w-full h-fit max-w-md p-6 bg-white/95 backdrop-blur shadow-xl">
        {errorMessage && <CalloutMessage message={errorMessage} color="red" />}
        <form onSubmit={handleLogin} className="space-y-6">
          <h1 className="text-2xl font-semibold text-center mb-4">Logga in</h1>
          <div className="space-y-2">
            <Label>Namn</Label>
            <TextField.Root
              id="name"
              type="text"
              placeholder="Användarnamn"
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Lösenord</Label>
            <TextField.Root
              id="password"
              type="password"
              placeholder="Lösenord"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-full bg-[#505654] hover:bg-[#868f79] disabled:bg-[#505654]/50 disabled:cursor-not-allowed"
            disabled={!loginData.username || !loginData.password}
          >
            Logga in
          </Button>

          <Link
            to="/register"
            className="text-sm text-center text-[#505654] underline justify-center flex"
          >
            Registrera dig
          </Link>
        </form>
      </Card>
    </div>
  );
}
