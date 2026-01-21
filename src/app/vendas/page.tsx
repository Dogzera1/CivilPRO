"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Crown, Zap, Building2, Check, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Loading } from "@/components/ui/loading";
import { getCheckoutUrlForPlan } from "@/lib/cakto/checkout";
import { track } from "@/lib/marketing/track";

const PLANOS = {
  free: {
    nome: "Free",
    preco: "Grátis",
    precoNumero: 0,
    limite: 5,
    periodo: "",
    recursos: [
      "5 processos por mês",
      "Processamento básico com IA",
      "Geração de PDFs",
      "Suporte por email",
      "Dashboard básico",
    ],
    icon: Zap,
    cor: "secondary",
    popular: false,
  },
  pro: {
    nome: "Pro",
    preco: "R$ 49",
    precoNumero: 49,
    limite: Infinity,
    periodo: "/mês",
    recursos: [
      "Processos ilimitados",
      "Processamento avançado com IA",
      "Geração de PDFs e Excel",
      "Suporte prioritário",
      "Análise detalhada",
      "Dashboard completo",
      "Sem limites mensais",
    ],
    icon: Crown,
    cor: "default",
    popular: true,
  },
  enterprise: {
    nome: "Enterprise",
    preco: "R$ 99",
    precoNumero: 99,
    limite: Infinity,
    periodo: "/mês",
    recursos: [
      "Tudo do Pro",
      "API access",
      "Suporte dedicado",
      "Personalização",
      "Integração customizada",
      "Treinamento da equipe",
      "SLA garantido",
    ],
    icon: Building2,
    cor: "default",
    popular: false,
  },
  // Admin é apenas para testes internos (não aparece na página)
  admin: {
    nome: "Admin (Teste)",
    preco: "R$ 0",
    precoNumero: 0,
    limite: Infinity,
    periodo: "",
    recursos: ["Sem limites", "Acesso total para testes"],
    icon: Crown,
    cor: "default",
    popular: false,
  },
};

export default function VendasPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      // Não precisa estar logado para ver os planos
      if (authUser) {
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (userData) {
          setUser({ ...authUser, ...userData });
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [supabase]);

  const handleCheckout = async (plano: "pro" | "enterprise") => {
    // Se não estiver logado, redirecionar para login primeiro
    if (!user) {
      router.push(`/login?redirect=/vendas&plano=${plano}`);
      return;
    }

    try {
      const checkoutUrl = getCheckoutUrlForPlan(
        plano,
        user.email,
        user.nome_completo || undefined
      );
      track("checkout_start", { plano, source: "landing" });
      window.location.href = checkoutUrl;
    } catch (error: any) {
      alert(`Erro ao iniciar checkout: ${error.message}`);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Carregando planos..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-muted">
      <header className="border-b bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-xl font-bold">EngenhaAI</h1>
          {user ? (
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Engenharia Inteligente, Decisões Rápidas
            </span>
          </div>
          <h1 className="mb-4 text-5xl font-bold tracking-tight">
            Gere laudos técnicos profissionais em 10 minutos
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Automatize REURB, memoriais, vistorias e orçamentos com IA. Economize tempo, aumente sua produtividade e
            mantenha padrão profissional (com revisão do responsável técnico).
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup">
              <Button
                size="lg"
                onClick={() => track("cta_click", { cta: "hero_trial" })}
              >
                Experimente Grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/novo-processo">
              <Button
                size="lg"
                variant="outline"
                onClick={() => track("cta_click", { cta: "hero_demo" })}
              >
                Ver como funciona
              </Button>
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span>Conforme normas (ABNT) e legislação</span>
            <span>5 processos grátis</span>
            <span>Sem cartão no plano Free</span>
          </div>
        </div>

        {/* Como funciona */}
        <div className="mb-16 grid gap-6 md:grid-cols-3">
          <Card className="border-muted/60">
            <CardHeader>
              <CardTitle className="text-lg">1) Envie planta e fotos</CardTitle>
              <CardDescription>PDF, JPG ou PNG. A plataforma organiza e prepara tudo.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Dica: imagens nítidas e com cotas visíveis aumentam a precisão.
            </CardContent>
          </Card>
          <Card className="border-muted/60">
            <CardHeader>
              <CardTitle className="text-lg">2) IA gera o documento</CardTitle>
              <CardDescription>Prompts profissionais baseados em normas e prática de mercado.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Saída em texto puro (sem markdown) para PDFs limpos e profissionais.
            </CardContent>
          </Card>
          <Card className="border-muted/60">
            <CardHeader>
              <CardTitle className="text-lg">3) Revise e entregue</CardTitle>
              <CardDescription>Você mantém a responsabilidade técnica e o padrão.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Gere PDF/Excel e registre suas informações com segurança.
            </CardContent>
          </Card>
        </div>

        {/* Planos */}
        <div className="grid gap-8 md:grid-cols-3 lg:gap-6">
          {Object.entries(PLANOS)
            .filter(([key]) => key !== "admin")
            .map(([key, plano]) => {
            const Icon = plano.icon;
            const isAtual = user?.plano === key;
            const isPopular = plano.popular;

            return (
              <Card
                key={key}
                className={`relative transition-all hover:shadow-lg ${
                  isPopular ? "border-primary shadow-lg md:scale-105" : ""
                } ${isAtual ? "border-green-500" : ""}`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Mais Popular
                    </Badge>
                  </div>
                )}
                {isAtual && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="border-green-500 text-green-700">
                      Seu Plano
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{plano.nome}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plano.preco}</span>
                    {plano.periodo && (
                      <span className="text-muted-foreground">{plano.periodo}</span>
                    )}
                  </div>
                  {plano.limite === Infinity ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Processos ilimitados
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {plano.limite} processos/mês
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plano.recursos.map((recurso, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                        <span className="text-sm">{recurso}</span>
                      </li>
                    ))}
                  </ul>

                  {isAtual ? (
                    <Button className="w-full" variant="outline" disabled>
                      Plano Atual
                    </Button>
                  ) : key === "free" ? (
                    <Link href="/signup" className="block">
                      <Button className="w-full" variant="outline">
                        Começar Grátis
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      className="w-full"
                      variant={isPopular ? "default" : "outline"}
                      onClick={() => handleCheckout(key as "pro" | "enterprise")}
                    >
                      Assinar Agora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ ou Informações Adicionais */}
        <div className="mt-16 rounded-lg bg-muted/50 p-8">
          <h2 className="mb-6 text-2xl font-bold text-center">
            Perguntas Frequentes
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold">Posso cancelar a qualquer momento?</h3>
              <p className="text-sm text-muted-foreground">
                Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas ou multas.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Como funciona o plano Free?</h3>
              <p className="text-sm text-muted-foreground">
                O plano Free permite 5 processos por mês. Perfeito para testar a plataforma!
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Os dados são seguros?</h3>
              <p className="text-sm text-muted-foreground">
                Sim! Usamos criptografia de ponta a ponta e seguimos as melhores práticas de segurança.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Preciso de cartão de crédito para o Free?</h3>
              <p className="text-sm text-muted-foreground">
                Não! O plano Free é totalmente gratuito e não requer cartão de crédito.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
