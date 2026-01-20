/**
 * Centralizado de tratamento de erros
 * Fornece mensagens amigáveis para diferentes tipos de erro
 */

export interface AppError {
  code: string;
  message: string;
  userMessage: string;
  statusCode?: number;
}

export class ErrorHandler {
  static handle(error: any): AppError {
    // Erro do Supabase
    if (error?.code?.startsWith("PGRST") || error?.code?.startsWith("235")) {
      return {
        code: error.code,
        message: error.message,
        userMessage: this.getSupabaseErrorMessage(error),
        statusCode: 400,
      };
    }

    // Erro de autenticação
    if (error?.message?.includes("JWT") || error?.message?.includes("session")) {
      return {
        code: "AUTH_ERROR",
        message: error.message,
        userMessage: "Sua sessão expirou. Por favor, faça login novamente.",
        statusCode: 401,
      };
    }

    // Erro de rede
    if (error?.message?.includes("fetch") || error?.message?.includes("network")) {
      return {
        code: "NETWORK_ERROR",
        message: error.message,
        userMessage: "Erro de conexão. Verifique sua internet e tente novamente.",
        statusCode: 0,
      };
    }

    // Erro da API Perplexity
    if (error?.message?.includes("Perplexity")) {
      return {
        code: "PERPLEXITY_ERROR",
        message: error.message,
        userMessage: "Erro ao processar com IA. Tente novamente em alguns instantes.",
        statusCode: 500,
      };
    }

    // Erro genérico
    return {
      code: "UNKNOWN_ERROR",
      message: error?.message || String(error),
      userMessage: "Ocorreu um erro inesperado. Tente novamente.",
      statusCode: 500,
    };
  }

  private static getSupabaseErrorMessage(error: any): string {
    const code = error.code;

    // Erros de constraint
    if (code === "23505") {
      return "Este registro já existe no sistema.";
    }
    if (code === "23503") {
      return "Erro de referência. Verifique os dados informados.";
    }
    if (code === "23502") {
      return "Campos obrigatórios não foram preenchidos.";
    }

    // Erros de RLS
    if (code?.startsWith("PGRST")) {
      return "Você não tem permissão para realizar esta ação.";
    }

    // Erro genérico do Supabase
    return error.message || "Erro ao processar solicitação.";
  }

  static logError(error: AppError, context?: string) {
    if (process.env.NODE_ENV === "development") {
      console.error(`[${context || "Error"}]`, {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
      });
    }
    // Em produção, enviar para serviço de logging (Sentry, etc)
  }
}
