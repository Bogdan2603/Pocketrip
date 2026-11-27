import type { Metadata } from "next";
import { Archivo, Caveat, IBM_Plex_Mono, Karla } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin", "latin-ext"], weight: ["600", "700", "800"] });
const karla = Karla({ variable: "--font-karla", subsets: ["latin", "latin-ext"] });
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin", "latin-ext"], weight: ["500", "700"] });

export const metadata: Metadata = {
  title: {
    default: "Pocketrip – toate biletele tale, o singură pagină",
    template: "%s · Pocketrip",
  },
  description:
    "Încarci biletele și rezervările, iar Pocketrip îți organizează automat călătoria într-un program pe zile și ore.",
};

// Aplică tema salvată înainte de prima afișare, ca să nu apară un „flash”.
const themeScript = `(function(){try{var t=localStorage.getItem("pocketrip.theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ro"
      data-theme="dark"
      suppressHydrationWarning
      className={`${archivo.variable} ${karla.variable} ${plexMono.variable} ${caveat.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
