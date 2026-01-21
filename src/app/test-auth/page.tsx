"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TestAuthPage() {
  const [status, setStatus] = useState<string>("Verificando...");
  const [details, setDetails] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  const checkAuth = async () => {
    try {
      // Verificar sessão
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log("Sessão:", session);
      console.log("Erro sessão:", sessionError);

      // Verificar usuário
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log("Usuário:", user);
      console.log("Erro usuário:", userError);

      if (session || user) {
        setStatus("✅ AUTENTICADO");
        setDetails({
          session: session ? "Presente" : "Ausente",
          user: user ? user.email : "Não encontrado",
          userId: user?.id,
        });
      } else {
        setStatus("❌ NÃO AUTENTICADO");
        setDetails({
          sessionError: sessionError?.message,
          userError: userError?.message,
        });
      }
    } catch (err: any) {
      setStatus("❌ ERRO");
      setDetails({ error: err.message });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Teste de Autenticação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-lg font-semibold">{status}</p>
          </div>
          
          {details && (
            <div className="rounded-md bg-muted p-4">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(details, null, 2)}
              </pre>
            </div>
          )}

          <div className="flex gap-4">
            <Button onClick={checkAuth}>Verificar Novamente</Button>
            <Button onClick={() => router.push("/dashboard")} variant="outline">
              Ir para Dashboard
            </Button>
            {details?.user && (
              <Button onClick={handleLogout} variant="destructive">
                Fazer Logout
              </Button>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Abra o Console (F12) para ver logs detalhados.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
