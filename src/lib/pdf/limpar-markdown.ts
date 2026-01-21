/**
 * Remove formatação markdown de textos para uso em PDFs
 */
export function limparMarkdown(texto: string): string {
  if (!texto) return texto;
  
  return texto
    // Remover headers markdown (# ## ### ####)
    .replace(/^#{1,6}\s+/gm, '')
    // Remover negrito (**texto** ou __texto__)
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    // Remover itálico (*texto* ou _texto_)
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    // Remover links markdown [texto](url)
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // Remover listas markdown (- ou *)
    .replace(/^[\-\*\+]\s+/gm, '• ')
    // Remover código inline (`texto`)
    .replace(/`([^`]+)`/g, '$1')
    // Remover blocos de código
    .replace(/```[\s\S]*?```/g, '')
    // Limpar espaços múltiplos
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
