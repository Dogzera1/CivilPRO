import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { gerarPDFRegularizacao } from "@/lib/pdf/gerar-pdf-regularizacao";
import { gerarPDFOrcamento } from "@/lib/pdf/gerar-pdf-orcamento";
import { gerarPDFLaudo } from "@/lib/pdf/gerar-pdf-laudo";
import { gerarPDFConformidade } from "@/lib/pdf/gerar-pdf-conformidade";

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
      console.error("[PDF] Erro ao buscar processo:", processoError);
      return NextResponse.json(
        { erro: "Processo não encontrado" },
        { status: 404 }
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

    // Gerar PDF baseado no tipo
    let pdfDoc;
    if (processo.tipo === "regularizacao") {
      pdfDoc = gerarPDFRegularizacao({
        ...dadosProcessados,
        cliente_nome: processo.cliente_nome,
        endereco_obra: processo.endereco_obra,
        cidade: processo.cidade,
        created_at: processo.created_at,
      });
    } else if (processo.tipo === "orcamento") {
      pdfDoc = gerarPDFOrcamento({
        ...dadosProcessados,
        cliente_nome: processo.cliente_nome,
        cidade: processo.cidade,
        created_at: processo.created_at,
      });
    } else if (processo.tipo === "laudo") {
      pdfDoc = gerarPDFLaudo({
        ...dadosProcessados,
        cliente_nome: processo.cliente_nome,
        endereco_obra: processo.endereco_obra,
        cidade: processo.cidade,
      });
    } else if (processo.tipo === "conformidade") {
      pdfDoc = gerarPDFConformidade({
        ...dadosProcessados,
        cliente_nome: processo.cliente_nome,
        endereco_obra: processo.endereco_obra,
        cidade: processo.cidade,
      });
    } else {
      return NextResponse.json(
        { erro: "Tipo de processo não suporta geração de PDF" },
        { status: 400 }
      );
    }

    // Converter PDF para blob
    const pdfBlob = pdfDoc.output("blob");
    const pdfBuffer = await pdfBlob.arrayBuffer();
    const pdfArray = new Uint8Array(pdfBuffer);

    // Upload para Supabase Storage usando SERVICE_ROLE_KEY para garantir permissões
    const fileName = `pdfs/${processo.user_id}/${jobId}_${Date.now()}.pdf`;
    
    // Criar cliente com SERVICE_ROLE_KEY para upload (bypass RLS)
    const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
    const supabaseStorage = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: uploadData, error: uploadError } = await supabaseStorage.storage
      .from("uploads")
      .upload(fileName, pdfArray, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("[PDF] Erro no upload do PDF:", uploadError);
      console.error("[PDF] Detalhes:", JSON.stringify(uploadError, null, 2));
      return NextResponse.json(
        { erro: `Erro ao fazer upload do PDF: ${uploadError.message || "Erro desconhecido"}` },
        { status: 500 }
      );
    }

    // Obter URL pública
    const {
      data: { publicUrl },
    } = supabaseStorage.storage.from("uploads").getPublicUrl(fileName);

    // Atualizar processo com URL do PDF
    const { error: updateError } = await supabase
      .from("jobs")
      .update({ resultado_pdf: publicUrl })
      .eq("id", jobId);

    if (updateError) {
      console.error("Erro ao atualizar processo:", updateError);
      return NextResponse.json(
        { erro: "Erro ao salvar URL do PDF" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sucesso: true,
      pdf_url: publicUrl,
    });
  } catch (error: any) {
    console.error("Erro ao gerar PDF:", error);
    return NextResponse.json(
      { erro: error.message || "Erro ao gerar PDF" },
      { status: 500 }
    );
  }
}
