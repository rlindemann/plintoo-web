import type { Metadata, Viewport } from "next";
import "@fontsource/barlow/400.css";
import "@fontsource/barlow/500.css";
import "@fontsource/barlow/600.css";
import "@fontsource/barlow-semi-condensed/600.css";
import "@fontsource/barlow-semi-condensed/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://plintoo.app"),
  title: "Plintoo: the command centre for architects and property developers",
  description:
    "Plintoo gives an architecture practice its own data, memory, workflows and model, with any AI plugged in. First pilot practices now.",
  openGraph: {
    title: "Plintoo",
    description: "The command centre for architects and property developers.",
    url: "https://plintoo.app",
    siteName: "Plintoo",
    locale: "en_GB",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#080A0C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
