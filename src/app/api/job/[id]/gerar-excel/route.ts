import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { gerarExcelOrcamento, excelToBuffer } from "@/lib/excel/gerar-excel-orcamento";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = id;

    // Preferir autenticação via Authorization Bearer (mais confiável no Vercel)
    const authHeader = request.headers.get("authorization") || request.headers.get("Authorization") || "";
    const token = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7).trim() : "";

    if (!token) {
      return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
    }

    const supabase = createClient(
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

    const { data: userData, error: authError } = await supabase.auth.getUser(token);
    const user = userData?.user;

    if (authError || !user) {
      return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
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

    // Upload para Supabase Storage usando SERVICE_ROLE_KEY para garantir permissões
    const fileName = `excel/${processo.user_id}/${jobId}_${Date.now()}.xlsx`;
    
    // Criar cliente com SERVICE_ROLE_KEY para upload (bypass RLS)
    const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
    const supabaseStorage = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: uploadData, error: uploadError } = await supabaseStorage.storage
      .from("uploads")
      .upload(fileName, excelBuffer, {
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        upsert: false,
      });

    if (uploadError) {
      console.error("[Excel] Erro no upload do Excel:", uploadError);
      console.error("[Excel] Detalhes:", JSON.stringify(uploadError, null, 2));
      return NextResponse.json(
        { erro: `Erro ao fazer upload do Excel: ${uploadError.message || "Erro desconhecido"}` },
        { status: 500 }
      );
    }

    // Obter URL pública
    const {
      data: { publicUrl },
    } = supabaseStorage.storage.from("uploads").getPublicUrl(fileName);

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
