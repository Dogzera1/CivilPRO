# 🔧 Configurar Variáveis de Ambiente

Guia completo para configurar todas as variáveis de ambiente necessárias.

## 📋 Passo a Passo

### 1. Criar Arquivo `.env.local`

```bash
# No diretório do projeto
cd "C:\Users\vict_\Desktop\saas ENG CIVIL\civilai-pro"

# Copiar arquivo de exemplo
copy env.example .env.local
```

### 2. Preencher Variáveis

Abra o arquivo `.env.local` e preencha TODAS as variáveis:

#### ✅ Supabase (3 variáveis)

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Onde: https://app.supabase.com > Seu Projeto > Settings > API
   - Exemplo: `https://abcdefghijklmnop.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Onde: Mesmo lugar acima, coluna "anon public"
   - Exemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **SUPABASE_SERVICE_ROLE_KEY**
   - Onde: Mesmo lugar, coluna "service_role" (⚠️ SECRETO!)
   - Exemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### ✅ Perplexity AI (1 variável)

1. **PERPLEXITY_API_KEY**
   - Onde: https://www.perplexity.ai/settings/api
   - Exemplo: `pplx-abc123...`

#### ✅ Cakto (6 variáveis)

1. **NEXT_PUBLIC_CAKTO_PUBLIC_KEY**
   - Valor: `dsdzaYPQO5SGOLqzXrW6VNFIibRc4TiFtawOSTih` ✅ (você já tem)

2. **CAKTO_CLIENT_SECRET**
   - Onde: Dashboard Cakto > Chaves de API > Coluna "Cliente Segredo"
   - ⚠️ Clique no ícone de olho para revelar
   - Exemplo: `abc123...`

3. **CAKTO_WEBHOOK_SECRET**
   - Onde: Dashboard Cakto > Configurações > Webhooks > Secret
   - Pode ser o mesmo que `CAKTO_CLIENT_SECRET`
   - Exemplo: `whsec_abc123...`

4. **NEXT_PUBLIC_CAKTO_PRODUCT_PRO**
   - Onde: Dashboard Cakto > Produtos > [Produto Pro] > ID
   - Exemplo: `prod_abc123...`

5. **NEXT_PUBLIC_CAKTO_PRODUCT_ENTERPRISE**
   - Onde: Dashboard Cakto > Produtos > [Produto Enterprise] > ID
   - Exemplo: `prod_xyz789...`

6. **NEXT_PUBLIC_CAKTO_API_URL**
   - Valor padrão: `https://api.cakto.com.br` (geralmente não precisa alterar)

#### ✅ Aplicação (1 variável)

1. **NEXT_PUBLIC_APP_URL**
   - Desenvolvimento: `http://localhost:3000`
   - Produção: Será preenchida automaticamente pelo Vercel

### 3. Verificar `.gitignore`

Certifique-se de que `.env.local` está no `.gitignore`:

```gitignore
# local env files
.env*.local
.env.production
```

✅ O `.gitignore` já está configurado corretamente!

## 🚀 Configurar no Vercel

Após fazer deploy no Vercel:

1. **Acesse:** https://vercel.com > Seu Projeto > Settings > Environment Variables

2. **Adicione TODAS as variáveis** (uma por uma):

   ```
   NEXT_PUBLIC_SUPABASE_URL = [seu valor]
   NEXT_PUBLIC_SUPABASE_ANON_KEY = [seu valor]
   SUPABASE_SERVICE_ROLE_KEY = [seu valor]
   PERPLEXITY_API_KEY = [seu valor]
   NEXT_PUBLIC_CAKTO_PUBLIC_KEY = dsdzaYPQO5SGOLqzXrW6VNFIibRc4TiFtawOSTih
   CAKTO_CLIENT_SECRET = [seu valor]
   CAKTO_WEBHOOK_SECRET = [seu valor]
   NEXT_PUBLIC_CAKTO_PRODUCT_PRO = [seu valor]
   NEXT_PUBLIC_CAKTO_PRODUCT_ENTERPRISE = [seu valor]
   NEXT_PUBLIC_CAKTO_API_URL = https://api.cakto.com.br
   NEXT_PUBLIC_APP_URL = https://seu-projeto.vercel.app
   ```

3. **Marque TODAS como:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. **Salve e faça redeploy** (ou aguarde o próximo deploy automático)

## ✅ Checklist

- [ ] Arquivo `.env.local` criado
- [ ] Todas as variáveis do Supabase preenchidas
- [ ] Chave do Perplexity preenchida
- [ ] Todas as variáveis do Cakto preenchidas
- [ ] `.env.local` está no `.gitignore` (já está ✅)
- [ ] Todas as variáveis configuradas no Vercel
- [ ] Variáveis marcadas como Production, Preview e Development no Vercel
- [ ] Testei localmente (`npm run dev`)
- [ ] Deploy no Vercel realizado

## 🔒 Segurança

**⚠️ IMPORTANTE:**

- ✅ **NUNCA** commite arquivos `.env.local` no Git
- ✅ Use apenas variáveis de ambiente
- ✅ Mantenha secrets seguros
- ✅ Revise o `.gitignore` regularmente
- ✅ Não compartilhe chaves em mensagens ou screenshots

## 📝 Exemplo Completo

Seu arquivo `.env.local` deve ficar assim:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Perplexity
PERPLEXITY_API_KEY=pplx-abc123...

# Cakto
NEXT_PUBLIC_CAKTO_PUBLIC_KEY=dsdzaYPQO5SGOLqzXrW6VNFIibRc4TiFtawOSTih
CAKTO_CLIENT_SECRET=seu-cliente-segredo-aqui
CAKTO_WEBHOOK_SECRET=seu-webhook-secret-aqui
NEXT_PUBLIC_CAKTO_PRODUCT_PRO=prod_abc123
NEXT_PUBLIC_CAKTO_PRODUCT_ENTERPRISE=prod_xyz789
NEXT_PUBLIC_CAKTO_API_URL=https://api.cakto.com.br

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

**✅ Configure todas as variáveis e faça o deploy no Vercel!**
