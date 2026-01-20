export type TipoProcesso = 
  | "regularizacao" 
  | "orcamento" 
  | "planta_complementar" 
  | "laudo" 
  | "conformidade";

export type StatusProcesso = 
  | "pendente" 
  | "processando" 
  | "concluido" 
  | "erro" 
  | "protocolado" 
  | "aprovado";

export interface Processo {
  id: string;
  user_id: string;
  tipo: TipoProcesso;
  status: StatusProcesso;
  cliente_nome?: string;
  cliente_email?: string;
  cliente_telefone?: string;
  endereco_obra?: string;
  cidade?: string;
  arquivos_upload?: string[]; // URLs dos arquivos
  resultado_pdf?: string; // URL do PDF gerado
  resultado_excel?: string; // URL do Excel gerado (se aplicável)
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  crea_numero?: string;
  nome_completo?: string;
  cidade?: string;
  especialidades?: string[];
  plano: "free" | "pro" | "enterprise";
  processos_mes_atual: number;
  created_at: string;
}

export interface ProcessamentoResult {
  sucesso: boolean;
  mensagem?: string;
  pdf_url?: string;
  excel_url?: string;
  dados_extrados?: Record<string, any>;
}

// Aliases para compatibilidade (deprecated - usar Processo)
export type JobType = TipoProcesso;
export type JobStatus = StatusProcesso;
export type Job = Processo;


