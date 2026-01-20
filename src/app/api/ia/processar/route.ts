import { NextRequest, NextResponse } from "next/server";
import { analisarPlantaRegularizacao, gerarOrcamento } from "@/lib/ia/perplexity-client";

export const runtime = 'nodejs'; // Garantir que roda no Node.js

export async function POST(request: NextRequest) {
  try {
    // Verificar método
    if (request.method !== 'POST') {
      return NextResponse.json(
        { erro: "Método não permitido" },
        { status: 405 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { erro: "Corpo da requisição inválido" },
        { status: 400 }
      );
    }

    const { tipo, fileUrls, dadosCliente } = body;

    console.log("[API IA] Processando:", { tipo, fileUrls: fileUrls?.length, dadosCliente });

    if (!tipo) {
      return NextResponse.json(
        { erro: "Tipo de processamento não informado" },
        { status: 400 }
      );
    }

    // Verificar se a chave da API está configurada
    const apiKey = process.env.PERPLEXITY_API_KEY || process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY;
    if (!apiKey) {
      console.error("[API IA] PERPLEXITY_API_KEY não configurada");
      return NextResponse.json(
        { erro: "Chave da API não configurada no servidor" },
        { status: 500 }
      );
    }

    let resultado;

    try {
      console.log("[API IA] Iniciando processamento do tipo:", tipo);
      
      if (tipo === "regularizacao") {
        resultado = await analisarPlantaRegularizacao(
          fileUrls?.join(", ") || "",
          dadosCliente?.endereco,
          dadosCliente?.cidade
        );
      } else if (tipo === "orcamento") {
        resultado = await gerarOrcamento(
          fileUrls?.join(", ") || "",
          dadosCliente?.cidade
        );
      } else {
        return NextResponse.json(
          { erro: `Tipo de processamento não suportado: ${tipo}` },
          { status: 400 }
        );
      }
      
      console.log("[API IA] Processamento concluído com sucesso");
    } catch (processError: any) {
      console.error("[API IA] Erro no processamento:", processError);
      console.error("[API IA] Stack:", processError.stack);
      
      // Retornar mensagem de erro mais detalhada
      const errorMessage = processError.message || String(processError);
      const errorStack = processError.stack || "";
      
      return NextResponse.json(
        { 
          erro: `Erro ao processar: ${errorMessage}`,
          detalhes: process.env.NODE_ENV === 'development' ? errorStack : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sucesso: true,
      dados: resultado,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error("[API IA] Erro geral:", error);
    return NextResponse.json(
      { erro: error.message || "Erro ao processar com IA" },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
