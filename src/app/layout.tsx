import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sigmadataclub.org"),
  title: {
    default: "Sigma Data Club — Club de Ciencia de Datos",
    template: "%s · Sigma Data Club",
  },
  description:
    "La comunidad estudiantil de ciencia de datos donde aprendemos, construimos y compartimos proyectos reales de IA, machine learning y análisis de datos.",
  keywords: [
    "ciencia de datos",
    "club universitario",
    "machine learning",
    "inteligencia artificial",
    "data science",
    "Sigma Data Club",
  ],
  openGraph: {
    title: "Sigma Data Club",
    description:
      "Aprende, construye y comparte ciencia de datos en comunidad.",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Pinta el tema antes del primer frame: sin destello blanco. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          {children}
          <div className="grain" aria-hidden="true" />
        </ThemeProvider>
      </body>
    </html>
  );
}
