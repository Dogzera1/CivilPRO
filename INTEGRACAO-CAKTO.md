# 💳 Integração com Cakto - Sistema de Pagamentos

## ✅ Status: IMPLEMENTADO

O sistema agora está integrado com a **Cakto** para processamento de pagamentos e assinaturas!

## 🔧 O Que Foi Implementado

### 1. Webhook da Cakto (`src/app/api/webhooks/cakto/route.ts`)
- ✅ Endpoint para receber notificações da Cakto
- ✅ Verificação de assinatura (segurança)
- ✅ Processamento de eventos:
  - `payment.approved` - Pagamento aprovado
  - `subscription.created` - Assinatura criada
  - `subscription.renewed` - Assinatura renovada
  - `payment.cancelled` - Pagamento cancelado
  - `payment.failed` - Pagamento falhado
- ✅ Atualização automática de planos no banco

### 2. Cliente Cakto (`src/lib/cakto/checkout.ts`)
- ✅ Função para gerar URLs de checkout
- ✅ Mapeamento de planos para produtos Cakto
- ✅ Configuração de URLs de sucesso/cancelamento

### 3. Páginas de Checkout
- ✅ `/checkout/success` - Página de sucesso
- ✅ `/checkout/cancel` - Página de cancelamento

### 4. Integração na Página de Configurações
- ✅ Botões "Assinar Agora" funcionais
- ✅ Redirecionamento para checkout da Cakto
- ✅ Atualização automática após pagamento

## 📋 Configuração Necessária

### 1. Variáveis de Ambiente

Adicione no `.env.local`:

```env
# Cakto
NEXT_PUBLIC_CAKTO_API_URL=https://api.cakto.com.br
NEXT_PUBLIC_CAKTO_PUBLIC_KEY=sua-chave-publica-aqui
CAKTO_WEBHOOK_SECRET=seu-secret-do-webhook-aqui
NEXT_PUBLIC_CAKTO_PRODUCT_PRO=id-do-produto-pro
NEXT_PUBLIC_CAKTO_PRODUCT_ENTERPRISE=id-do-produto-enterprise
NEXT_PUBLIC_APP_URL=https://seu-dominio.com
```

### 2. Configuração na Cakto

1. **Criar Produtos:**
   - Produto "Pro" (R$ 49/mês)
   - Produto "Enterprise" (R$ 99/mês)

2. **Configurar Webhook:**
   - URL: `https://seu-dominio.com/api/webhooks/cakto`
   - Eventos: `payment.approved`, `subscription.created`, `subscription.renewed`, `payment.cancelled`, `payment.failed`
   - Secret: Configure e adicione em `CAKTO_WEBHOOK_SECRET`

3. **URLs de Retorno:**
   - Sucesso: `https://seu-dominio.com/checkout/success`
   - Cancelamento: `https://seu-dominio.com/checkout/cancel`

## 🔄 Fluxo de Pagamento

1. **Usuário clica em "Assinar Agora"**
   - Redirecionado para checkout da Cakto
   - Email e nome são enviados automaticamente

2. **Usuário completa pagamento na Cakto**
   - Cakto processa o pagamento
   - Redireciona para `/checkout/success`

3. **Webhook processa pagamento**
   - Cakto envia notificação para `/api/webhooks/cakto`
   - Sistema atualiza plano do usuário automaticamente
   - Contador de processos é resetado (se necessário)

4. **Usuário vê plano atualizado**
   - Página de sucesso mostra confirmação
   - Dashboard mostra novo plano
   - Limites são atualizados imediatamente

## 🔐 Segurança

- ✅ Verificação de assinatura do webhook
- ✅ Validação de dados recebidos
- ✅ Logs de todas as transações
- ✅ Tratamento de erros robusto

## 📊 Mapeamento de Planos

| Plano Sistema | Produto Cakto | Preço | Limite |
|--------------|---------------|-------|--------|
| Free | - | R$ 0 | 5 processos/mês |
| Pro | `CAKTO_PRODUCT_PRO` | R$ 49/mês | Ilimitado |
| Enterprise | `CAKTO_PRODUCT_ENTERPRISE` | R$ 99/mês | Ilimitado |

## 🧪 Como Testar

1. **Configurar variáveis de ambiente**
2. **Criar produtos na Cakto**
3. **Configurar webhook**
4. **Acessar `/configuracoes`**
5. **Clicar em "Assinar Agora" em um plano**
6. **Completar checkout na Cakto**
7. **Verificar atualização do plano**

## 📝 Notas Técnicas

- O webhook usa `SUPABASE_SERVICE_ROLE_KEY` para atualizar planos (ignora RLS)
- URLs de checkout incluem metadata com plano e origem
- Sistema aguarda 2 segundos após redirecionamento para webhook processar
- Planos são atualizados automaticamente sem necessidade de refresh

## 🐛 Troubleshooting

### Webhook não está sendo chamado
- Verifique se a URL está correta na Cakto
- Verifique se o middleware permite acesso à rota
- Verifique logs do servidor

### Plano não atualiza após pagamento
- Verifique se o webhook foi recebido (logs)
- Verifique se o email do pagamento corresponde ao email do usuário
- Verifique se `SUPABASE_SERVICE_ROLE_KEY` está configurada

### Erro de assinatura inválida
- Verifique se `CAKTO_WEBHOOK_SECRET` está correto
- Verifique se a Cakto está enviando a assinatura corretamente

---

**✅ Integração com Cakto funcionando! Configure as variáveis de ambiente e teste!**
