# 💳 Guia de Configuração - Cakto

## 📋 Passo a Passo para Configurar a Cakto

### 1. Criar Conta na Cakto

1. Acesse o site da Cakto
2. Crie sua conta de vendedor
3. Complete o cadastro e verificação

### 2. Criar Produtos na Cakto

#### Produto "Pro" (R$ 49/mês)
- Nome: "CivilAI Pro - Plano Pro"
- Preço: R$ 49,00
- Tipo: Assinatura mensal
- Anote o **ID do Produto** gerado

#### Produto "Enterprise" (R$ 99/mês)
- Nome: "CivilAI Pro - Plano Enterprise"
- Preço: R$ 99,00
- Tipo: Assinatura mensal
- Anote o **ID do Produto** gerado

### 3. Configurar Webhook

**⚠️ IMPORTANTE:** A Cakto não aceita URLs `localhost`. Você precisa usar uma URL pública.

#### ✅ Recomendado: Deploy no Vercel

A forma mais simples e recomendada é fazer deploy no Vercel:

1. **Faça deploy no Vercel** (veja `DEPLOY-VERCEL.md` para instruções completas)
2. **Obtenha sua URL:** `https://civilai-pro.vercel.app` (ou seu domínio)
3. **Configure na Cakto:**

   Na dashboard da Cakto, vá em **Configurações > Webhooks**
   - **URL:** `https://civilai-pro.vercel.app/api/webhooks/cakto`
   - **Eventos:** Selecione todos os eventos de pagamento
   - **Secret:** Gere um secret seguro e anote
   - **Status:** Ativo

#### Para Desenvolvimento Local (Alternativa):

Se precisar testar localmente antes do deploy:

**Opção 1: Usar ngrok**
```bash
# Instalar ngrok
# Baixe em: https://ngrok.com/download

# Expor porta local
ngrok http 3000

# Você receberá uma URL como: https://abc123.ngrok.io
# Use essa URL na configuração da Cakto
```

**Opção 2: Usar Cloudflare Tunnel**
```bash
# Instalar cloudflared
cloudflared tunnel --url http://localhost:3000
```

**⚠️ Nota:** Para desenvolvimento, recomendamos usar o Vercel com preview deployments, que são mais estáveis que ngrok.

### 4. Configurar Variáveis de Ambiente

#### No Vercel (Produção):

Vá em **Settings > Environment Variables** e adicione:

```env
# Cakto
NEXT_PUBLIC_CAKTO_CHECKOUT_URL=https://pay.cakto.com.br
NEXT_PUBLIC_CAKTO_API_URL=https://api.cakto.com.br
NEXT_PUBLIC_CAKTO_PUBLIC_KEY=sua-chave-publica-aqui
CAKTO_WEBHOOK_SECRET=seu-secret-webhook-aqui
NEXT_PUBLIC_CAKTO_PRODUCT_PRO=id-produto-pro-anotado
NEXT_PUBLIC_CAKTO_PRODUCT_ENTERPRISE=id-produto-enterprise-anotado
NEXT_PUBLIC_APP_URL=https://civilai-pro.vercel.app
```

**⚠️ IMPORTANTE:** 
- Marque todas como **Production, Preview e Development**
- A URL será `https://civilai-pro.vercel.app` (ou seu domínio personalizado)

#### Localmente (`.env.local`):

```env
# Cakto
NEXT_PUBLIC_CAKTO_CHECKOUT_URL=https://pay.cakto.com.br
NEXT_PUBLIC_CAKTO_API_URL=https://api.cakto.com.br
NEXT_PUBLIC_CAKTO_PUBLIC_KEY=sua-chave-publica-aqui
CAKTO_WEBHOOK_SECRET=seu-secret-webhook-aqui
NEXT_PUBLIC_CAKTO_PRODUCT_PRO=id-produto-pro-anotado
NEXT_PUBLIC_CAKTO_PRODUCT_ENTERPRISE=id-produto-enterprise-anotado

# Para desenvolvimento local com ngrok (se necessário)
NEXT_PUBLIC_APP_URL=https://abc123.ngrok.io
```

### 5. Configurar URLs de Retorno

Na configuração de cada produto na Cakto:

**URL de Sucesso:**
```
https://civilai-pro.vercel.app/checkout/success
```

**URL de Cancelamento:**
```
https://civilai-pro.vercel.app/checkout/cancel
```

**Página de Vendas:**
```
https://civilai-pro.vercel.app/vendas
```

**⚠️ Substitua `civilai-pro.vercel.app` pela sua URL real do Vercel ou domínio personalizado.**

### 6. Testar Integração

1. **Teste Local (usando ngrok ou similar):**
   ```bash
   # Instalar ngrok
   npm install -g ngrok
   
   # Expor porta local
   ngrok http 3000
   
   # Use a URL do ngrok no webhook da Cakto temporariamente
   ```

2. **Teste de Pagamento:**
   - Acesse `/configuracoes`
   - Clique em "Assinar Agora" em um plano
   - Complete o checkout na Cakto
   - Verifique se o plano foi atualizado

3. **Verificar Webhook:**
   - Veja os logs do servidor
   - Verifique se o webhook foi recebido
   - Confirme se o plano foi atualizado no banco

## 🔍 Estrutura de Dados Esperada do Webhook

A Cakto deve enviar dados no seguinte formato (ajuste conforme documentação real):

```json
{
  "event": "payment.approved",
  "customer_email": "usuario@email.com",
  "plan_id": "id-do-produto",
  "product_id": "id-do-produto",
  "amount": 49.00,
  "transaction_id": "tx_123456",
  "metadata": {
    "plano": "pro",
    "source": "civilai-pro"
  }
}
```

## 🐛 Troubleshooting

### Webhook não recebe notificações
- Verifique se a URL está correta e acessível
- Verifique se o middleware permite acesso à rota
- Use ngrok para testar localmente
- Verifique logs da Cakto para ver se está enviando

### Plano não atualiza após pagamento
- Verifique logs do servidor (`[Cakto Webhook]`)
- Confirme se o email do pagamento corresponde ao email do usuário
- Verifique se `SUPABASE_SERVICE_ROLE_KEY` está configurada
- Verifique se o mapeamento de `plan_id` está correto

### Erro de assinatura inválida
- Confirme se `CAKTO_WEBHOOK_SECRET` está correto
- Verifique se a Cakto está enviando o header `x-cakto-signature`
- Ajuste o algoritmo de verificação se necessário

## 📝 Notas Importantes

- O webhook usa `SUPABASE_SERVICE_ROLE_KEY` para atualizar planos (ignora RLS)
- A atualização do plano é automática após confirmação do pagamento
- O sistema aguarda alguns segundos após redirecionamento para webhook processar
- Mantenha o `CAKTO_WEBHOOK_SECRET` seguro e nunca o exponha no cliente

---

**✅ Configure as variáveis de ambiente e teste a integração!**
