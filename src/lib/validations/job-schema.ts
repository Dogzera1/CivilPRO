import { z } from "zod";

export const jobFormSchema = z.object({
  cliente_nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").optional(),
  cliente_email: z.string().email("Email inválido").optional().or(z.literal("")),
  cliente_telefone: z.string().optional(),
  endereco_obra: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres").optional(),
  cidade: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres").optional(),
  observacoes: z.string().max(1000, "Observações muito longas").optional(),
});

export const signupSchema = z.object({
  nome_completo: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  crea_numero: z.string().optional(),
  cidade: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type JobFormData = z.infer<typeof jobFormSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type LoginData = z.infer<typeof loginSchema>;
