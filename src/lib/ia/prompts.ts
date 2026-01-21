/**
 * Prompts Específicos por Tipo de Serviço - CivilAI Pro
 * 
 * Este arquivo contém os prompts detalhados para cada tipo de processamento,
 * conforme especificado no documento "Prompts Específicos por Tipo de Serviço"
 */

export interface DadosCliente {
  cliente_nome?: string;
  endereco_obra?: string;
  cidade?: string;
  observacoes?: string;
}

/**
 * Gera prompt detalhado para Regularização de Imóveis
 */
export function gerarPromptRegularizacao(
  listaArquivos: string,
  dadosCliente: DadosCliente
): string {
  const { cliente_nome = "", endereco_obra = "", cidade = "", observacoes = "" } = dadosCliente;

  return `Você é um engenheiro civil especializado em regularização de imóveis.

Analise os documentos e fotos fornecidos e gere um MEMORIAL DESCRITIVO TÉCNICO completo para regularização de imóvel.

INFORMAÇÕES DO PROJETO
- Endereço: ${endereco_obra || "Não informado"}
- Cidade: ${cidade || "Não informado"}
- Cliente: ${cliente_nome || "Não informado"}
- Observações: ${observacoes || "Nenhuma observação adicional"}

ARQUIVOS FORNECIDOS
${listaArquivos || "Nenhum arquivo fornecido"}

INSTRUÇÕES

1. ANÁLISE INICIAL
Identifique e descreva:
- Tipo de edificação (residencial, comercial, mista)
- Número de pavimentos
- Padrão construtivo (baixo, médio, alto)
- Estado de conservação
- Ano aproximado de construção (se identificável)

2. MEMORIAL DESCRITIVO
Elabore memorial técnico seguindo esta estrutura:

2.1 DADOS DO TERRENO
- Área do terreno (m²)
- Dimensões aproximadas (frente x fundo)
- Topografia (plano, aclive, declive)
- Confrontações

2.2 CARACTERÍSTICAS DA EDIFICAÇÃO
Para CADA PAVIMENTO, descreva:

Térreo/Pavimento Inferior:
- Ambientes identificados (sala, cozinha, quartos, banheiros, etc.)
- Área de cada ambiente (estimada)
- Pé-direito médio
- Área construída total do pavimento

Pavimento Superior (se houver):
- Mesma estrutura acima

Área externa (se houver):
- Garagem/estacionamento
- Área de serviço
- Quintal
- Outros

2.3 ESPECIFICAÇÕES TÉCNICAS

Descreva os sistemas construtivos identificados:

Fundações:
- Tipo provável (sapata, radier, etc.)
- Observações

Estrutura:
- Tipo (alvenaria estrutural, concreto armado, etc.)
- Elementos estruturais visíveis

Vedações:
- Material das paredes (tijolo cerâmico, bloco de concreto, etc.)
- Espessura aproximada
- Revestimentos internos
- Revestimentos externos

Cobertura:
- Tipo de telhado (uma água, duas águas, etc.)
- Material (telha cerâmica, fibrocimento, laje, etc.)
- Estrutura do telhado

Esquadrias:
- Portas: material e tipo predominante
- Janelas: material e tipo predominante

Pisos:
- Interno: material predominante por ambiente
- Externo: material utilizado

Instalações Elétricas:
- Padrão de entrada identificado
- Distribuição de pontos (aparente/embutida)
- Quadro de distribuição

Instalações Hidrossanitárias:
- Tipo de abastecimento (rede pública, poço)
- Pontos de água identificados
- Sistema de esgoto (rede pública, fossa)
- Reservatório (se houver)

Instalações Complementares:
- Gás (se houver)
- Telefone/internet
- Outros

2.4 CÁLCULO DE ÁREAS

Apresente tabela formatada:

Pavimento/Ambiente | Área (m²)
Térreo - Sala | XX.XX
Térreo - Cozinha | XX.XX
... | ...
ÁREA TOTAL CONSTRUÍDA | XXX.XX
Área do Terreno | XXX.XX
Taxa de Ocupação | XX%

2.5 CONFORMIDADE URBANÍSTICA

Verifique (baseado nas informações de ${cidade || "a cidade informada"}):

- Taxa de ocupação calculada vs permitida
- Recuos (frontal, lateral, fundos) - informar se conformes
- Número de pavimentos vs gabarito permitido
- Coeficiente de aproveitamento
- Uso do solo (residencial/comercial vs zoneamento)

IMPORTANTE: Se não tiver dados do código de obras de ${cidade || "a cidade"}, INDIQUE CLARAMENTE que a verificação deve ser feita junto ao órgão competente.

2.6 OBSERVAÇÕES TÉCNICAS

- Patologias identificadas (se houver)
- Não conformidades aparentes
- Recomendações para adequação
- Melhorias sugeridas

3. RESPONSABILIDADE TÉCNICA

Inclua ao final:

RESPONSABILIDADE TÉCNICA:

O presente memorial descritivo foi elaborado com base em análise de plantas e fotografias fornecidas.

Recomenda-se vistoria técnica presencial para confirmação das informações aqui descritas.

Engenheiro(a) Responsável: [A PREENCHER]

CREA: [A PREENCHER]

ART: [A PREENCHER após emissão]

4. FORMATO DE SAÍDA

- Use linguagem técnica mas clara
- Seja preciso nos números (sempre 2 casas decimais para áreas)
- Use tabelas para melhor visualização
- Destaque não conformidades em texto simples (sem formatação markdown)
- NÃO use markdown (#, **, *, etc.) no texto do memorial
- Mantenha formatação profissional em texto puro

5. SE INFORMAÇÕES FALTAREM

Se não conseguir identificar alguma informação pelos arquivos:

- Indique claramente como "NÃO IDENTIFICÁVEL PELAS IMAGENS"
- Sugira vistoria técnica presencial
- NÃO invente dados

Gere o memorial descritivo agora. Retorne em formato JSON com:
- area_total: número (área do terreno em m²)
- area_construida: número (área construída total em m²)
- recuos: objeto com {frontal, lateral_esquerda, lateral_direita, fundos} em metros
- memorial: string (memorial descritivo completo em TEXTO PURO, SEM markdown, SEM #, SEM **, SEM formatação markdown)
- taxa_ocupacao: número (percentual)
- pavimentos: número (quantidade de pavimentos identificados)
- tipo_edificacao: string (residencial/comercial/mista)
- conformidade: objeto com {conforme: boolean, observacoes: string}

IMPORTANTE: 
- Retorne APENAS um JSON válido, sem markdown code blocks, sem explicações adicionais
- O campo "memorial" deve conter TEXTO PURO, sem símbolos markdown (#, **, *, etc.)
- Use apenas quebras de linha e espaçamento para formatação`;
}

/**
 * Gera prompt detalhado para Orçamento e Quantitativos
 */
export function gerarPromptOrcamento(
  listaArquivos: string,
  dadosCliente: DadosCliente
): string {
  const { cliente_nome = "", cidade = "", observacoes = "" } = dadosCliente;

  return `Você é um engenheiro civil especialista em orçamentos e quantitativos de obras.

Analise as plantas e documentos fornecidos e gere um ORÇAMENTO COMPLETO com quantitativos detalhados.

INFORMAÇÕES DO PROJETO
- Cliente: ${cliente_nome || "Não informado"}
- Cidade: ${cidade || "Não informado"}
- Observações: ${observacoes || "Nenhuma observação adicional"}

ARQUIVOS FORNECIDOS
${listaArquivos || "Nenhum arquivo fornecido"}

INSTRUÇÕES

1. LEVANTAMENTO DE QUANTITATIVOS

Para cada item de obra, calcule:

1.1 SERVIÇOS PRELIMINARES
- Limpeza e preparo do terreno
- Locação da obra
- Instalações provisórias

1.2 FUNDAÇÕES
- Escavação manual/mecânica (m³)
- Concreto de fundação (m³)
- Formas de fundação (m²)
- Armadura de fundação (kg)
- Bloco de concreto estrutural (m³)

1.3 ESTRUTURA
- Concreto estrutural (m³) - lajes, vigas, pilares
- Armadura estrutural (kg) - CA-50
- Formas estruturais (m²)
- Alvenaria estrutural (m²)

1.4 VEDAÇÕES
- Alvenaria de vedação (m²)
- Blocos cerâmicos ou de concreto (un)
- Argamassa de assentamento (m³)
- Argamassa de revestimento (m²)

1.5 COBERTURA
- Estrutura de telhado (m²)
- Telhas cerâmicas (un) - considerar 24 telhas/m² com inclinação
- Madeiramento (m³)
- Impermeabilização (m²)

1.6 INSTALAÇÕES
- Instalações elétricas (pontos)
- Instalações hidrossanitárias (pontos)
- Instalações de gás (se houver)

1.7 REVESTIMENTOS
- Revestimento interno (m²)
- Revestimento externo (m²)
- Pisos (m²)
- Azulejos/cerâmicas (m²)

1.8 ESQUADRIAS
- Portas (un)
- Janelas (un)
- Portões (un)

1.9 PINTURA
- Pintura interna (m²)
- Pintura externa (m²)

2. CÁLCULOS DE REFERÊNCIA

Use os seguintes ratios de engenharia:

Concreto de Fundação:
- Espessura média: 12cm
- Fórmula: área_construida * 0.12 (m³)

Aço CA-50:
- Média para residencial: 8 kg/m² de área construída
- Fórmula: area_construida * 8 (kg)

Blocos Cerâmicos:
- 13 blocos/m² de parede (considerando vãos)
- Fórmula: (perimetro_paredes * pe_direito - area_vãos) * 13 (un)

Telhas Cerâmicas:
- 24 telhas/m² de cobertura
- Considerar inclinação: área_cobertura * 1.20 * 24 (un)

Pontos Elétricos:
- Média: (numero_comodos * 4) + (area_construida / 10) (un)

Pontos Hidráulicos:
- Média: (banheiros * 8) + (cozinha * 5) (un)

3. PREÇOS DE REFERÊNCIA

Consulte valores atualizados do CUB-MG para ${cidade || "a região"} ou use valores de referência do mercado local.

4. FORMATO DE SAÍDA

Retorne em formato JSON com:

- quantidade_aco: número (kg de aço CA-50)
- quantidade_concreto: número (m³ de concreto)
- quantidade_blocos: número (unidades de blocos)
- quantidade_telhas: número (unidades de telhas)
- quantidade_portas: número (unidades)
- quantidade_janelas: número (unidades)
- pontos_eletricos: número (quantidade de pontos)
- pontos_hidraulicos: número (quantidade de pontos)
- area_construida: número (m²)
- valor_total: número (R$ - valor total estimado)
- detalhamento: string (texto completo do orçamento em TEXTO PURO, SEM markdown, SEM #, SEM **, SEM formatação markdown)
- quantitativos: array de objetos com {item, unidade, quantidade, preco_unitario, total}
- cronograma: array de objetos com {mes, etapa, valor, acumulado}

IMPORTANTE: 
- Retorne APENAS um JSON válido, sem markdown code blocks, sem explicações adicionais
- O campo "detalhamento" deve conter TEXTO PURO, sem símbolos markdown (#, **, *, etc.)
- Use apenas quebras de linha e espaçamento para formatação`;
}

/**
 * Gera prompt para Plantas Complementares (Elétrica)
 */
export function gerarPromptPlantaEletrica(
  listaArquivos: string,
  dadosCliente: DadosCliente
): string {
  const { cliente_nome = "", cidade = "", observacoes = "" } = dadosCliente;

  return `Você é um engenheiro eletricista especializado em projetos elétricos residenciais/comerciais.

Analise a planta arquitetônica fornecida e elabore um PROJETO ELÉTRICO COMPLETO com memorial de cálculo.

INFORMAÇÕES DO PROJETO
- Cliente: ${cliente_nome || "Não informado"}
- Cidade: ${cidade || "Não informado"}
- Tipo de Planta: Elétrica
- Observações: ${observacoes || "Nenhuma observação adicional"}

PLANTA ARQUITETÔNICA
${listaArquivos || "Nenhum arquivo fornecido"}

INSTRUÇÕES

1. LEVANTAMENTO DE CARGAS

Para cada ambiente identificado na planta, determine:

1.1 Iluminação
- Potência por ambiente: Usar NBR 5410
- Mínimo: 100 VA para primeiros 6m², + 60 VA para cada 4m² adicionais
- Considerar pé-direito e tipo de ambiente
- Número de pontos: Mínimo 1 por cômodo
- Tipo de lâmpada: LED (considerar 10W/m² como referência)

1.2 Tomadas de Uso Geral (TUGs)
- Quantidade por ambiente:
  - Sala/dormitórios: 1 tomada para cada 5m (perímetro), mínimo 1 por parede
  - Cozinha: 1 tomada para cada 3,5m (perímetro), mínimo 3
  - Banheiro: 1 tomada próxima ao lavatório (0,6m altura)
  - Áreas externas: mínimo 1
- Potência:
  - Cozinha/copa: mínimo 600 VA por tomada (3 primeiras), 100 VA demais
  - Demais: 100 VA por tomada

1.3 Tomadas de Uso Específico (TUEs)
Identificar e especificar:
- Chuveiro elétrico (potência: 5500W típico)
- Torneira elétrica (potência: 3500-5500W)
- Ar-condicionado (calcular BTUs por m²)
- Forno elétrico (potência: 1500-3000W)
- Máquina de lavar (potência: 500-1500W)
- Outros equipamentos especificados

2. DIVISÃO DE CIRCUITOS

2.1 Critérios de Divisão
- Iluminação: máximo 10 pontos por circuito ou 1200 VA
- TUGs: máximo 10 tomadas ou 2200 VA
- TUEs: circuito exclusivo por equipamento (potência > 1500W)
- Separar: iluminação, TUGs, TUEs

3. DIMENSIONAMENTO DO QUADRO DE DISTRIBUIÇÃO

3.1 Cálculo de Demanda
- Somar todas as cargas
- Aplicar fatores de demanda (NBR 5410)
- Calcular demanda total e corrente de projeto

4. FORMATO DE SAÍDA

Retorne em formato JSON com:
- cargas_por_ambiente: array de objetos com {ambiente, area, iluminacao_va, tug_quantidade, tug_va, tue_quantidade, tue_va, total_va}
- circuitos: array de objetos com {numero, tipo, ambientes, potencia_va, corrente_a, protecao_a, condutor_mm2}
- demanda_total: número (VA)
- corrente_projeto: número (A)
- quadro_distribuicao: objeto com especificações
- memorial_calculo: string (texto completo em TEXTO PURO, SEM markdown, SEM #, SEM **, SEM formatação markdown)

IMPORTANTE: 
- Retorne APENAS um JSON válido, sem markdown code blocks, sem explicações adicionais
- O campo "memorial_calculo" deve conter TEXTO PURO, sem símbolos markdown (#, **, *, etc.)
- Use apenas quebras de linha e espaçamento para formatação`;
}

/**
 * Gera prompt para Plantas Complementares (Hidráulica)
 */
export function gerarPromptPlantaHidraulica(
  listaArquivos: string,
  dadosCliente: DadosCliente
): string {
  const { cliente_nome = "", cidade = "", observacoes = "" } = dadosCliente;

  return `Você é um engenheiro especializado em projetos hidrossanitários.

Analise a planta arquitetônica fornecida e elabore um PROJETO HIDROSSANITÁRIO COMPLETO.

INFORMAÇÕES DO PROJETO
- Cliente: ${cliente_nome || "Não informado"}
- Cidade: ${cidade || "Não informado"}
- Tipo de Planta: Hidráulica
- Observações: ${observacoes || "Nenhuma observação adicional"}

PLANTA ARQUITETÔNICA
${listaArquivos || "Nenhum arquivo fornecido"}

INSTRUÇÕES

1. LEVANTAMENTO DE PONTOS HIDRÁULICOS

Para cada ambiente, identifique:
- Pontos de água fria
- Pontos de água quente
- Pontos de esgoto
- Pontos de águas pluviais

2. DIMENSIONAMENTO

- Diâmetros de tubulações
- Pressões necessárias
- Capacidade de reservatórios
- Sistema de aquecimento (se houver)

3. FORMATO DE SAÍDA

Retorne em formato JSON com:
- pontos_agua_fria: array de objetos com {ambiente, quantidade, tipo}
- pontos_agua_quente: array de objetos com {ambiente, quantidade, tipo}
- pontos_esgoto: array de objetos com {ambiente, quantidade, tipo}
- pontos_pluviais: array de objetos com {quantidade, tipo}
- reservatorio_capacidade: número (litros)
- memorial_calculo: string (texto completo em TEXTO PURO, SEM markdown, SEM #, SEM **, SEM formatação markdown)

IMPORTANTE: 
- Retorne APENAS um JSON válido, sem markdown code blocks, sem explicações adicionais
- O campo "memorial_calculo" deve conter TEXTO PURO, sem símbolos markdown (#, **, *, etc.)
- Use apenas quebras de linha e espaçamento para formatação`;
}

/**
 * Gera prompt para Laudos Técnicos
 */
export function gerarPromptLaudo(
  listaArquivos: string,
  dadosCliente: DadosCliente
): string {
  const { cliente_nome = "", endereco_obra = "", cidade = "", observacoes = "" } = dadosCliente;

  return `Você é um engenheiro civil especializado em laudos técnicos.

Analise os documentos e informações fornecidos e elabore um LAUDO TÉCNICO completo.

INFORMAÇÕES DO PROJETO
- Cliente: ${cliente_nome || "Não informado"}
- Endereço: ${endereco_obra || "Não informado"}
- Cidade: ${cidade || "Não informado"}
- Observações: ${observacoes || "Nenhuma observação adicional"}

DOCUMENTOS FORNECIDOS
${listaArquivos || "Nenhum arquivo fornecido"}

INSTRUÇÕES

1. ESTRUTURA DO LAUDO

- Objetivo do laudo
- Metodologia utilizada
- Análise técnica detalhada
- Conclusões e recomendações

2. FORMATO DE SAÍDA

Retorne em formato JSON com:
- objetivo: string (texto puro, sem markdown)
- metodologia: string (texto puro, sem markdown)
- analise: string (análise técnica completa em TEXTO PURO, SEM markdown, SEM #, SEM **, SEM formatação markdown)
- conclusoes: string (texto puro, sem markdown)
- recomendacoes: string (texto puro, sem markdown)
- laudo_completo: string (texto completo em TEXTO PURO, SEM markdown, SEM #, SEM **, SEM formatação markdown)

IMPORTANTE: 
- Retorne APENAS um JSON válido, sem markdown code blocks, sem explicações adicionais
- Todos os campos de texto devem conter TEXTO PURO, sem símbolos markdown (#, **, *, etc.)
- Use apenas quebras de linha e espaçamento para formatação`;
}

/**
 * Gera prompt para Conformidade Urbanística
 */
export function gerarPromptConformidade(
  listaArquivos: string,
  dadosCliente: DadosCliente
): string {
  const { cliente_nome = "", endereco_obra = "", cidade = "", observacoes = "" } = dadosCliente;

  return `Você é um engenheiro civil especializado em conformidade urbanística.

Analise os documentos e verifique a CONFORMIDADE URBANÍSTICA do imóvel/projeto.

INFORMAÇÕES DO PROJETO
- Cliente: ${cliente_nome || "Não informado"}
- Endereço: ${endereco_obra || "Não informado"}
- Cidade: ${cidade || "Não informado"}
- Observações: ${observacoes || "Nenhuma observação adicional"}

DOCUMENTOS FORNECIDOS
${listaArquivos || "Nenhum arquivo fornecido"}

INSTRUÇÕES

1. VERIFICAÇÕES NECESSÁRIAS

- Taxa de ocupação
- Recuos obrigatórios
- Gabarito máximo
- Coeficiente de aproveitamento
- Uso do solo
- Área permeável mínima
- Vagas de estacionamento

2. FORMATO DE SAÍDA

Retorne em formato JSON com:
- taxa_ocupacao: objeto com {calculada, permitida, conforme}
- recuos: objeto com {frontal, lateral_esquerda, lateral_direita, fundos, conforme}
- gabarito: objeto com {numero_pavimentos, maximo_permitido, conforme}
- coeficiente_aproveitamento: objeto com {calculado, maximo_permitido, conforme}
- uso_solo: objeto com {uso_atual, uso_permitido, conforme}
- area_permeavel: objeto com {calculada, minima_obrigatoria, conforme}
- vagas_estacionamento: objeto com {calculadas, obrigatorias, conforme}
- conformidade_geral: boolean
- observacoes: string (texto puro, sem markdown)
- relatorio_completo: string (texto completo em TEXTO PURO, SEM markdown, SEM #, SEM **, SEM formatação markdown)

IMPORTANTE: 
- Retorne APENAS um JSON válido, sem markdown code blocks, sem explicações adicionais
- Os campos de texto (observacoes, relatorio_completo) devem conter TEXTO PURO, sem símbolos markdown (#, **, *, etc.)
- Use apenas quebras de linha e espaçamento para formatação`;
}
