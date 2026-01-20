# 🔍 Debug de Login - CivilAI Pro

## Como Debugar Problemas de Login

### 1. Abrir Console do Navegador
- Pressione `F12` ou `Ctrl+Shift+I`
- Vá na aba **Console**

### 2. Tentar Fazer Login
- Digite email e senha
- Clique em "Entrar"
- Observe as mensagens no console

### 3. Mensagens Esperadas no Console

**Se tudo estiver funcionando, você verá:**
```
Iniciando login para: seu@email.com
Chamando signInWithPassword...
Resposta do login: { data: {...}, error: null }
Login bem-sucedido! Usuário: seu@email.com
Sessão: Presente
Sessão atual após login: Presente
Verificação final - Usuário: seu@email.com
Redirecionando para /dashboard...
```

**Se houver erro, você verá:**
```
Iniciando login para: seu@email.com
Chamando signInWithPassword...
Resposta do login: { data: null, error: {...} }
Erro no login: [mensagem de erro]
```

### 4. Erros Comuns e Soluções

#### "Email não confirmado"
- **Solução:** Confirme o email no link enviado
- Ou desabilite confirmação temporariamente no Supabase Dashboard

#### "Invalid login credentials"
- **Solução:** Verifique se email e senha estão corretos
- Tente criar uma nova conta

#### "Variáveis de ambiente não configuradas"
- **Solução:** Verifique se `.env.local` existe e tem as variáveis corretas

#### "Sessão não foi estabelecida"
- **Solução:** Limpe cookies do navegador e tente novamente
- Ou use janela anônima

### 5. Verificar Configuração

**Verifique o arquivo `.env.local`:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://hjnnmijmusvmkchcmvxk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
```

**Verifique no Supabase Dashboard:**
- Authentication > Users > Seu usuário existe?
- Authentication > Settings > Email confirmado está habilitado?

### 6. Teste Rápido

Abra o console e execute:
```javascript
// Verificar se Supabase está configurado
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configurada' : 'Não configurada');

// Verificar usuário atual
const { data: { user } } = await supabase.auth.getUser();
console.log('Usuário atual:', user);
```

### 7. Solução Rápida: Desabilitar Confirmação de Email

Para desenvolvimento, você pode desabilitar temporariamente:

1. Supabase Dashboard > Authentication > Providers
2. Desabilite "Confirm email"
3. Tente fazer login novamente

⚠️ **Lembre-se de reativar em produção!**

---

**Se ainda não funcionar, copie TODAS as mensagens do console e me envie!**
