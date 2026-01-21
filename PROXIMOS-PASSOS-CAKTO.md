# 🎯 Próximos Passos Após Criar Produtos na Cakto

## ✅ O que você já fez:
- [x] Criou os produtos na Cakto (Pro e Enterprise)

## 📋 O que fazer agora:

### 1. Obter os IDs dos Produtos

1. **Acesse:** Dashboard Cakto > Produtos
2. **Para cada produto criado:**
   - Clique no produto
   - Copie o **ID do Produto** (geralmente aparece como `prod_abc123...` ou similar)
   - Anote qual é qual (Pro ou Enterprise)

### 2. Configurar IDs no Vercel

1. **Acesse:** https://vercel.com > Seu Projeto > Settings > Environment Variables

2. **Adicione/Atualize as variáveis:**

```env
NEXT_PUBLIC_CAKTO_PRODUCT_PRO=id-do-produto-pro-aqui
NEXT_PUBLIC_CAKTO_PRODUCT_ENTERPRISE=id-do-produto-enterprise-aqui
```

3. **Marque como:** ✅ Production, ✅ Preview, ✅ Development

4. **Salve**

### 3. Configurar Webhook na Cakto

1. **Acesse:** Dashboard Cakto > Configurações > Webhooks

2. **Adicione nova URL de webhook:**
   ```
   URL: https://seu-projeto.vercel.app/api/webhooks/cakto
   Eventos: 
   - payment.approved
   - payment.cancelled
   - subscription.created
   - subscription.renewed
   - subscription.cancelled
   - payment.failed
   
   Secret: VqZhdTl5APQBiJAI6Z9XWIJELeXdSd6Gjpd6BHgWouW5xsA70W8LNfkDo5EzwPESILsX2E8mry74d5dyGNJoinoOfGm8Ayeu5glWtynqCTOqjkFZZwJfrPmLLTxNTPg5
   
   Status: Ativo
   ```

   **⚠️ IMPORTANTE:** Substitua `seu-projeto.vercel.app` pela URL real do seu projeto no Vercel!

### 4. Configurar URLs de Retorno nos Produtos

Para **cada produto** (Pro e Enterprise):

1. **Acesse:** Dashboard Cakto > Produtos > [Seu Produto] > Editar

2. **Configure as URLs:**
   - **URL de Sucesso:** `https://seu-projeto.vercel.app/checkout/success`
   - **URL de Cancelamento:** `https://seu-projeto.vercel.app/checkout/cancel`
   - **Página de Vendas:** `https://seu-projeto.vercel.app/vendas`

3. **Salve** as alterações

### 5. Redeploy no Vercel (se necessário)

Se você já tinha feito deploy antes de adicionar os IDs dos produtos:

1. **Opção 1:** Aguarde o próximo deploy automático (quando você fizer push)
2. **Opção 2:** Faça redeploy manual:
   - Vercel > Deployments > [último deploy] > Redeploy

### 6. Testar a Integração

1. **Acesse:** `https://seu-projeto.vercel.app/configuracoes`
2. **Clique em:** "Assinar Agora" em um dos planos
3. **Complete o checkout** na Cakto
4. **Verifique:**
   - Se redireciona para `/checkout/success`
   - Se o plano foi atualizado no dashboard
   - Se o webhook foi recebido (veja logs no Vercel)

## 🔍 Como Verificar se Está Funcionando

### Verificar Webhook:
1. Vercel > Deployments > [deploy] > Functions
2. Procure por `/api/webhooks/cakto`
3. Veja os logs para verificar se está recebendo eventos

### Verificar Plano do Usuário:
1. Acesse `/configuracoes` após o pagamento
2. Verifique se o plano foi atualizado de "free" para "pro" ou "enterprise"

## 📝 Checklist Final

- [ ] IDs dos produtos copiados da Cakto
- [ ] IDs configurados no Vercel (Environment Variables)
- [ ] Webhook configurado na Cakto com URL do Vercel
- [ ] URLs de retorno configuradas nos produtos
- [ ] Redeploy realizado (se necessário)
- [ ] Teste de checkout realizado
- [ ] Webhook recebendo eventos (verificado nos logs)
- [ ] Plano do usuário atualizado após pagamento

## 🆘 Precisa de Ajuda?

Se você tiver os IDs dos produtos, envie para mim e eu ajudo a configurar no Vercel!

---

**✅ Configure os IDs no Vercel e teste a integração!**
