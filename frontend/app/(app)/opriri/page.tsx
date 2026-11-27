import type { Metadata } from "next";
import { RequireSession } from "@/components/require-session";
import { WaypointsScreen } from "./waypoints-screen";

export const metadata: Metadata = { title: "Opriri" };

export default function Page() {
  return (
    <RequireSession>
      <WaypointsScreen />
    </RequireSession>
  );
}
