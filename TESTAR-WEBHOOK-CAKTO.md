# 🧪 Como Testar o Webhook da Cakto

## ✅ O que você está vendo é normal!

Quando você acessa `https://seu-projeto.vercel.app/api/webhooks/cakto` no navegador, você está fazendo uma requisição **GET**, mas o webhook espera requisições **POST** da Cakto.

## 🔍 Verificar se o Webhook Está Funcionando

### Opção 1: Verificar Resposta JSON

1. **Acesse:** `https://seu-projeto.vercel.app/api/webhooks/cakto`
2. **Deve retornar:** Um JSON com a mensagem de que o webhook está ativo

### Opção 2: Testar com cURL (Terminal)

```bash
curl -X POST https://seu-projeto.vercel.app/api/webhooks/cakto \
  -H "Content-Type: application/json" \
  -H "x-cakto-signature: teste" \
  -d '{"event":"payment.approved","customer_email":"teste@email.com","product_id":"fpwpcyj_734166"}'
```

### Opção 3: Verificar Logs no Vercel

1. **Acesse:** Vercel > Deployments > [último deploy] > Functions
2. **Procure por:** `/api/webhooks/cakto`
3. **Veja os logs** para verificar se está recebendo requisições

## 📋 Configurar Webhook na Cakto

1. **Dashboard Cakto > Configurações > Webhooks**
2. **Adicione:**
   ```
   URL: https://seu-projeto.vercel.app/api/webhooks/cakto
   Secret: VqZhdTl5APQBiJAI6Z9XWIJELeXdSd6Gjpd6BHgWouW5xsA70W8LNfkDo5EzwPESILsX2E8mry74d5dyGNJoinoOfGm8Ayeu5glWtynqCTOqjkFZZwJfrPmLLTxNTPg5
   Eventos: payment.approved, payment.cancelled, subscription.created, etc.
   Status: Ativo
   ```

## ✅ Como Saber se Está Funcionando

### Teste Real:

1. **Faça um pagamento de teste** na Cakto
2. **Verifique os logs** no Vercel:
   - Vercel > Deployments > Functions > `/api/webhooks/cakto`
   - Deve aparecer: `[Cakto Webhook] Evento recebido: payment.approved`
3. **Verifique se o plano foi atualizado:**
   - Acesse `/configuracoes` no seu site
   - O plano deve ter mudado de "free" para "pro" ou "enterprise"

## 🆘 Se Não Funcionar

1. **Verifique se o webhook está configurado na Cakto**
2. **Verifique os logs no Vercel** para ver erros
3. **Confirme que as variáveis de ambiente estão configuradas:**
   - `CAKTO_WEBHOOK_SECRET`
   - `SUPABASE_SERVICE_ROLE_KEY`

---

**💡 O formulário HTML que você vê é normal - o webhook funciona quando a Cakto envia POST!**
