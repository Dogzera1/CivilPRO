/**
 * Cliente para API da Perplexity
 * Documentação: https://docs.perplexity.ai/
 */

import {
  gerarPromptRegularizacao,
  gerarPromptOrcamento,
  gerarPromptPlantaEletrica,
  gerarPromptPlantaHidraulica,
  gerarPromptLaudo,
  gerarPromptConformidade,
  DadosCliente,
} from "./prompts";

const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";
// Usar variável de ambiente do servidor (não expor no cliente)
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY || process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY || "";

export interface PerplexityMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callPerplexity(
  messages: PerplexityMessage[],
  model: string = "sonar"
): Promise<string> {
  if (!PERPLEXITY_API_KEY) {
    console.error("[Perplexity] API key não encontrada. Variáveis disponíveis:", {
      PERPLEXITY_API_KEY: !!process.env.PERPLEXITY_API_KEY,
      NEXT_PUBLIC_PERPLEXITY_API_KEY: !!process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY,
    });
    throw new Error("Perplexity API key não configurada. Verifique PERPLEXITY_API_KEY no .env.local");
  }

  console.log("[Perplexity] Chamando API com modelo:", model);
  console.log("[Perplexity] Mensagens:", messages.length);

  try {
    const response = await fetch(PERPLEXITY_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.2,
        max_tokens: 4000,
        // Não incluir logprobs para evitar erros de validação
      }),
    });

    console.log("[Perplexity] Status da resposta:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Perplexity] Erro da API:", errorText);
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";
    console.log("[Perplexity] Resposta recebida, tamanho:", content.length);
    
    if (!content) {
      console.warn("[Perplexity] Resposta vazia:", JSON.stringify(data, null, 2));
    }
    
    return content;
  } catch (error: any) {
    console.error("[Perplexity] Erro ao chamar API:", error);
    console.error("[Perplexity] Tipo do erro:", error.constructor.name);
    console.error("[Perplexity] Mensagem:", error.message);
    throw error;
  }
}

export async function analisarPlantaRegularizacao(
  descricaoArquivo: string,
  endereco?: string,
  cidade?: string,
  clienteNome?: string,
  observacoes?: string
): Promise<{
  area_total: number;
  area_construida: number;
  recuos: Record<string, number>;
  memorial: string;
  taxa_ocupacao?: number;
  pavimentos?: number;
  tipo_edificacao?: string;
  conformidade?: {
    conforme: boolean;
    observacoes: string;
  };
}> {
  const dadosCliente: DadosCliente = {
    cliente_nome: clienteNome,
    endereco_obra: endereco,
    cidade: cidade,
    observacoes: observacoes,
  };

  const prompt = gerarPromptRegularizacao(descricaoArquivo, dadosCliente);

  const messages: PerplexityMessage[] = [
    {
      role: "system",
      content: "Você é um engenheiro civil especialista em regularização de imóveis. Sempre retorne JSON válido conforme solicitado.",
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  const response = await callPerplexity(messages);
  
  // Tentar extrair JSON da resposta
  try {
    // Remover markdown code blocks se houver
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                     response.match(/```\s*([\s\S]*?)\s*```/) ||
                     [null, response];
    
    const jsonStr = jsonMatch[1] || response;
    const parsed = JSON.parse(jsonStr.trim());
    
    return {
      area_total: parsed.area_total || 0,
      area_construida: parsed.area_construida || 0,
      recuos: parsed.recuos || {},
      memorial: parsed.memorial || "Memorial descritivo gerado pela IA.",
      taxa_ocupacao: parsed.taxa_ocupacao,
      pavimentos: parsed.pavimentos,
      tipo_edificacao: parsed.tipo_edificacao,
      conformidade: parsed.conformidade,
    };
  } catch (error) {
    // Se não conseguir parsear JSON, retornar valores padrão com memorial da resposta
    return {
      area_total: 0,
      area_construida: 0,
      recuos: {},
      memorial: response || "Memorial descritivo gerado pela IA.",
    };
  }
}

export async function gerarOrcamento(
  descricaoPlanta: string,
  cidade?: string,
  clienteNome?: string,
  observacoes?: string
): Promise<{
  quantidade_aco: number;
  quantidade_concreto: number;
  quantidade_blocos?: number;
  quantidade_telhas?: number;
  quantidade_portas?: number;
  quantidade_janelas?: number;
  pontos_eletricos?: number;
  pontos_hidraulicos?: number;
  area_construida?: number;
  valor_total: number;
  detalhamento: string;
  quantitativos?: Array<{
    item: string;
    unidade: string;
    quantidade: number;
    preco_unitario: number;
    total: number;
  }>;
  cronograma?: Array<{
    mes: number;
    etapa: string;
    valor: number;
    acumulado: number;
  }>;
}> {
  const dadosCliente: DadosCliente = {
    cliente_nome: clienteNome,
    cidade: cidade,
    observacoes: observacoes,
  };

  const prompt = gerarPromptOrcamento(descricaoPlanta, dadosCliente);

  const messages: PerplexityMessage[] = [
    {
      role: "system",
      content: "Você é um engenheiro civil especialista em orçamentos e quantitativos. Sempre retorne JSON válido conforme solicitado.",
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  const response = await callPerplexity(messages);
  
  try {
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                     response.match(/```\s*([\s\S]*?)\s*```/) ||
                     [null, response];
    
    const jsonStr = jsonMatch[1] || response;
    const parsed = JSON.parse(jsonStr.trim());
    
    return {
      quantidade_aco: parsed.quantidade_aco || 0,
      quantidade_concreto: parsed.quantidade_concreto || 0,
      quantidade_blocos: parsed.quantidade_blocos,
      quantidade_telhas: parsed.quantidade_telhas,
      quantidade_portas: parsed.quantidade_portas,
      quantidade_janelas: parsed.quantidade_janelas,
      pontos_eletricos: parsed.pontos_eletricos,
      pontos_hidraulicos: parsed.pontos_hidraulicos,
      area_construida: parsed.area_construida,
      valor_total: parsed.valor_total || 0,
      detalhamento: parsed.detalhamento || "Orçamento gerado pela IA.",
      quantitativos: parsed.quantitativos,
      cronograma: parsed.cronograma,
    };
  } catch (error) {
    return {
      quantidade_aco: 0,
      quantidade_concreto: 0,
      valor_total: 0,
      detalhamento: response || "Orçamento gerado pela IA.",
    };
  }
}

/**
 * Gera planta complementar elétrica
 */
export async function gerarPlantaEletrica(
  descricaoPlanta: string,
  dadosCliente: DadosCliente
): Promise<any> {
  const prompt = gerarPromptPlantaEletrica(descricaoPlanta, dadosCliente);

  const messages: PerplexityMessage[] = [
    {
      role: "system",
      content: "Você é um engenheiro eletricista especialista. Sempre retorne JSON válido conforme solicitado.",
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  const response = await callPerplexity(messages);
  
  try {
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                     response.match(/```\s*([\s\S]*?)\s*```/) ||
                     [null, response];
    
    const jsonStr = jsonMatch[1] || response;
    return JSON.parse(jsonStr.trim());
  } catch (error) {
    return { erro: "Erro ao processar resposta", resposta_bruta: response };
  }
}

/**
 * Gera planta complementar hidráulica
 */
export async function gerarPlantaHidraulica(
  descricaoPlanta: string,
  dadosCliente: DadosCliente
): Promise<any> {
  const prompt = gerarPromptPlantaHidraulica(descricaoPlanta, dadosCliente);

  const messages: PerplexityMessage[] = [
    {
      role: "system",
      content: "Você é um engenheiro especialista em projetos hidrossanitários. Sempre retorne JSON válido conforme solicitado.",
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  const response = await callPerplexity(messages);
  
  try {
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                     response.match(/```\s*([\s\S]*?)\s*```/) ||
                     [null, response];
    
    const jsonStr = jsonMatch[1] || response;
    return JSON.parse(jsonStr.trim());
  } catch (error) {
    return { erro: "Erro ao processar resposta", resposta_bruta: response };
  }
}

/**
 * Gera laudo técnico
 */
export async function gerarLaudo(
  descricaoDocumentos: string,
  dadosCliente: DadosCliente
): Promise<any> {
  const prompt = gerarPromptLaudo(descricaoDocumentos, dadosCliente);

  const messages: PerplexityMessage[] = [
    {
      role: "system",
      content: "Você é um engenheiro civil especialista em laudos técnicos. Sempre retorne JSON válido conforme solicitado.",
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  const response = await callPerplexity(messages);
  
  try {
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                     response.match(/```\s*([\s\S]*?)\s*```/) ||
                     [null, response];
    
    const jsonStr = jsonMatch[1] || response;
    return JSON.parse(jsonStr.trim());
  } catch (error) {
    return { erro: "Erro ao processar resposta", resposta_bruta: response };
  }
}

/**
 * Verifica conformidade urbanística
 */
export async function verificarConformidade(
  descricaoDocumentos: string,
  dadosCliente: DadosCliente
): Promise<any> {
  const prompt = gerarPromptConformidade(descricaoDocumentos, dadosCliente);

  const messages: PerplexityMessage[] = [
    {
      role: "system",
      content: "Você é um engenheiro civil especialista em conformidade urbanística. Sempre retorne JSON válido conforme solicitado.",
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  const response = await callPerplexity(messages);
  
  try {
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                     response.match(/```\s*([\s\S]*?)\s*```/) ||
                     [null, response];
    
    const jsonStr = jsonMatch[1] || response;
    return JSON.parse(jsonStr.trim());
  } catch (error) {
    return { erro: "Erro ao processar resposta", resposta_bruta: response };
  }
}
