import { createClient } from "@supabase/supabase-js";

const LIMITES_PLANO = {
  free: 5,
  pro: Infinity,
  enterprise: Infinity,
  admin: Infinity,
};

export async function verificarLimitePlano(
  userId: string,
  supabaseUrl: string,
  supabaseKey: string
): Promise<{ podeCriar: boolean; limite: number; usado: number; plano: string }> {
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Buscar dados do usuário
  const { data: user, error } = await supabase
    .from("users")
    .select("plano, jobs_mes_atual")
    .eq("id", userId)
    .single();

  if (error || !user) {
    return {
      podeCriar: false,
      limite: 0,
      usado: 0,
      plano: "free",
    };
  }

  const plano = user.plano || "free";
  const usado = user.jobs_mes_atual || 0;
  const limite = LIMITES_PLANO[plano as keyof typeof LIMITES_PLANO] || 5;

  return {
    podeCriar: usado < limite,
    limite,
    usado,
    plano,
  };
}

export async function incrementarContadorJobs(
  userId: string,
  supabaseUrl: string,
  supabaseKey: string
): Promise<void> {
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Obter mês atual
  const agora = new Date();
  const mesAtual = agora.getMonth();
  const anoAtual = agora.getFullYear();

  // Buscar último reset
  const { data: user } = await supabase
    .from("users")
    .select("jobs_mes_atual, updated_at")
    .eq("id", userId)
    .single();

  if (user) {
    const ultimaAtualizacao = new Date(user.updated_at);
    const ultimoMes = ultimaAtualizacao.getMonth();
    const ultimoAno = ultimaAtualizacao.getFullYear();

    // Se mudou o mês, resetar contador
    if (mesAtual !== ultimoMes || anoAtual !== ultimoAno) {
      await supabase
        .from("users")
        .update({ jobs_mes_atual: 1 })
        .eq("id", userId);
    } else {
      // Incrementar contador
      await supabase.rpc("increment_jobs_count", { user_id: userId });
    }
  }
}
