import { registerClimberToCompetition } from "@/hooks/api";
import { Button, Popover, Select } from "@radix-ui/themes";
import { useState } from "react";

export default function RegisterToCompForm(competition) {
  const [level, setLevel] = useState<number>(1);

  const handleRegidtration = async () => {
    alert(`Du har valt svårighetsgrad: ${level}`);
    try {
      const reg = await registerClimberToCompetition(competition.comp_id, level);

      if (!reg) {
        throw new Error("Registration failed");
      }
      alert("Anmälan lyckades!");
    } catch (error) {
      console.error("Error fetching competitions:", error);
      alert("Failed to fetch competitions. Please check your connection and try again.");
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button className="bg-[#505654] hover:bg-[#868f79] rounded px-4 py-2 text-white">
          Till anmälan
        </Button>
      </Popover.Trigger>
      <Popover.Content size="2" maxWidth="400px" className="flex flex-col gap-4 p-4 bg-white/90 backdrop-blur rounded-lg shadow-lg">
        <Select.Root size="2" defaultValue="1" onValueChange={(value) => setLevel(Number(value))}>
          <Select.Trigger aria-label="Välj svårighetsgrad"/>
          <Select.Content>
            <Select.Item value="1">Lila</Select.Item>
            <Select.Item value="2">Rosa</Select.Item>
            <Select.Item value="3">Orange</Select.Item>
            <Select.Item value="4">Gul</Select.Item>
            <Select.Item value="5">Grön</Select.Item>
            <Select.Item value="6">Vit</Select.Item>
            <Select.Item value="7">Svart</Select.Item>
          </Select.Content>
        </Select.Root>
        <Button
          type="submit"
          onClick={handleRegidtration}
          className="bg-[#505654] hover:bg-[#868f79] rounded px-4 py-2 mt-4 text-white"
        >
          Bekräfta anmälan
        </Button>
      </Popover.Content>
    </Popover.Root>
  );
}
