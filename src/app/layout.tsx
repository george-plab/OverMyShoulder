import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OverMyShoulder | Tu espacio de escucha y acompañamiento emocional",
  description:
    "Un confidente digital para cuando necesitas hablar. Escucha activa, privacidad total y sin juicios. Habla de lo que sientes en un espacio seguro.",
  keywords: [
    "escucha activa",
    "acompañamiento emocional",
    "soledad",
    "ruptura amorosa",
    "ansiedad",
    "hablar sin ser juzgado",
    "confidente digital",
    "bienestar emocional",
  ],
  authors: [{ name: "OverMyShoulder" }],
  openGraph: {
    title: "OverMyShoulder | Tu espacio de escucha y acompañamiento emocional",
    description:
      "Un confidente digital para cuando necesitas hablar. Escucha activa, privacidad total y sin juicios.",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "OverMyShoulder | Escucha activa sin juicios",
    description:
      "Un confidente digital para cuando necesitas hablar. Privacidad total.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body style={{ fontFamily: "var(--font-body)" }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
