import type { Metadata } from "next";
import { Inter, Poppins, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { MarketingAnalytics } from "@/components/marketing/analytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "EngenhaAI - IA para Engenheiros Civis (Laudos, Orçamentos e Regularização)",
    template: "%s | EngenhaAI",
  },
  description:
    "Gere laudos técnicos profissionais em minutos. Automatize REURB, memoriais, vistorias e orçamentos com IA. Poupe tempo e tome decisões rápidas.",
  applicationName: "EngenhaAI",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "EngenhaAI - Engenharia Inteligente, Decisões Rápidas",
    description:
      "IA para engenharia civil: gere laudos, orçamentos e documentos com padrão profissional. Conforme normas e legislação, com revisão do responsável técnico.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "EngenhaAI - Engenharia Inteligente, Decisões Rápidas",
    description:
      "IA para engenharia civil: gere laudos, orçamentos e documentos com padrão profissional. Poupe tempo e aumente sua produtividade.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} ${robotoMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <MarketingAnalytics
          gaId={process.env.NEXT_PUBLIC_GA4_ID}
          metaPixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID}
        />
        {children}
      </body>
    </html>
  );
}
