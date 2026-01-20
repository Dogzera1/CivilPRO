/**
 * Processamento de Orçamento com IA
 * 
 * Este módulo processa plantas para gerar:
 * - Quantitativos (aço, concreto, etc)
 * - Orçamento baseado em CUB-MG
 * - Planilha Excel com detalhamento
 */

import { ProcessamentoResult } from "@/types";
import { gerarOrcamento } from "./perplexity-client";

export async function processarOrcamento(
  fileUrls: string[],
  dadosCliente: {
    cidade?: string;
  }
): Promise<ProcessamentoResult> {
  try {
    console.log("[IA] Iniciando processamento de orçamento...");
    console.log("[IA] Arquivos:", fileUrls.length);
    console.log("[IA] Cidade:", dadosCliente.cidade);

    // Preparar descrição dos arquivos
    const descricaoArquivos = fileUrls
      .map((url, index) => `Arquivo ${index + 1}: ${url.split("/").pop()}`)
      .join("\n");

    // Chamar API da Perplexity
    const resultado = await gerarOrcamento(
      descricaoArquivos,
      dadosCliente.cidade
    );

    console.log("[IA] Resultado orçamento:", resultado);

    // TODO: Gerar PDF e Excel com os dados gerados
    
    return {
      sucesso: true,
      mensagem: "Orçamento gerado com sucesso",
      pdf_url: "#", // Será gerado depois
      excel_url: "#", // Será gerado depois
      dados_extrados: {
        quantidade_aco: resultado.quantidade_aco,
        quantidade_concreto: resultado.quantidade_concreto,
        valor_total: resultado.valor_total,
        detalhamento: resultado.detalhamento,
      },
    };
  } catch (error: any) {
    console.error("[IA] Erro no processamento:", error);
    return {
      sucesso: false,
      mensagem: `Erro ao processar: ${error.message}`,
      dados_extrados: {},
    };
  }
}


