# 🛒 Configurar Produtos Cakto Após Deploy

## 📋 Situação Atual

As variáveis `NEXT_PUBLIC_CAKTO_PRODUCT_PRO` e `NEXT_PUBLIC_CAKTO_PRODUCT_ENTERPRISE` serão configuradas **APÓS** o deploy no Vercel, pois você precisa da URL do site para criar os produtos na Cakto.

## ✅ Passo a Passo

### 1. Fazer Deploy no Vercel (Primeiro)

1. Faça o deploy no Vercel seguindo o guia `DEPLOY-VERCEL.md`
2. Obtenha sua URL: `https://seu-projeto.vercel.app`

### 2. Criar Produtos na Cakto

1. **Acesse:** Dashboard Cakto > Produtos
2. **Clique em:** "Criar Produto" ou "Novo Produto"

#### Produto "Pro" (R$ 49,90/mês)

- **Nome:** `CivilAI Pro - Plano Pro`
- **Preço:** `R$ 49,90`
- **Tipo:** Assinatura mensal
- **URL de Sucesso:** `https://seu-projeto.vercel.app/checkout/success`
- **URL de Cancelamento:** `https://seu-projeto.vercel.app/checkout/cancel`
- **Página de Vendas:** `https://seu-projeto.vercel.app/vendas`
- **Anote o ID do Produto** gerado (ex: `prod_abc123...`)

#### Produto "Enterprise" (R$ 99,90/mês)

- **Nome:** `CivilAI Pro - Plano Enterprise`
- **Preço:** `R$ 99,90`
- **Tipo:** Assinatura mensal
- **URL de Sucesso:** `https://seu-projeto.vercel.app/checkout/success`
- **URL de Cancelamento:** `https://seu-projeto.vercel.app/checkout/cancel`
- **Página de Vendas:** `https://seu-projeto.vercel.app/vendas`
- **Anote o ID do Produto** gerado (ex: `prod_xyz789...`)

### 3. Configurar IDs no Vercel

1. **Acesse:** Vercel > Seu Projeto > Settings > Environment Variables
2. **Adicione/Atualize:**

```env
NEXT_PUBLIC_CAKTO_PRODUCT_PRO=prod_abc123...  # ID do produto Pro
NEXT_PUBLIC_CAKTO_PRODUCT_ENTERPRISE=prod_xyz789...  # ID do produto Enterprise
```

3. **Marque como:** Production, Preview e Development
4. **Salve**

### 4. Configurar Localmente (Opcional)

Se quiser testar localmente, atualize o `.env.local`:

```env
NEXT_PUBLIC_CAKTO_PRODUCT_PRO=prod_abc123...
NEXT_PUBLIC_CAKTO_PRODUCT_ENTERPRISE=prod_xyz789...
```

### 5. Redeploy (Se necessário)

- O Vercel detecta mudanças nas variáveis automaticamente
- Ou faça um redeploy manual: Deployments > [último deploy] > Redeploy

## ✅ Checklist

- [ ] Deploy no Vercel realizado
- [ ] URL do Vercel obtida
- [ ] Produto Pro criado na Cakto
- [ ] ID do Produto Pro anotado
- [ ] Produto Enterprise criado na Cakto
- [ ] ID do Produto Enterprise anotado
- [ ] URLs de retorno configuradas nos produtos
- [ ] Variáveis configuradas no Vercel
- [ ] Teste de checkout realizado

## 🔄 Ordem de Configuração

```
1. Deploy no Vercel
   ↓
2. Obter URL do Vercel
   ↓
3. Criar produtos na Cakto (com URLs do Vercel)
   ↓
4. Obter IDs dos produtos
   ↓
5. Configurar IDs no Vercel
   ↓
6. Testar checkout
```

## 📝 Notas

- **Não precisa criar produtos antes do deploy** - você pode fazer depois
- **As URLs de retorno devem apontar para o Vercel** - não use localhost
- **Os IDs dos produtos são únicos** - anote com cuidado
- **Você pode atualizar as variáveis a qualquer momento** no Vercel

---

**✅ Configure os produtos após o deploy e adicione os IDs no Vercel!**
