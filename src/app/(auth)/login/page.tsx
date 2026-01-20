"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // Removido: deixar apenas o middleware fazer o redirecionamento para evitar loops

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Logs forçados para aparecer no console
    console.log("=== INICIANDO LOGIN ===");
    console.log("Email:", email);
    console.log("Supabase configurado:", !!process.env.NEXT_PUBLIC_SUPABASE_URL);

    // Timeout de segurança para evitar travamento
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError("Tempo de espera excedido. Verifique sua conexão e tente novamente.");
    }, 10000); // 10 segundos

    try {
      console.log("Chamando signInWithPassword...");
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      clearTimeout(timeoutId);

      console.log("Resposta do login:", { data, error });

      if (error) {
        console.error("Erro no login:", error);
        // Mensagens de erro mais amigáveis
        let errorMessage = error.message;
        
        if (error.message.includes("Email not confirmed") || error.message.includes("email_not_confirmed")) {
          errorMessage = "Email não confirmado. Verifique sua caixa de entrada e clique no link de confirmação.";
        } else if (error.message.includes("Invalid login credentials") || error.message.includes("invalid_credentials")) {
          errorMessage = "Email ou senha incorretos. Verifique suas credenciais.";
        } else if (error.message.includes("Email rate limit exceeded")) {
          errorMessage = "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
        }
        
        setError(errorMessage);
        setLoading(false);
        return;
      }

      // Verificar se temos dados do usuário ou sessão
      if (data?.user || data?.session) {
        console.log("Login bem-sucedido! Usuário:", data.user?.email);
        console.log("Sessão:", data.session ? "Presente" : "Ausente");
        
        // Verificar sessão atual
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Sessão atual após login:", currentSession ? "Presente" : "Ausente");
        
        // Resetar loading
        setLoading(false);
        
        // Aguardar um pouco para garantir que os cookies foram salvos
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Verificar novamente antes de redirecionar
        const { data: { user: finalUser } } = await supabase.auth.getUser();
        console.log("Verificação final - Usuário:", finalUser ? finalUser.email : "Não encontrado");
        
        if (finalUser) {
          console.log("Redirecionando para /dashboard...");
          // Redirecionar usando window.location (mais confiável)
          window.location.href = "/dashboard";
        } else {
          setError("Sessão não foi estabelecida corretamente. Tente novamente.");
          setLoading(false);
        }
      } else {
        console.error("Login sem dados:", data);
        setError("Erro ao fazer login. Tente novamente.");
        setLoading(false);
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error("Erro no login (catch):", err);
      setError(err.message || "Erro inesperado ao fazer login. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">CivilAI Pro</CardTitle>
          <CardDescription>
            Seu escritório de engenharia 24/7 com IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="rounded-md bg-destructive/10 p-3">
                <p className="text-sm text-destructive">{error}</p>
                {error.includes("Email não confirmado") && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (email) {
                        const { error: resendError } = await supabase.auth.resend({
                          type: 'signup',
                          email: email,
                        });
                        if (resendError) {
                          setError("Erro ao reenviar email. Tente novamente.");
                        } else {
                          setError("Email de confirmação reenviado! Verifique sua caixa de entrada.");
                        }
                      }
                    }}
                    className="mt-2 text-xs text-primary hover:underline"
                  >
                    Reenviar email de confirmação
                  </button>
                )}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          
          {/* Botão de teste para debug */}
          <div className="mt-4 rounded-md bg-blue-50 p-3 text-center">
            <p className="mb-2 text-xs font-medium text-blue-900">🔍 Debug</p>
            <button
              type="button"
              onClick={async () => {
                console.log("=== TESTE DE LOGIN ===");
                console.log("Email:", email);
                console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
                console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Configurada" : "NÃO CONFIGURADA");
                
                const { data: { user } } = await supabase.auth.getUser();
                console.log("Usuário atual:", user);
                
                if (user) {
                  alert(`Você já está logado como: ${user.email}\nRedirecionando para o dashboard...`);
                  window.location.href = "/dashboard";
                } else if (email && password) {
                  console.log("Tentando login automático...");
                  const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                  });
                  console.log("Resultado:", { data, error });
                  
                  if (error) {
                    alert(`Erro: ${error.message}`);
                  } else if (data?.user) {
                    alert(`Login OK! Usuário: ${data.user.email}\nRedirecionando...`);
                    window.location.href = "/dashboard";
                  }
                } else {
                  alert("Preencha email e senha primeiro!");
                }
              }}
              className="text-xs text-blue-600 hover:underline"
            >
              Verificar Status / Testar Login
            </button>
          </div>
          
                 <div className="mt-4 space-y-2 text-center text-sm">
                   <p className="text-muted-foreground">
                     Não tem conta?{" "}
                     <a href="/signup" className="text-primary hover:underline">
                       Cadastre-se
                     </a>
                   </p>
                   <p className="text-muted-foreground">
                     <a href="/vendas" className="text-primary hover:underline">
                       Ver planos e preços
                     </a>
                   </p>
                 </div>
        </CardContent>
      </Card>
    </div>
  );
}

