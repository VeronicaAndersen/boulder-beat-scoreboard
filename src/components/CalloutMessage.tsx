import { MessageProps } from "@/types";
import { Callout } from "@radix-ui/themes";

export default function CalloutMessage({ message: message, color }: MessageProps) {
  return (
    <Callout.Root color={color} className="mt-4">
      <Callout.Text>{message}</Callout.Text>
    </Callout.Root>
  );
}
