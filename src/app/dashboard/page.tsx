"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Processo } from "@/types";
import { DashboardStats } from "@/components/dashboard-stats";
import { ProcessoCard } from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  const loadUser = useCallback(async () => {
    try {
      // Verificar sessão primeiro
      const { data: { session } } = await supabase.auth.getSession();
      
      let currentUser = null;
      
      if (session?.user) {
        currentUser = session.user;
      } else {
        // Tentar obter usuário diretamente
        const {
          data: { user },
        } = await supabase.auth.getUser();
        currentUser = user;
      }
      
      if (!currentUser) {
        console.log("[Dashboard] Usuário não encontrado");
        return;
      }
      
      setUser(currentUser);
      
      // Buscar dados do usuário na tabela users
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", currentUser.id)
        .single();
      if (data) setUser({ ...currentUser, ...data });
    } catch (err) {
      console.error("Erro ao carregar usuário:", err);
    }
  }, [supabase]);

  const loadProcessos = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar processos:", error);
    } else {
      setProcessos(data || []);
    }
    setLoading(false);
  }, [supabase]);

  const checkAuthAndLoad = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    console.log("[Dashboard] Sessão:", session ? "Presente" : "Ausente");
    console.log("[Dashboard] Usuário:", authUser ? authUser.email : "Não encontrado");

    if (!session && !authUser) {
      console.log("[Dashboard] Não autenticado, redirecionando para login...");
      router.replace("/login");
      return;
    }

    await loadUser();
    await loadProcessos();
  }, [loadProcessos, loadUser, router, supabase]);

  useEffect(() => {
    checkAuthAndLoad();
  }, [checkAuthAndLoad]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

        const processosPendentes = processos.filter((p) => p.status === "pendente").length;
        const processosConcluidos = processos.filter(
          (p) => p.status === "concluido" || p.status === "aprovado"
        ).length;
        const processosMesAtual = processos.filter((p) => {
          const date = new Date(p.created_at);
          const now = new Date();
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">CivilAI Pro</h1>
                 <div className="flex items-center gap-4">
                   {user && (
                     <>
                       <Link href="/configuracoes">
                         <Button variant="ghost" size="sm">
                           {user.plano && (
                             <span className="mr-2 text-xs px-2 py-1 bg-primary/10 rounded">
                               {user.plano.toUpperCase()}
                             </span>
                           )}
                           {user.nome_completo || user.email}
                         </Button>
                       </Link>
                     </>
                   )}
                   <Button variant="ghost" size="icon" onClick={handleLogout}>
                     <LogOut className="h-4 w-4" />
                   </Button>
                 </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <p className="text-muted-foreground">
              Gerencie seus processos de engenharia
            </p>
          </div>
          <Link href="/novo-processo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Processo
            </Button>
          </Link>
        </div>

        <div className="mb-8">
               <DashboardStats
                 totalJobs={processos.length}
                 jobsPendentes={processosPendentes}
                 jobsConcluidos={processosConcluidos}
                 jobsMesAtual={processosMesAtual}
               />
        </div>

        <div>
          <h3 className="mb-4 text-xl font-semibold">Seus Processos</h3>
          {loading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : processos.length === 0 ? (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <p className="mb-4 text-muted-foreground">
                Nenhum processo ainda. Crie seu primeiro processo!
              </p>
              <Link href="/novo-processo">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Processo
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {processos.map((processo) => (
                <ProcessoCard key={processo.id} processo={processo} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


