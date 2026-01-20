# 🚀 Deploy no Vercel - CivilAI Pro

Guia completo para fazer deploy da aplicação no Vercel e configurar a integração com Cakto.

## 📋 Pré-requisitos

1. Conta no GitHub (gratuita)
2. Conta no Vercel (gratuita)
3. Conta no Supabase (gratuita)
4. Conta na Cakto (para pagamentos)

## 🔧 Passo 1: Preparar o Repositório

### 1.1. Criar Repositório no GitHub

```bash
# No diretório do projeto
cd "C:\Users\vict_\Desktop\saas ENG CIVIL\civilai-pro"

# Inicializar git (se ainda não tiver)
git init

# Adicionar arquivos
git add .

# Commit inicial
git commit -m "Initial commit - CivilAI Pro"

# Criar repositório no GitHub e conectar
git remote add origin https://github.com/SEU_USUARIO/civilai-pro.git
git branch -M main
git push -u origin main
```

### 1.2. Criar `.gitignore` (se não existir)

Certifique-se de que `.gitignore` inclui:

```
# Dependências
node_modules/
/.pnp
.pnp.js

# Testes
/coverage

# Produção
/build
/dist
/.next/
/out/

# Variáveis de ambiente
.env*.local
.env

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDEs
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

## 🌐 Passo 2: Deploy no Vercel

### 2.1. Conectar Repositório

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique em **"Add New Project"**
4. Importe o repositório `civilai-pro`

### 2.2. Configurar Variáveis de Ambiente

No Vercel, vá em **Settings > Environment Variables** e adicione:

#### Variáveis Obrigatórias:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-supabase
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-supabase

# Perplexity AI
PERPLEXITY_API_KEY=sua-chave-perplexity

# Cakto
NEXT_PUBLIC_CAKTO_API_URL=https://api.cakto.com.br
NEXT_PUBLIC_CAKTO_PUBLIC_KEY=sua-chave-publica-cakto
CAKTO_WEBHOOK_SECRET=seu-secret-webhook-cakto
NEXT_PUBLIC_CAKTO_PRODUCT_PRO=id-produto-pro-cakto
NEXT_PUBLIC_CAKTO_PRODUCT_ENTERPRISE=id-produto-enterprise-cakto

# App URL (será preenchida automaticamente pelo Vercel)
NEXT_PUBLIC_APP_URL=https://civilai-pro.vercel.app
```

**⚠️ IMPORTANTE:** 
- Marque todas como **Production, Preview e Development**
- A `NEXT_PUBLIC_APP_URL` será atualizada automaticamente pelo Vercel, mas você pode definir manualmente

### 2.3. Configurações do Projeto

No Vercel, em **Settings > General**:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (padrão)
- **Output Directory:** `.next` (padrão)
- **Install Command:** `npm install` (padrão)
- **Node.js Version:** 18.x ou superior

### 2.4. Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar (2-5 minutos)
3. Você receberá uma URL: `https://civilai-pro.vercel.app` (ou similar)

## 🔗 Passo 3: Configurar Cakto com URL do Vercel

### 3.1. Obter URL do Vercel

Após o deploy, você terá uma URL como:
```
https://civilai-pro.vercel.app
```

### 3.2. Configurar na Cakto

1. **Acesse a dashboard da Cakto**
2. **Vá em Configurações > Webhooks**
3. **Adicione nova URL de webhook:**
   ```
   URL: https://civilai-pro.vercel.app/api/webhooks/cakto
   Eventos: payment_approved, payment_canceled, subscription_canceled
   Secret: [Gere um secret seguro e anote]
   Status: Ativo
   ```

4. **Configure URLs de Retorno nos Produtos:**

   **Para cada produto (Pro e Enterprise):**
   
   - **URL de Sucesso:**
     ```
     https://civilai-pro.vercel.app/checkout/success
     ```
   
   - **URL de Cancelamento:**
     ```
     https://civilai-pro.vercel.app/checkout/cancel
     ```
   
   - **Página de Vendas:**
     ```
     https://civilai-pro.vercel.app/vendas
     ```

### 3.3. Atualizar Variáveis no Vercel

1. Vá em **Settings > Environment Variables**
2. Atualize `NEXT_PUBLIC_APP_URL`:
   ```
   NEXT_PUBLIC_APP_URL=https://civilai-pro.vercel.app
   ```
3. Adicione o `CAKTO_WEBHOOK_SECRET` que você gerou
4. **Redeploy** o projeto (ou aguarde o próximo deploy automático)

## 🗄️ Passo 4: Configurar Supabase

### 4.1. Atualizar URLs Permitidas

No Supabase Dashboard:

1. Vá em **Authentication > URL Configuration**
2. Adicione nas **Redirect URLs:**
   ```
   https://civilai-pro.vercel.app/**
   https://civilai-pro.vercel.app/auth/callback
   ```
3. Adicione nas **Site URL:**
   ```
   https://civilai-pro.vercel.app
   ```

### 4.2. Verificar RLS Policies

Certifique-se de que as políticas RLS estão configuradas corretamente:

```sql
-- Verificar se as políticas existem
SELECT * FROM pg_policies WHERE tablename = 'users';
SELECT * FROM pg_policies WHERE tablename = 'jobs';
SELECT * FROM pg_policies WHERE tablename = 'pagamentos';
```

## ✅ Passo 5: Testar Deploy

### 5.1. Testar Aplicação

1. Acesse: `https://civilai-pro.vercel.app`
2. Teste:
   - ✅ Cadastro de usuário
   - ✅ Login
   - ✅ Criação de processo
   - ✅ Dashboard

### 5.2. Testar Webhook da Cakto

1. Faça um teste de pagamento na Cakto
2. Verifique os logs no Vercel:
   - Vá em **Deployments > [último deploy] > Functions**
   - Procure por `/api/webhooks/cakto`
   - Verifique se há erros

### 5.3. Verificar Logs

No Vercel:
- **Deployments > [deploy] > Runtime Logs**
- Verifique se não há erros de autenticação ou API

## 🔄 Passo 6: Deploy Automático (CI/CD)

O Vercel já configura deploy automático por padrão:

- **Push para `main`:** Deploy em produção
- **Pull Request:** Preview deployment
- **Push para outras branches:** Preview deployment

### 6.1. Workflow Recomendado

```bash
# Desenvolvimento local
git checkout -b feature/nova-funcionalidade
# ... fazer alterações ...
git commit -m "feat: nova funcionalidade"
git push origin feature/nova-funcionalidade

# Criar PR no GitHub
# Vercel cria preview automaticamente

# Após aprovação, merge para main
# Vercel faz deploy em produção automaticamente
```

## 🌍 Passo 7: Configurar Domínio Personalizado (Opcional)

### 7.1. Adicionar Domínio

1. No Vercel: **Settings > Domains**
2. Adicione seu domínio: `civilai.com.br`
3. Siga as instruções de DNS

### 7.2. Atualizar URLs

Após configurar o domínio:

1. **Atualize no Vercel:**
   ```
   NEXT_PUBLIC_APP_URL=https://civilai.com.br
   ```

2. **Atualize na Cakto:**
   - Webhook: `https://civilai.com.br/api/webhooks/cakto`
   - URLs de retorno: `https://civilai.com.br/checkout/success`

3. **Atualize no Supabase:**
   - Site URL: `https://civilai.com.br`
   - Redirect URLs: `https://civilai.com.br/**`

## 📊 Monitoramento

### Verificar Status

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Deployments:** Veja histórico de deploys
- **Analytics:** Métricas de uso (plano pago)
- **Logs:** Runtime logs em tempo real

### Alertas

Configure alertas no Vercel para:
- Falhas de build
- Erros em runtime
- Deploys com falha

## 🐛 Troubleshooting

### Erro: "Environment variable not found"

- Verifique se adicionou todas as variáveis no Vercel
- Certifique-se de marcar para Production, Preview e Development

### Erro: "Webhook not working"

- Verifique se a URL do webhook está correta
- Verifique se o `CAKTO_WEBHOOK_SECRET` está configurado
- Veja os logs no Vercel para erros específicos

### Erro: "Supabase auth failed"

- Verifique se as URLs estão configuradas no Supabase
- Verifique se as chaves estão corretas
- Veja os logs do Supabase

## 📝 Checklist Final

- [ ] Repositório criado no GitHub
- [ ] Projeto conectado no Vercel
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Deploy bem-sucedido
- [ ] URL do Vercel configurada na Cakto
- [ ] Webhook da Cakto configurado
- [ ] URLs de retorno configuradas na Cakto
- [ ] Supabase configurado com URLs do Vercel
- [ ] Teste de cadastro funcionando
- [ ] Teste de login funcionando
- [ ] Teste de pagamento funcionando
- [ ] Webhook recebendo eventos

---

**🎉 Parabéns! Sua aplicação está no ar!**

Acesse: `https://civilai-pro.vercel.app`
