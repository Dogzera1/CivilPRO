# 🔧 Troubleshooting - Problemas de Login

## Problema: Email Confirmado mas Login Não Funciona

### ✅ Correções Aplicadas

1. **Melhor tratamento de erros no login**
   - Mensagens de erro mais claras
   - Verificação de confirmação de email
   - Botão para reenviar email de confirmação

2. **Página de confirmação de email**
   - Rota `/confirm-email` criada
   - Confirmação automática via link
   - Feedback visual do status

3. **Middleware atualizado**
   - Permite acesso à página de confirmação
   - Não bloqueia links de confirmação do Supabase

## 🔍 Como Resolver

### Passo 1: Verificar Email Confirmado

1. Acesse o **Supabase Dashboard**
2. Vá em **Authentication** > **Users**
3. Encontre seu usuário pelo email
4. Verifique se a coluna **Email Confirmed** está marcada como `true`

### Passo 2: Tentar Login Novamente

1. Acesse `/login`
2. Digite seu email e senha
3. Se aparecer erro "Email não confirmado":
   - Clique em "Reenviar email de confirmação"
   - Verifique sua caixa de entrada (e spam)
   - Clique no link de confirmação

### Passo 3: Verificar Configuração do Supabase

No Supabase Dashboard:

1. **Authentication** > **URL Configuration**
   - Site URL: `http://localhost:3000` (desenvolvimento)
   - Redirect URLs: Adicione `http://localhost:3000/confirm-email`

2. **Authentication** > **Email Templates**
   - Verifique se os templates estão configurados
   - O link de confirmação deve apontar para: `{{ .SiteURL }}/confirm-email?token_hash={{ .TokenHash }}&type=signup`

### Passo 4: Desabilitar Confirmação de Email (Desenvolvimento)

Se quiser testar sem confirmação de email:

1. **Supabase Dashboard** > **Authentication** > **Providers**
2. Desabilite temporariamente **"Confirm email"**
3. Isso permite login imediato após signup

⚠️ **ATENÇÃO:** Reative a confirmação de email em produção!

## 🐛 Erros Comuns

### "Invalid login credentials"
- **Causa:** Email ou senha incorretos
- **Solução:** Verifique se está usando as credenciais corretas

### "Email not confirmed"
- **Causa:** Email não foi confirmado
- **Solução:** 
  - Clique no link de confirmação no email
  - Ou use o botão "Reenviar email de confirmação" na página de login

### "Email rate limit exceeded"
- **Causa:** Muitas tentativas de login
- **Solução:** Aguarde alguns minutos e tente novamente

### "User not found"
- **Causa:** Usuário não existe no banco
- **Solução:** Crie uma nova conta em `/signup`

## 📧 Verificar Email de Confirmação

O email de confirmação do Supabase geralmente:
- Vem do endereço: `noreply@mail.app.supabase.io`
- Assunto: "Confirm your signup"
- Contém um link que deve ser clicado

**Se não recebeu o email:**
1. Verifique a pasta de spam
2. Use o botão "Reenviar email de confirmação" no login
3. Verifique se o email está correto

## 🔄 Fluxo Correto

1. **Cadastro** (`/signup`)
   - Preenche formulário
   - Clica em "Cadastrar"
   - Recebe mensagem de sucesso

2. **Confirmação de Email**
   - Recebe email do Supabase
   - Clica no link de confirmação
   - É redirecionado para `/confirm-email`
   - Email é confirmado automaticamente
   - Redirecionado para `/dashboard`

3. **Login** (`/login`)
   - Digite email e senha
   - Clica em "Entrar"
   - Se email confirmado: vai para `/dashboard`
   - Se não confirmado: mostra erro com opção de reenviar

## 💡 Dica: Testar sem Confirmação

Para desenvolvimento rápido, você pode:

1. Desabilitar confirmação de email no Supabase
2. Ou usar email de teste que não precisa confirmação
3. Ou confirmar manualmente no dashboard do Supabase

## 📞 Precisa de Mais Ajuda?

- Verifique os logs do Supabase: **Dashboard** > **Logs** > **Auth Logs**
- Veja erros no console do navegador (F12)
- Verifique se `.env.local` está configurado corretamente

---

**Última atualização:** Janeiro 2026
