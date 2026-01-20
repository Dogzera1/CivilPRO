import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const CAKTO_WEBHOOK_SECRET = process.env.CAKTO_WEBHOOK_SECRET || "";

/**
 * Webhook da Cakto para processar pagamentos
 * 
 * A Cakto enviará notificações quando:
 * - Pagamento aprovado
 * - Assinatura criada/renovada
 * - Pagamento cancelado/falhado
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-cakto-signature") || "";

    // Verificar assinatura do webhook (segurança)
    if (CAKTO_WEBHOOK_SECRET) {
      const expectedSignature = crypto
        .createHmac("sha256", CAKTO_WEBHOOK_SECRET)
        .update(body)
        .digest("hex");

      if (signature !== expectedSignature) {
        console.error("[Cakto Webhook] Assinatura inválida");
        return NextResponse.json(
          { error: "Assinatura inválida" },
          { status: 401 }
        );
      }
    }

    const data = JSON.parse(body);
    console.log("[Cakto Webhook] Evento recebido:", data.event, data);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Mapear eventos da Cakto
    switch (data.event) {
      case "payment.approved":
      case "subscription.created":
      case "subscription.renewed":
        await handlePaymentApproved(data, supabase);
        break;

      case "payment.cancelled":
      case "subscription.cancelled":
        await handlePaymentCancelled(data, supabase);
        break;

      case "payment.failed":
        await handlePaymentFailed(data, supabase);
        break;

      default:
        console.log("[Cakto Webhook] Evento não tratado:", data.event);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("[Cakto Webhook] Erro:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}

/**
 * Processar pagamento aprovado
 */
async function handlePaymentApproved(data: any, supabase: any) {
  // A estrutura dos dados pode variar - ajuste conforme a documentação da Cakto
  const customer_email = data.customer_email || data.email || data.customer?.email;
  const plan_id = data.plan_id || data.product_id || data.metadata?.plano;
  const amount = data.amount || data.value;
  const transaction_id = data.transaction_id || data.id;

  console.log("[Cakto] Pagamento aprovado:", { customer_email, plan_id, amount, transaction_id });

  if (!customer_email) {
    console.error("[Cakto] Email do cliente não encontrado nos dados");
    return;
  }

  // Mapear plan_id da Cakto para plano do sistema
  // Se plan_id for o ID do produto, use os IDs configurados nas variáveis de ambiente
  const planoMap: Record<string, string> = {
    [process.env.NEXT_PUBLIC_CAKTO_PRODUCT_PRO || "pro"]: "pro",
    [process.env.NEXT_PUBLIC_CAKTO_PRODUCT_ENTERPRISE || "enterprise"]: "enterprise",
    "pro": "pro",
    "enterprise": "enterprise",
  };

  const plano = planoMap[plan_id] || planoMap[data.metadata?.plano] || "pro";

  // Buscar usuário pelo email
  const { data: user } = await supabase
    .from("users")
    .select("id, email")
    .eq("email", customer_email)
    .single();

  if (!user) {
    console.error("[Cakto] Usuário não encontrado:", customer_email);
    return;
  }

  // Atualizar plano do usuário
  const { error: updateError } = await supabase
    .from("users")
    .update({
      plano,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (updateError) {
    console.error("[Cakto] Erro ao atualizar plano:", updateError);
    throw updateError;
  }

  // Registrar pagamento no histórico (se tabela existir)
  try {
    await supabase
      .from("pagamentos")
      .insert({
        user_id: user.id,
        plano,
        valor: amount || 0,
        transaction_id,
        status: "aprovado",
        provider: "cakto",
        metadata: {
          plan_id,
          customer_email,
          ...data,
        },
      })
      .then(({ error }: { error: any }) => {
        if (error && !error.message?.includes("does not exist")) {
          console.error("[Cakto] Erro ao registrar pagamento:", error);
        }
      });
  } catch (e) {
    // Tabela pode não existir ainda - não é crítico
    console.log("[Cakto] Tabela de pagamentos não encontrada (opcional)");
  }

  console.log("[Cakto] Plano atualizado com sucesso:", { userId: user.id, plano });
}

/**
 * Processar pagamento cancelado
 */
async function handlePaymentCancelled(data: any, supabase: any) {
  const { customer_email } = data;

  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("email", customer_email)
    .single();

  if (user) {
    // Reverter para plano free
    await supabase
      .from("users")
      .update({
        plano: "free",
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    console.log("[Cakto] Plano revertido para free:", user.id);
  }
}

/**
 * Processar pagamento falhado
 */
async function handlePaymentFailed(data: any, supabase: any) {
  console.log("[Cakto] Pagamento falhou:", data);
  // Você pode enviar notificação por email aqui
}

// Permitir apenas POST
// GET retorna informação sobre o webhook (útil para testes)
export async function GET() {
  return NextResponse.json(
    { 
      message: "Webhook da Cakto está ativo",
      method: "Este endpoint aceita apenas requisições POST",
      status: "Aguardando eventos da Cakto"
    },
    { status: 200 }
  );
}
