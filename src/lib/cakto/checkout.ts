/**
 * Cliente para integração com Cakto
 * Documentação: https://docs.cakto.com.br (ou URL da documentação real)
 */

const CAKTO_API_URL = process.env.NEXT_PUBLIC_CAKTO_API_URL || "https://api.cakto.com.br";
const CAKTO_PUBLIC_KEY = process.env.NEXT_PUBLIC_CAKTO_PUBLIC_KEY || "";

export interface CaktoProduct {
  id: string;
  name: string;
  price: number;
  plan_id: string; // Mapeia para plano do sistema (pro, enterprise)
}

export interface CaktoCheckoutOptions {
  email: string;
  name?: string;
  productId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, any>;
}

/**
 * Gerar URL de checkout da Cakto
 */
export function generateCheckoutUrl(options: CaktoCheckoutOptions): string {
  const {
    email,
    name,
    productId,
    successUrl,
    cancelUrl,
    metadata = {},
  } = options;

  // Construir URL de checkout
  const params = new URLSearchParams({
    email,
    product_id: productId,
    success_url: successUrl,
    cancel_url: cancelUrl,
    ...(name && { name }),
    ...(Object.keys(metadata).length > 0 && { metadata: JSON.stringify(metadata) }),
  });

  return `${CAKTO_API_URL}/checkout?${params.toString()}`;
}

/**
 * Mapear planos do sistema para produtos da Cakto
 */
export const PLANO_TO_CAKTO_PRODUCT: Record<string, string> = {
  pro: process.env.NEXT_PUBLIC_CAKTO_PRODUCT_PRO || "produto-pro-id",
  enterprise: process.env.NEXT_PUBLIC_CAKTO_PRODUCT_ENTERPRISE || "produto-enterprise-id",
};

/**
 * Obter URL de checkout para um plano específico
 */
export function getCheckoutUrlForPlan(
  plano: "pro" | "enterprise",
  userEmail: string,
  userName?: string
): string {
  const productId = PLANO_TO_CAKTO_PRODUCT[plano];
  
  if (!productId) {
    throw new Error(`Produto Cakto não configurado para plano: ${plano}`);
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return generateCheckoutUrl({
    email: userEmail,
    name: userName,
    productId,
    successUrl: `${baseUrl}/configuracoes?status=success`,
    cancelUrl: `${baseUrl}/configuracoes?status=cancelled`,
    metadata: {
      plano,
      source: "civilai-pro",
    },
  });
}
