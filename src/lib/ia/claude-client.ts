/**
 * Cliente para API do Claude (Anthropic)
 * Documentação: https://docs.anthropic.com/claude/reference/messages_post
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

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
// Usar variável de ambiente do servidor (não expor no cliente)
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || process.env.NEXT_PUBLIC_CLAUDE_API_KEY || "";

export interface ClaudeMessage {
  role: "user" | "assistant";
  content: string | Array<{ type: "text" | "image"; text?: string; source?: { type: string; data: string; media_type: string } }>;
}

export async function callClaude(
  messages: ClaudeMessage[],
  model: string = "claude-3-5-sonnet-20241022",
  system?: string
): Promise<string> {
  if (!CLAUDE_API_KEY) {
    console.error("[Claude] API key não encontrada. Variáveis disponíveis:", {
      CLAUDE_API_KEY: !!process.env.CLAUDE_API_KEY,
      NEXT_PUBLIC_CLAUDE_API_KEY: !!process.env.NEXT_PUBLIC_CLAUDE_API_KEY,
    });
    throw new Error("Claude API key não configurada. Verifique CLAUDE_API_KEY no .env.local");
  }

  console.log("[Claude] Chamando API com modelo:", model);
  console.log("[Claude] Mensagens:", messages.length);

  try {
    const requestBody: any = {
      model,
      max_tokens: 4096,
      messages: messages.map(msg => ({
        role: msg.role,
        content: typeof msg.content === "string" ? msg.content : msg.content,
      })),
    };

    if (system) {
      requestBody.system = system;
    }

    const response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("[Claude] Status da resposta:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Claude] Erro da API:", errorText);
      throw new Error(`Claude API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || "";
    console.log("[Claude] Resposta recebida, tamanho:", content.length);
    
    if (!content) {
      console.warn("[Claude] Resposta vazia:", JSON.stringify(data, null, 2));
    }
    
    return content;
  } catch (error: any) {
    console.error("[Claude] Erro ao chamar API:", error);
    console.error("[Claude] Tipo do erro:", error.constructor.name);
    console.error("[Claude] Mensagem:", error.message);
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

  const messages: ClaudeMessage[] = [
    {
      role: "user",
      content: prompt,
    },
  ];

  const systemPrompt = "Você é um engenheiro civil especialista em regularização de imóveis. Sempre retorne JSON válido conforme solicitado.";

  const response = await callClaude(messages, "claude-3-5-sonnet-20241022", systemPrompt);
  
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

  const messages: ClaudeMessage[] = [
    {
      role: "user",
      content: prompt,
    },
  ];

  const systemPrompt = "Você é um engenheiro civil especialista em orçamentos e quantitativos. Sempre retorne JSON válido conforme solicitado.";

  const response = await callClaude(messages, "claude-3-5-sonnet-20241022", systemPrompt);
  
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

  const messages: ClaudeMessage[] = [
    {
      role: "user",
      content: prompt,
    },
  ];

  const systemPrompt = "Você é um engenheiro eletricista especialista. Sempre retorne JSON válido conforme solicitado.";

  const response = await callClaude(messages, "claude-3-5-sonnet-20241022", systemPrompt);
  
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

  const messages: ClaudeMessage[] = [
    {
      role: "user",
      content: prompt,
    },
  ];

  const systemPrompt = "Você é um engenheiro especialista em projetos hidrossanitários. Sempre retorne JSON válido conforme solicitado.";

  const response = await callClaude(messages, "claude-3-5-sonnet-20241022", systemPrompt);
  
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

  const messages: ClaudeMessage[] = [
    {
      role: "user",
      content: prompt,
    },
  ];

  const systemPrompt = "Você é um engenheiro civil especialista em laudos técnicos. Sempre retorne JSON válido conforme solicitado.";

  const response = await callClaude(messages, "claude-3-5-sonnet-20241022", systemPrompt);
  
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

  const messages: ClaudeMessage[] = [
    {
      role: "user",
      content: prompt,
    },
  ];

  const systemPrompt = "Você é um engenheiro civil especialista em conformidade urbanística. Sempre retorne JSON válido conforme solicitado.";

  const response = await callClaude(messages, "claude-3-5-sonnet-20241022", systemPrompt);
  
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
