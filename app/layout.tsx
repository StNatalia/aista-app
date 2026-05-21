import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aista.be"),
  title: "AISTA — Твоє резюме мовою бельгійського роботодавця",
  description:
    "AI адаптує твій український досвід під ATS-фільтри Бельгії. CV нідерландською/французькою, мотиваційний лист, список вакансій — за 15 хвилин і €9.",
  openGraph: {
    title: "AISTA — CV для українок у Бельгії за €9",
    description:
      "47% українок у VDAB мають вищу освіту. 99% не проходять ATS-фільтр. AISTA адаптує твоє резюме під бельгійський ринок.",
    locale: "uk_UA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AISTA — CV для українок у Бельгії",
    description: "AI-адаптація резюме під бельгійський ринок за €9",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0E3A2F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {children}
      </body>
    </html>
  );
}
