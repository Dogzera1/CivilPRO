import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planos e Preços",
  description:
    "Gere laudos técnicos profissionais em minutos. Automatize REURB, memoriais, vistorias e orçamentos com IA. Experimente grátis.",
  alternates: {
    canonical: "/vendas",
  },
  openGraph: {
    title: "EngenhaAI - Planos e Preços",
    description:
      "IA para engenharia civil: laudos, orçamentos, regularização e conformidade. Comece grátis e evolua quando precisar.",
    url: "/vendas",
  },
};

export default function VendasLayout({ children }: { children: React.ReactNode }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "EngenhaAI",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${baseUrl}/vendas`,
    description:
      "Plataforma SaaS para engenheiros civis gerarem laudos, orçamentos e documentos com apoio de IA.",
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "BRL",
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "49",
        priceCurrency: "BRL",
      },
      {
        "@type": "Offer",
        name: "Enterprise",
        price: "99",
        priceCurrency: "BRL",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}

