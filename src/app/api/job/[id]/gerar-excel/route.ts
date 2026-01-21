import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { gerarExcelOrcamento, excelToBuffer } from "@/lib/excel/gerar-excel-orcamento";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = id;

    // Criar cliente Supabase com autenticação do usuário
    const cookieStore = await cookies();
    const supabase = createServerClient(
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
      console.error("[Excel] Erro ao buscar processo:", processoError);
      return NextResponse.json(
        { erro: "Processo não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se é do tipo orçamento
    if (processo.tipo !== "orcamento") {
      return NextResponse.json(
        { erro: "Excel só está disponível para orçamentos" },
        { status: 400 }
      );
    }

    // Parse dos dados processados
    let dadosProcessados: any = {};
    if (processo.observacoes) {
      try {
        dadosProcessados = JSON.parse(processo.observacoes);
      } catch (e) {
        return NextResponse.json(
          { erro: "Dados do processo inválidos" },
          { status: 400 }
        );
      }
    }

    // Gerar Excel
    const workbook = gerarExcelOrcamento({
      ...dadosProcessados,
      cliente_nome: processo.cliente_nome,
      cidade: processo.cidade,
      created_at: processo.created_at,
    });

    // Converter para buffer
    const excelBuffer = excelToBuffer(workbook);

    // Upload para Supabase Storage
    const fileName = `excel/${processo.user_id}/${jobId}_${Date.now()}.xlsx`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(fileName, excelBuffer, {
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        upsert: false,
      });

    if (uploadError) {
      console.error("Erro no upload do Excel:", uploadError);
      return NextResponse.json(
        { erro: "Erro ao fazer upload do Excel" },
        { status: 500 }
      );
    }

    // Obter URL pública
    const {
      data: { publicUrl },
    } = supabase.storage.from("uploads").getPublicUrl(fileName);

    // Atualizar processo com URL do Excel
    const { error: updateError } = await supabase
      .from("jobs")
      .update({ resultado_excel: publicUrl })
      .eq("id", jobId);

    if (updateError) {
      console.error("Erro ao atualizar processo:", updateError);
      return NextResponse.json(
        { erro: "Erro ao salvar URL do Excel" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sucesso: true,
      excel_url: publicUrl,
    });
  } catch (error: any) {
    console.error("Erro ao gerar Excel:", error);
    return NextResponse.json(
      { erro: error.message || "Erro ao gerar Excel" },
      { status: 500 }
    );
  }
}
