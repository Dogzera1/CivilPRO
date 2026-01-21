import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = id;

    // Ler dados do body
    const body = await request.json();
    const { dados } = body;

    if (!dados) {
      return NextResponse.json(
        { erro: "Dados não fornecidos" },
        { status: 400 }
      );
    }

    // Verificar autenticação via header Bearer token
    const authHeader = request.headers.get("authorization");
    let supabase;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
      supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        }
      );
    } else {
      // Fallback para cookies
      const cookieStore = await cookies();
      supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            },
          },
        }
      );
    }

    // Verificar autenticação do usuário
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { erro: "Não autenticado" },
        { status: 401 }
      );
    }

    // Buscar o processo (apenas do usuário autenticado)
    const { data: processo, error: processoError } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .eq("user_id", user.id)
      .single();

    if (processoError || !processo) {
      console.error("[Atualizar Dados] Erro ao buscar processo:", processoError);
      return NextResponse.json(
        { erro: "Processo não encontrado" },
        { status: 404 }
      );
    }

    // Mesclar dados existentes com novos dados
    let dadosAtualizados: any = {};
    if (processo.observacoes) {
      try {
        dadosAtualizados = JSON.parse(processo.observacoes);
      } catch (e) {
        // Se não for JSON válido, começar do zero
        dadosAtualizados = {};
      }
    }

    // Mesclar novos dados
    dadosAtualizados = { ...dadosAtualizados, ...dados };

    // Atualizar processo com dados mesclados
    const { error: updateError } = await supabase
      .from("jobs")
      .update({
        observacoes: JSON.stringify(dadosAtualizados),
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("[Atualizar Dados] Erro ao atualizar processo:", updateError);
      return NextResponse.json(
        { erro: "Erro ao atualizar dados do processo" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sucesso: true,
      dados: dadosAtualizados,
    });
  } catch (error: any) {
    console.error("[Atualizar Dados] Erro:", error);
    return NextResponse.json(
      { erro: error.message || "Erro ao atualizar dados" },
      { status: 500 }
    );
  }
}
