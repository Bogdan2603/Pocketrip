import type { Metadata } from "next";
import { RequireSession } from "@/components/require-session";
import { AdminScreen } from "./admin-screen";

export const metadata: Metadata = { title: "Administrare" };

export default function Page() {
  return (
    <RequireSession admin>
      <AdminScreen />
    </RequireSession>
  );
}
