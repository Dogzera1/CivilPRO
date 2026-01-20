/**
 * Cliente para API da Perplexity
 * Documentação: https://docs.perplexity.ai/
 */

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
  cidade?: string
): Promise<{
  area_total: number;
  area_construida: number;
  recuos: Record<string, number>;
  memorial: string;
}> {
  const prompt = `Você é um engenheiro civil especialista em regularização de imóveis.

Analise a seguinte informação sobre uma planta/imóvel:
${descricaoArquivo ? `Descrição do arquivo: ${descricaoArquivo}` : ""}
${endereco ? `Endereço: ${endereco}` : ""}
${cidade ? `Cidade: ${cidade}` : ""}

Gere um relatório técnico em formato JSON com:
1. area_total: área total do terreno em m² (número)
2. area_construida: área construída em m² (número)
3. recuos: objeto com recuos em metros (ex: {frontal: 5, lateral_esquerda: 3, lateral_direita: 3, fundos: 5})
4. memorial: memorial descritivo completo em português brasileiro

IMPORTANTE: Retorne APENAS um JSON válido, sem markdown, sem explicações adicionais.`;

  const messages: PerplexityMessage[] = [
    {
      role: "system",
      content: "Você é um engenheiro civil especialista. Sempre retorne JSON válido.",
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
  cidade?: string
): Promise<{
  quantidade_aco: number;
  quantidade_concreto: number;
  valor_total: number;
  detalhamento: string;
}> {
  const prompt = `Você é um engenheiro civil especialista em orçamentos de obras.

Analise a seguinte informação sobre uma planta:
${descricaoPlanta}
${cidade ? `Cidade: ${cidade}` : ""}

Gere um orçamento em formato JSON com:
1. quantidade_aco: quantidade de aço em kg (número)
2. quantidade_concreto: quantidade de concreto em m³ (número)
3. valor_total: valor total estimado em R$ (número)
4. detalhamento: texto detalhado do orçamento em português brasileiro

IMPORTANTE: Retorne APENAS um JSON válido, sem markdown, sem explicações adicionais.`;

  const messages: PerplexityMessage[] = [
    {
      role: "system",
      content: "Você é um engenheiro civil especialista em orçamentos. Sempre retorne JSON válido.",
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
      valor_total: parsed.valor_total || 0,
      detalhamento: parsed.detalhamento || "Orçamento gerado pela IA.",
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
