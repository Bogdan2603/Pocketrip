import type { Metadata } from "next";
import { RequireSession } from "@/components/require-session";
import { AccountScreen } from "./account-screen";

export const metadata: Metadata = { title: "Contul meu" };

export default function Page() {
  return (
    <RequireSession>
      <AccountScreen />
    </RequireSession>
  );
}
