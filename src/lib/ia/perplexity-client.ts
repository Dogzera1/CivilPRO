/**
 * Cliente para API da Perplexity (DEPRECADO - Usando Claude agora)
 * Este arquivo mantém compatibilidade, mas redireciona para Claude
 * Documentação: https://docs.perplexity.ai/
 */

// Re-exportar funções do Claude para manter compatibilidade
export {
  analisarPlantaRegularizacao,
  gerarOrcamento,
  gerarPlantaEletrica,
  gerarPlantaHidraulica,
  gerarLaudo,
  verificarConformidade,
} from "./claude-client";
