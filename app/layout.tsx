import type { Metadata, Viewport } from "next";
import "@fontsource/barlow/600.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://plintoo.app"),
  title: "Plintoo",
  robots: { index: false, follow: false },
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
