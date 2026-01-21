# ✅ IDs dos Produtos Cakto - Configuração Final

## 🎯 IDs Identificados

### Produto Pro
- **ID:** `fpwpcyj_734166`
- **Link:** https://pay.cakto.com.br/fpwpcyj_734166

### Produto Enterprise
- **ID:** `zdbpsph_734184`
- **Link:** https://pay.cakto.com.br/zdbpsph_734184

## 📋 Configurar no Vercel

### Passo 1: Acessar Environment Variables

1. **Acesse:** https://vercel.com
2. **Selecione:** Seu projeto CivilPRO
3. **Vá em:** Settings > Environment Variables

### Passo 2: Adicionar Variáveis

#### Variável 1: Produto Pro

1. **Clique em:** Add New (ou Edit se já existir)
2. **Configure:**
   ```
   Key: NEXT_PUBLIC_CAKTO_PRODUCT_PRO
   Value: fpwpcyj_734166
   ```
3. **Marque:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. **Salve**

#### Variável 2: Produto Enterprise

1. **Clique em:** Add New (ou Edit se já existir)
2. **Configure:**
   ```
   Key: NEXT_PUBLIC_CAKTO_PRODUCT_ENTERPRISE
   Value: zdbpsph_734184
   ```
3. **Marque:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. **Salve**

### Passo 3: Verificar Outras Variáveis

Certifique-se de que estas variáveis também estão configuradas:

```env
NEXT_PUBLIC_CAKTO_PUBLIC_KEY=dsdzaYPQO5SGOLqzXrW6VNFIibRc4TiFtawOSTih
CAKTO_CLIENT_SECRET=VqZhdTl5APQBiJAI6Z9XWIJELeXdSd6Gjpd6BHgWouW5xsA70W8LNfkDo5EzwPESILsX2E8mry74d5dyGNJoinoOfGm8Ayeu5glWtynqCTOqjkFZZwJfrPmLLTxNTPg5
CAKTO_WEBHOOK_SECRET=VqZhdTl5APQBiJAI6Z9XWIJELeXdSd6Gjpd6BHgWouW5xsA70W8LNfkDo5EzwPESILsX2E8mry74d5dyGNJoinoOfGm8Ayeu5glWtynqCTOqjkFZZwJfrPmLLTxNTPg5
NEXT_PUBLIC_CAKTO_API_URL=https://pay.cakto.com.br
```

### Passo 4: Redeploy

- O Vercel detecta mudanças automaticamente
- Ou faça redeploy manual: Deployments > [último deploy] > Redeploy

## ✅ Checklist Final

- [x] ID do produto Pro identificado: `fpwpcyj_734166`
- [x] ID do produto Enterprise identificado: `zdbpsph_734184`
- [ ] IDs configurados no Vercel
- [ ] Variáveis marcadas como Production, Preview e Development
- [ ] Redeploy realizado
- [ ] Webhook configurado na Cakto
- [ ] URLs de retorno configuradas nos produtos
- [ ] Teste de checkout realizado

## 🧪 Como Testar

1. **Acesse:** `https://seu-projeto.vercel.app/configuracoes`
2. **Teste Plano Pro:**
   - Clique em "Assinar Agora" no plano Pro
   - Deve redirecionar para: `https://pay.cakto.com.br/fpwpcyj_734166`
3. **Teste Plano Enterprise:**
   - Clique em "Assinar Agora" no plano Enterprise
   - Deve redirecionar para: `https://pay.cakto.com.br/zdbpsph_734184`

## 🔗 Próximos Passos

Após configurar os IDs no Vercel:

1. **Configurar Webhook na Cakto:**
   - URL: `https://seu-projeto.vercel.app/api/webhooks/cakto`
   - Secret: `VqZhdTl5APQBiJAI6Z9XWIJELeXdSd6Gjpd6BHgWouW5xsA70W8LNfkDo5EzwPESILsX2E8mry74d5dyGNJoinoOfGm8Ayeu5glWtynqCTOqjkFZZwJfrPmLLTxNTPg5`

2. **Configurar URLs de Retorno nos Produtos:**
   - URL de Sucesso: `https://seu-projeto.vercel.app/checkout/success`
   - URL de Cancelamento: `https://seu-projeto.vercel.app/checkout/cancel`

---

**✅ Configure os IDs no Vercel e teste a integração completa!**
