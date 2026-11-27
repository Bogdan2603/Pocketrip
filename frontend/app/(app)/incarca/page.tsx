import type { Metadata } from "next";
import { RequireSession } from "@/components/require-session";
import { GenerateScreen } from "./generate-screen";

export const metadata: Metadata = { title: "Călătorie nouă" };

export default function Page() {
  return (
    <RequireSession>
      <GenerateScreen />
    </RequireSession>
  );
}
