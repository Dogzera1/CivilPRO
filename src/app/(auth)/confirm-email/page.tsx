"use client";

import { useEffect, useState, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

function ConfirmEmailContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const confirmEmail = async () => {
      const token_hash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      if (!token_hash || !type) {
        setStatus("error");
        setMessage("Link de confirmação inválido ou expirado.");
        return;
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any,
        });

        if (error) {
          setStatus("error");
          setMessage(error.message || "Erro ao confirmar email. Tente novamente.");
        } else {
          setStatus("success");
          setMessage("Email confirmado com sucesso! Redirecionando...");
          
          // Aguardar um pouco e redirecionar
          setTimeout(() => {
            router.push("/dashboard");
            router.refresh();
          }, 2000);
        }
      } catch (err) {
        setStatus("error");
        setMessage("Erro inesperado ao confirmar email.");
      }
    };

    confirmEmail();
  }, [searchParams, router, supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Confirmação de Email</CardTitle>
          <CardDescription>
            {status === "loading" && "Confirmando seu email..."}
            {status === "success" && "Email confirmado!"}
            {status === "error" && "Erro na confirmação"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">
                Aguarde enquanto confirmamos seu email...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="mt-4 text-center text-sm text-muted-foreground">
                {message}
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center justify-center py-8">
              <XCircle className="h-12 w-12 text-destructive" />
              <p className="mt-4 text-center text-sm text-destructive">
                {message}
              </p>
              <div className="mt-6 flex gap-4">
                <Link href="/login">
                  <Button variant="outline">Ir para Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Criar Nova Conta</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    }>
      <ConfirmEmailContent />
    </Suspense>
  );
}
