# ⚙️ Configurar ID do Produto no Vercel

## ✅ ID do Produto Encontrado!

**Produto Pro:** `fpwpcyj_734166`

## 📋 Passo a Passo para Configurar no Vercel

### 1. Acessar Environment Variables

1. **Acesse:** https://vercel.com
2. **Selecione seu projeto** CivilPRO
3. **Vá em:** Settings > Environment Variables

### 2. Adicionar/Atualizar Variável

1. **Procure por:** `NEXT_PUBLIC_CAKTO_PRODUCT_PRO`
   - Se já existir, clique em **Edit**
   - Se não existir, clique em **Add New**

2. **Configure:**
   ```
   Key: NEXT_PUBLIC_CAKTO_PRODUCT_PRO
   Value: fpwpcyj_734166
   ```

3. **Marque as opções:**
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

4. **Clique em:** Save

### 3. Se Criou o Produto Enterprise Também

Se você criou o produto Enterprise, repita o processo:

1. **Adicione:**
   ```
   Key: NEXT_PUBLIC_CAKTO_PRODUCT_ENTERPRISE
   Value: id-do-produto-enterprise-aqui
   ```

2. **Marque:** Production, Preview, Development

3. **Salve**

### 4. Redeploy (Opcional)

- O Vercel detecta mudanças nas variáveis automaticamente
- Ou faça redeploy manual: Deployments > [último deploy] > Redeploy

## ✅ Checklist

- [ ] ID do produto Pro configurado: `fpwpcyj_734166`
- [ ] Variável marcada como Production, Preview e Development
- [ ] Redeploy realizado (se necessário)
- [ ] Teste de checkout realizado

## 🧪 Como Testar

1. **Acesse:** `https://seu-projeto.vercel.app/configuracoes`
2. **Clique em:** "Assinar Agora" no plano Pro
3. **Verifique se:** Redireciona para `https://pay.cakto.com.br/fpwpcyj_734166`

---

**✅ Configure no Vercel e teste o checkout!**
