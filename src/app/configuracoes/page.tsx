"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Crown, Zap, Building2, Check } from "lucide-react";
import Link from "next/link";
import { Loading } from "@/components/ui/loading";
import { getCheckoutUrlForPlan } from "@/lib/cakto/checkout";

const PLANOS = {
  free: {
    nome: "Free",
    preco: "R$ 0",
    limite: 5,
    recursos: [
      "5 jobs por mês",
      "Processamento básico com IA",
      "Geração de PDFs",
      "Suporte por email",
    ],
    icon: Zap,
    cor: "secondary",
  },
  pro: {
    nome: "Pro",
    preco: "R$ 49/mês",
    limite: Infinity,
    recursos: [
      "Jobs ilimitados",
      "Processamento avançado com IA",
      "Geração de PDFs e Excel",
      "Suporte prioritário",
      "Análise detalhada",
    ],
    icon: Crown,
    cor: "default",
  },
  enterprise: {
    nome: "Enterprise",
    preco: "R$ 99/mês",
    limite: Infinity,
    recursos: [
      "Tudo do Pro",
      "API access",
      "Suporte dedicado",
      "Personalização",
      "Integração customizada",
    ],
    icon: Building2,
    cor: "default",
  },
  admin: {
    nome: "Admin (Teste)",
    preco: "R$ 0",
    limite: Infinity,
    recursos: ["Sem limites", "Acesso total para testes", "Sem cobrança"],
    icon: Crown,
    cor: "default",
  },
};

export default function ConfiguracoesPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push("/login");
        return;
      }

      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (userData) {
        setUser({ ...authUser, ...userData });
      }
      setLoading(false);
    };

    loadUser();

    // Verificar se veio de um pagamento bem-sucedido
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");
    if (status === "success") {
      // Recarregar dados do usuário após alguns segundos para pegar atualização do webhook
      setTimeout(() => {
        loadUser();
      }, 3000);
    }
  }, [router, supabase]);

  if (loading) {
    return <Loading fullScreen message="Carregando configurações..." />;
  }

  if (!user) {
    return null;
  }

  const planoAtual = PLANOS[user.plano as keyof typeof PLANOS] || PLANOS.free;
  const usado = user.jobs_mes_atual || 0;
  const limite = planoAtual.limite === Infinity ? usado + 1 : planoAtual.limite;
  const porcentagem = planoAtual.limite === Infinity ? 0 : (usado / limite) * 100;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-xl font-bold">CivilAI Pro</h1>
          <div></div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">Configurações</h2>
          <p className="text-muted-foreground">
            Gerencie sua conta e plano
          </p>
        </div>

        <div className="space-y-6">
          {/* Informações da Conta */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{user.nome_completo || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              {user.crea_numero && (
                <div>
                  <p className="text-sm text-muted-foreground">CREA</p>
                  <p className="font-medium">{user.crea_numero}</p>
                </div>
              )}
              {user.cidade && (
                <div>
                  <p className="text-sm text-muted-foreground">Cidade</p>
                  <p className="font-medium">{user.cidade}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Plano Atual */}
          <Card>
            <CardHeader>
              <CardTitle>Plano Atual</CardTitle>
              <CardDescription>
                Seu plano e uso mensal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <planoAtual.icon className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">{planoAtual.nome}</p>
                    <p className="text-sm text-muted-foreground">{planoAtual.preco}</p>
                  </div>
                </div>
                <Badge variant={planoAtual.cor as any}>{planoAtual.nome}</Badge>
              </div>

              {/* Barra de uso */}
              {planoAtual.limite !== Infinity && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Uso do mês</span>
                    <span className="font-medium">{usado} / {limite}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(porcentagem, 100)}%` }}
                    />
                  </div>
                  {usado >= limite && (
                    <p className="text-sm text-destructive">
                      Limite atingido! Faça upgrade para criar mais jobs.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Planos Disponíveis */}
          <Card>
            <CardHeader>
              <CardTitle>Planos Disponíveis</CardTitle>
              <CardDescription>
                Escolha o plano ideal para suas necessidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {Object.entries(PLANOS)
                  .filter(([key]) => key !== "admin")
                  .map(([key, plano]) => {
                  const Icon = plano.icon;
                  const isAtual = user.plano === key;
                  
                  return (
                    <Card
                      key={key}
                      className={`relative ${isAtual ? "border-primary" : ""}`}
                    >
                      {isAtual && (
                        <div className="absolute top-2 right-2">
                          <Badge>Atual</Badge>
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="h-5 w-5" />
                          <CardTitle className="text-lg">{plano.nome}</CardTitle>
                        </div>
                        <CardDescription className="text-2xl font-bold">
                          {plano.preco}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 mb-4">
                          {plano.recursos.map((recurso, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{recurso}</span>
                            </li>
                          ))}
                        </ul>
                        {!isAtual && (
                          <Button 
                            className="w-full" 
                            variant={key === "pro" ? "default" : "outline"}
                            onClick={() => {
                              if (key === "free") {
                                // Não há downgrade para free
                                return;
                              }
                              // Redirecionar para checkout da Cakto
                              if (user?.email) {
                                const checkoutUrl = getCheckoutUrlForPlan(
                                  key as "pro" | "enterprise",
                                  user.email,
                                  user.nome_completo || undefined
                                );
                                window.location.href = checkoutUrl;
                              }
                            }}
                          >
                            {key === "free" ? "Plano Atual" : "Assinar Agora"}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                💳 Pagamentos processados com segurança pela Cakto
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
