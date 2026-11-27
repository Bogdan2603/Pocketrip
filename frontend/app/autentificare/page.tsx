import type { Metadata } from "next";
import { Suspense } from "react";
import { Logo, ThemeToggle, Wallpaper } from "@/components/brand";
import { AuthCard } from "./auth-card";
import { BoardingPass } from "./boarding-pass";

export const metadata: Metadata = { title: "Intră în cont" };

export default function AuthPage() {
  return (
    <>
      <Wallpaper opacity={0.05} />
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 pt-6 sm:px-6">
        <Logo />
        <ThemeToggle />
      </div>
      <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="order-2 lg:order-1">
          <h1 className="max-w-lg text-[40px] leading-[1] tracking-[-0.04em] text-ink sm:text-[56px]">
            Toată călătoria, pe o pagină.
          </h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-2">
            Pui biletele și rezervările, primești programul pe zile și ore, cu codurile lângă fiecare oprire.
          </p>
          <BoardingPass />
          <p className="mt-6 font-mono text-[12px] text-ink-3">Documentele nu se păstrează: le citim și le ștergem imediat.</p>
        </div>
        <div className="order-1 lg:order-2">
          <Suspense fallback={<div className="sheet h-[520px] w-full" />}>
            <AuthCard />
          </Suspense>
        </div>
      </main>
    </>
  );
}
