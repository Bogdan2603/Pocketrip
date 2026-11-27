import type { ReactNode } from "react";
import { AppHeader } from "@/components/app-header";
import { Wallpaper } from "@/components/brand";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Wallpaper opacity={0.04} />
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </>
  );
}
