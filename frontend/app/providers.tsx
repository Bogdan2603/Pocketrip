"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { ApiError } from "@/lib/api";
import { SessionProvider } from "@/lib/session";

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 15_000,
            refetchOnWindowFocus: false,
            // Nu reîncercăm erorile 4xx: răspunsul n-o să se schimbe.
            retry: (count, error) =>
              !(error instanceof ApiError && error.status >= 400 && error.status < 500) && count < 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      <SessionProvider>{children}</SessionProvider>
      <Toaster
        position="top-center"
        gutter={10}
        toastOptions={{
          duration: 3500,
          className: "!font-sans !text-[15px]",
          style: {
            background: "#ffffff",
            color: "#111111",
            borderRadius: 12,
            padding: "10px 14px",
            boxShadow: "0 0 0 1px rgb(17 17 17 / .06), 0 16px 36px -16px rgb(8 12 24 / .55)",
          },
          success: { iconTheme: { primary: "#1E8E5A", secondary: "#fff" } },
          error: { iconTheme: { primary: "#C8372D", secondary: "#fff" }, duration: 5000 },
        }}
      />
    </QueryClientProvider>
  );
}
