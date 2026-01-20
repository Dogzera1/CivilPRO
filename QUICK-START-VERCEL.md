# ⚡ Quick Start - Deploy no Vercel

Guia rápido para fazer deploy em 5 minutos.

## 🚀 Passos Rápidos

### 1. Preparar Código (2 min)

```bash
# Certifique-se de que está no diretório do projeto
cd "C:\Users\vict_\Desktop\saas ENG CIVIL\civilai-pro"

# Verificar se há mudanças não commitadas
git status

# Se necessário, fazer commit
git add .
git commit -m "Preparar para deploy no Vercel"
```

### 2. Criar Repositório no GitHub (1 min)

1. Acesse: https://github.com/new
2. Nome: `civilai-pro`
3. Público ou Privado (sua escolha)
4. **NÃO** marque "Initialize with README"
5. Clique em **"Create repository"**

### 3. Conectar ao GitHub (1 min)

```bash
# Se ainda não tiver git inicializado
git init

# Adicionar remote
git remote add origin https://github.com/SEU_USUARIO/civilai-pro.git

# Push inicial
git branch -M main
git push -u origin main
```

### 4. Deploy no Vercel (1 min)

1. Acesse: https://vercel.com
2. **"Sign Up"** com GitHub
3. **"Add New Project"**
4. Importe `civilai-pro`
5. Configure variáveis (veja abaixo)
6. Clique em **"Deploy"**

### 5. Configurar Variáveis no Vercel

No Vercel, vá em **Settings > Environment Variables** e adicione:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key

# Perplexity
PERPLEXITY_API_KEY=sua-chave-perplexity

# Cakto
NEXT_PUBLIC_CAKTO_API_URL=https://api.cakto.com.br
NEXT_PUBLIC_CAKTO_PUBLIC_KEY=sua-chave-publica
CAKTO_WEBHOOK_SECRET=seu-secret-webhook
NEXT_PUBLIC_CAKTO_PRODUCT_PRO=id-produto-pro
NEXT_PUBLIC_CAKTO_PRODUCT_ENTERPRISE=id-produto-enterprise
NEXT_PUBLIC_APP_URL=https://civilai-pro.vercel.app
```

**⚠️ Marque todas como Production, Preview e Development**

### 6. Obter URL do Vercel

Após o deploy, você terá uma URL como:
```
https://civilai-pro.vercel.app
```

### 7. Configurar na Cakto (2 min)

1. **Webhook:**
   ```
   https://civilai-pro.vercel.app/api/webhooks/cakto
   ```

2. **URLs de Retorno (em cada produto):**
   - Sucesso: `https://civilai-pro.vercel.app/checkout/success`
   - Cancelamento: `https://civilai-pro.vercel.app/checkout/cancel`
   - Página de Vendas: `https://civilai-pro.vercel.app/vendas`

### 8. Configurar Supabase

No Supabase Dashboard:
1. **Authentication > URL Configuration**
2. Adicione `https://civilai-pro.vercel.app` nas Redirect URLs
3. Adicione `https://civilai-pro.vercel.app` na Site URL

## ✅ Pronto!

Sua aplicação está no ar em: `https://civilai-pro.vercel.app`

## 🔄 Próximos Deploys

A partir de agora, qualquer push para `main` faz deploy automático:

```bash
git add .
git commit -m "Nova funcionalidade"
git push origin main
# Vercel faz deploy automaticamente!
```

## 📖 Documentação Completa

Para mais detalhes, veja:
- [`DEPLOY-VERCEL.md`](./DEPLOY-VERCEL.md) - Guia completo
- [`CAKTO-SETUP.md`](./CAKTO-SETUP.md) - Configuração Cakto

---

**🎉 Sucesso! Aplicação no ar!**
