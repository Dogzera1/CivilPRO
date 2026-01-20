# 🔑 Configuração de Chaves Cakto

## Tipos de Chaves Cakto

A Cakto fornece diferentes tipos de chaves na página **"Chaves de API"**:

### 1. **Cliente ID** (`NEXT_PUBLIC_CAKTO_PUBLIC_KEY`)
- **Onde encontrar:** Dashboard Cakto > Chaves de API > Coluna "Cliente ID"
- **Variável:** `NEXT_PUBLIC_CAKTO_PUBLIC_KEY`
- **Exemplo:** `dsdzaYPQO5SGOLqzXrW6VNFIibRc4TiFtawOSTih`
- **Uso:** Identificação pública da sua aplicação na Cakto

### 2. **Cliente Segredo** (`CAKTO_CLIENT_SECRET`)
- **Onde encontrar:** Dashboard Cakto > Chaves de API > Coluna "Cliente Segredo" (clique no ícone de olho para revelar)
- **Variável:** `CAKTO_CLIENT_SECRET` (ou `CAKTO_WEBHOOK_SECRET` dependendo do uso)
- **Uso:** Autenticação segura com a API da Cakto

### 3. **Secret do Webhook** (`CAKTO_WEBHOOK_SECRET`)
- **Onde encontrar:** Dashboard Cakto > Configurações > Webhooks > Secret
- **Variável:** `CAKTO_WEBHOOK_SECRET`
- **Uso:** Verificar assinatura dos webhooks recebidos
- **Nota:** Pode ser o mesmo que o Cliente Segredo ou diferente

## 🔍 Identificar sua Chave

Na página **"Chaves de API"** da Cakto você verá:

- **Cliente ID:** `dsdzaYPQO5SGOLqzXrW6VNFIibRc4TiFtawOSTih` ← Esta é a chave pública
- **Cliente Segredo:** `********fKiB` (mascarado) ← Clique no ícone de olho para revelar

## ✅ Como Configurar

### No Vercel (Produção):

1. Vá em **Settings > Environment Variables**
2. Adicione:

```env
# Cliente ID (da coluna "Cliente ID" na página Chaves de API)
NEXT_PUBLIC_CAKTO_PUBLIC_KEY=dsdzaYPQO5SGOLqzXrW6VNFIibRc4TiFtawOSTih

# Cliente Segredo (revele clicando no ícone de olho na coluna "Cliente Segredo")
CAKTO_CLIENT_SECRET=seu-cliente-segredo-aqui

# Secret do Webhook (pode ser o mesmo que Cliente Segredo ou diferente)
CAKTO_WEBHOOK_SECRET=seu-webhook-secret-aqui
```

### Localmente (`.env.local`):

```env
# Cliente ID
NEXT_PUBLIC_CAKTO_PUBLIC_KEY=dsdzaYPQO5SGOLqzXrW6VNFIibRc4TiFtawOSTih

# Cliente Segredo (revele no dashboard da Cakto)
CAKTO_CLIENT_SECRET=seu-cliente-segredo-aqui

# Secret do Webhook
CAKTO_WEBHOOK_SECRET=seu-webhook-secret-aqui
```

## 🔒 Segurança

**⚠️ IMPORTANTE:**
- ✅ **NUNCA** commite chaves no Git
- ✅ Use variáveis de ambiente sempre
- ✅ Configure no Vercel em Settings > Environment Variables
- ✅ Mantenha `.env.local` no `.gitignore`

## 📝 Checklist

- [ ] Copiei o **Cliente ID** da página "Chaves de API"
- [ ] Revelei e copiei o **Cliente Segredo** (clique no ícone de olho)
- [ ] Configurei `NEXT_PUBLIC_CAKTO_PUBLIC_KEY` com o Cliente ID
- [ ] Configurei `CAKTO_CLIENT_SECRET` com o Cliente Segredo
- [ ] Configurei `CAKTO_WEBHOOK_SECRET` (pode ser o mesmo que Cliente Segredo)
- [ ] Configurei no Vercel (Settings > Environment Variables)
- [ ] Configurei localmente em `.env.local` (se necessário)
- [ ] Verifiquei que `.env.local` está no `.gitignore`
- [ ] Testei a integração

## 🧪 Como Testar

1. **Teste de Checkout:**
   - Acesse `/configuracoes`
   - Clique em "Assinar Agora"
   - Verifique se redireciona para Cakto

2. **Teste de Webhook:**
   - Faça um pagamento de teste na Cakto
   - Verifique logs no Vercel
   - Confirme se o plano foi atualizado

---

**💡 Dica:** Se não tiver certeza qual tipo de chave é, verifique no dashboard da Cakto onde você encontrou ela. Geralmente:
- **Chave Pública:** Em "API Keys" ou "Configurações > Chaves"
- **Webhook Secret:** Em "Webhooks > Configurações"
