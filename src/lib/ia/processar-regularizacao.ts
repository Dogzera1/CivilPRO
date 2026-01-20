/**
 * Processamento de Regularização com IA
 * 
 * Este módulo processa plantas/fotos para gerar:
 * - Cálculo de áreas
 * - Memorial descritivo
 * - Template de ART
 * - Verificação de conformidade
 */

import { ProcessamentoResult } from "@/types";
import { analisarPlantaRegularizacao } from "./perplexity-client";

export async function processarRegularizacao(
  fileUrls: string[],
  dadosCliente: {
    endereco?: string;
    cidade?: string;
  }
): Promise<ProcessamentoResult> {
  try {
    console.log("[IA] Iniciando processamento de regularização...");
    console.log("[IA] Arquivos:", fileUrls.length);
    console.log("[IA] Dados cliente:", dadosCliente);

    // Preparar descrição dos arquivos
    const descricaoArquivos = fileUrls
      .map((url, index) => `Arquivo ${index + 1}: ${url.split("/").pop()}`)
      .join("\n");

    // Chamar API da Perplexity
    const resultado = await analisarPlantaRegularizacao(
      descricaoArquivos,
      dadosCliente.endereco,
      dadosCliente.cidade
    );

    console.log("[IA] Resultado:", resultado);

    // TODO: Gerar PDF com jsPDF usando o memorial gerado
    
    return {
      sucesso: true,
      mensagem: "Processamento concluído com sucesso",
      pdf_url: "#", // Será gerado depois
      dados_extrados: {
        area_total: resultado.area_total,
        area_construida: resultado.area_construida,
        recuos: resultado.recuos,
        memorial: resultado.memorial,
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


