import { useState } from "react";
import type { RegistrationRequest } from "@/types";
import { registerClimber } from "@/hooks/api";
import { Link, useNavigate } from "react-router-dom";
import * as Label from "@radix-ui/react-label";
import { Card, Button, TextField, Spinner } from "@radix-ui/themes";
import CalloutMessage from "./CalloutMessage";

export function RegistrationForm() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [RegisterClimberData, setRegisterClimberData] = useState<RegistrationRequest>({
    name: "",
    password: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    const payload: RegistrationRequest = {
      name: RegisterClimberData.name,
      password: RegisterClimberData.password,
    };

    try {
      const result = await registerClimber(payload);

      if (!result.success) {
        setErrorMessage(result.message);
      } else {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled =
    !RegisterClimberData.name ||
    !RegisterClimberData.password ||
    RegisterClimberData.password.length < 6 ||
    loading;

  return (
    <div className="w-80 flex items-center justify-center">
      <Card className="w-full h-fit max-w-md p-6 bg-white/95 backdrop-blur shadow-xl">
        {errorMessage && <CalloutMessage message={errorMessage} color="red" />}
        <form onSubmit={handleRegister} className="space-y-6">
          <h2 className="text-2xl font-semibold text-center mb-4">Registrera dig</h2>
          <div className="space-y-2">
            <Label.Root htmlFor="name">Namn</Label.Root>
            <TextField.Root
              id="name"
              type="text"
              placeholder="Enter your name"
              value={RegisterClimberData.name}
              onChange={(e) =>
                setRegisterClimberData({ ...RegisterClimberData, name: e.target.value })
              }
              required
              className="w-full"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label.Root htmlFor="password">Lösenord</Label.Root>
            <TextField.Root
              id="password"
              type="password"
              placeholder="Enter your password"
              value={RegisterClimberData.password}
              onChange={(e) =>
                setRegisterClimberData({ ...RegisterClimberData, password: e.target.value })
              }
              required
              className="w-full"
              disabled={loading}
            />
            {RegisterClimberData.password.length > 0 && RegisterClimberData.password.length < 6 && (
              <p className="text-red-500 text-xs italic">Måste innehålla minst sex tecken.</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer rounded-full bg-[#505654] hover:bg-[#868f79] disabled:bg-[#505654]/50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={isSubmitDisabled}
          >
            {loading ? (
              <>
                <Spinner size="2" className="mr-2" /> Registrerar...
              </>
            ) : (
              "Registrera dig"
            )}
          </Button>

          <Link to="/" className="w-fit text-sm text-center text-[#505654] underline flex justify-center mx-auto">
            Redan ett konto? Klicka här!
          </Link>
        </form>
      </Card>
    </div>
  );
}
