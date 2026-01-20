# 🌐 Configurar ngrok para Desenvolvimento com Cakto

## Por que usar ngrok?

A Cakto precisa de uma **URL pública** para enviar webhooks. Como `localhost` não é acessível externamente, usamos ngrok para criar um túnel público para seu servidor local.

## 📋 Passo a Passo

### 1. Instalar ngrok

**Windows:**
1. Baixe em: https://ngrok.com/download
2. Extraia o arquivo `ngrok.exe`
3. Coloque em uma pasta acessível (ex: `C:\ngrok\`)

**Ou via Chocolatey:**
```powershell
choco install ngrok
```

**Ou via npm (global):**
```bash
npm install -g ngrok
```

### 2. Criar Conta no ngrok (Gratuita)

1. Acesse: https://dashboard.ngrok.com/signup
2. Crie uma conta gratuita
3. Obtenha seu **authtoken** no dashboard

### 3. Configurar ngrok

```bash
# Autenticar (apenas uma vez)
ngrok config add-authtoken SEU_AUTHTOKEN_AQUI
```

### 4. Iniciar Túnel

**Com Next.js rodando na porta 3000:**

```bash
# Abra um novo terminal
ngrok http 3000
```

Você verá algo como:
```
Forwarding  https://abc123-def456.ngrok-free.app -> http://localhost:3000
```

### 5. Usar URL do ngrok na Cakto

**Na configuração da Cakto:**

1. **URL de Webhook:**
   ```
   https://abc123-def456.ngrok-free.app/api/webhooks/cakto
   ```

2. **URL de Sucesso:**
   ```
   https://abc123-def456.ngrok-free.app/checkout/success
   ```

3. **URL de Cancelamento:**
   ```
   https://abc123-def456.ngrok-free.app/checkout/cancel
   ```

4. **Página de Vendas:**
   ```
   https://abc123-def456.ngrok-free.app/vendas
   ```

### 6. Atualizar Variáveis de Ambiente

No `.env.local`:

```env
NEXT_PUBLIC_APP_URL=https://abc123-def456.ngrok-free.app
```

**⚠️ IMPORTANTE:** A URL do ngrok muda a cada vez que você reinicia (no plano gratuito). Você precisará atualizar na Cakto sempre que reiniciar o ngrok.

### 7. Solução Permanente (Plano Pago ngrok)

Se quiser uma URL fixa, use o plano pago do ngrok:

```bash
ngrok http 3000 --domain=seu-dominio-fixo.ngrok-free.app
```

## 🔄 Fluxo de Trabalho

1. **Inicie o Next.js:**
   ```bash
   npm run dev
   ```

2. **Em outro terminal, inicie o ngrok:**
   ```bash
   ngrok http 3000
   ```

3. **Copie a URL do ngrok** (ex: `https://abc123.ngrok-free.app`)

4. **Configure na Cakto:**
   - Webhook: `https://abc123.ngrok-free.app/api/webhooks/cakto`
   - URLs de retorno: `https://abc123.ngrok-free.app/checkout/success`

5. **Atualize `.env.local`:**
   ```env
   NEXT_PUBLIC_APP_URL=https://abc123.ngrok-free.app
   ```

6. **Reinicie o Next.js** para pegar a nova variável

## 🎯 Alternativas ao ngrok

### Cloudflare Tunnel (Gratuito e URL Fixa)

```bash
# Instalar cloudflared
# Windows: choco install cloudflared
# Mac: brew install cloudflared

# Criar túnel
cloudflared tunnel --url http://localhost:3000
```

### Deploy Temporário no Vercel (Recomendado para Testes)

1. Faça push do código para GitHub
2. Conecte no Vercel
3. Deploy automático
4. Use a URL do Vercel (ex: `https://civilai-pro.vercel.app`)
5. **Vantagem:** URL fixa e gratuita!

## 📝 Notas

- **Plano Gratuito ngrok:** URL muda a cada reinício
- **Plano Pago ngrok:** URL fixa disponível
- **Vercel:** Melhor opção para testes (gratuito e URL fixa)
- **Produção:** Use seu domínio real

---

**✅ Configure o ngrok e teste a integração com a Cakto!**
