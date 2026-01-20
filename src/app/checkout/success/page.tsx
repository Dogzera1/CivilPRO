"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const verifyPayment = async () => {
      const transactionId = searchParams.get("transaction_id");
      const status = searchParams.get("status");

      if (status === "success" || transactionId) {
        // Aguardar alguns segundos para o webhook processar
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Verificar se o plano foi atualizado
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: userData } = await supabase
            .from("users")
            .select("plano")
            .eq("id", user.id)
            .single();

          if (userData && userData.plano !== "free") {
            setSuccess(true);
          }
        }
      }

      setLoading(false);
    };

    verifyPayment();
  }, [searchParams, supabase]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Verificando pagamento...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {success ? (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Pagamento Confirmado!</CardTitle>
              <CardDescription>
                Seu plano foi atualizado com sucesso. Você já pode usar todas as funcionalidades.
              </CardDescription>
            </>
          ) : (
            <>
              <CardTitle className="text-2xl">Processando Pagamento</CardTitle>
              <CardDescription>
                Estamos processando seu pagamento. Você receberá um email de confirmação em breve.
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/dashboard" className="block">
            <Button className="w-full">
              Ir para Dashboard
            </Button>
          </Link>
          <Link href="/configuracoes" className="block">
            <Button variant="outline" className="w-full">
              Ver Meu Plano
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
