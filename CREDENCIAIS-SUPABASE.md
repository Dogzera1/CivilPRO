# 🔑 Credenciais do Supabase - CivilAI Pro

## ✅ Projeto Criado com Sucesso!

**Nome do Projeto:** CivilAI Pro  
**ID do Projeto:** `hjnnmijmusvmkchcmvxk`  
**URL:** `https://hjnnmijmusvmkchcmvxk.supabase.co`

## 📋 Variáveis de Ambiente

Adicione estas variáveis no arquivo `.env.local` (na raiz do projeto):

```env
NEXT_PUBLIC_SUPABASE_URL=https://hjnnmijmusvmkchcmvxk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqbm5taWptdXN2bWtjaGNtdnhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MjQ0NDcsImV4cCI6MjA4NDUwMDQ0N30.OKD9hDZkaSqOujQ-HhQ78EKlNGm5kXBecySfuXuZaeo
```

**Chave Publishable (moderna - opcional):**
```env
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_cGQ6KjjoXkYMf9pqJjQDKg_heYW98Rp
```

## ✅ O Que Foi Criado

### Tabelas
- ✅ `users` - Tabela de usuários com RLS habilitado
- ✅ `jobs` - Tabela de jobs/processos com RLS habilitado

### Storage
- ✅ Bucket `uploads` criado e configurado (público)

### Segurança (RLS)
- ✅ Políticas de segurança para tabela `users`
- ✅ Políticas de segurança para tabela `jobs`
- ✅ Políticas de segurança para storage `uploads`

### Triggers e Funções
- ✅ Trigger para atualizar `updated_at` automaticamente
- ✅ Função `handle_new_user()` para criar usuário após signup
- ✅ Trigger `on_auth_user_created` configurado

### Índices
- ✅ Índices criados para performance (`user_id`, `status`, `tipo`, `created_at`)

## 🚀 Próximos Passos

1. **Configure o `.env.local`:**
   ```bash
   cd civilai-pro
   # Crie o arquivo .env.local e adicione as variáveis acima
   ```

2. **Teste o projeto:**
   ```bash
   npm run dev
   ```

3. **Acesse:** `http://localhost:3000`

## 📝 Notas Importantes

- ⚠️ **NUNCA** commite o arquivo `.env.local` no Git
- ✅ O projeto está no plano **FREE** (gratuito)
- ✅ Todas as políticas RLS estão configuradas corretamente
- ✅ O storage está configurado para uploads de arquivos

## 🔗 Links Úteis

- **Dashboard Supabase:** https://supabase.com/dashboard/project/hjnnmijmusvmkchcmvxk
- **API Docs:** https://hjnnmijmusvmkchcmvxk.supabase.co/rest/v1/
- **Storage:** https://supabase.com/dashboard/project/hjnnmijmusvmkchcmvxk/storage/buckets

---

**🎉 Tudo pronto! Agora é só configurar o `.env.local` e rodar o projeto!**
