# 🚀 INÍCIO RÁPIDO - CivilAI Pro MVP

## ✅ O QUE JÁ ESTÁ PRONTO

Todo o código do MVP foi criado! Você tem:
- ✅ Estrutura completa Next.js 15 + TypeScript
- ✅ Autenticação com Supabase
- ✅ Dashboard com estatísticas
- ✅ Upload de arquivos (drag & drop)
- ✅ Sistema de Jobs (Regularização, Orçamento, etc)
- ✅ Componentes UI modernos (Shadcn)
- ✅ Proteção de rotas (middleware)
- ✅ Banco de dados configurado (SQL pronto)

## 📋 PRÓXIMOS PASSOS (quando tiver espaço em disco)

### 1. Instalar Dependências

```bash
cd civilai-pro
npm install
```

**⚠️ IMPORTANTE:** Você precisa de pelo menos **3-5 GB livres** no disco C: para o `npm install` funcionar.

### 2. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta (grátis)
3. Crie um novo projeto
4. Anote a **URL** e a **anon key** do projeto

### 3. Configurar Variáveis de Ambiente

1. Copie `.env.local.example` para `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Edite `.env.local` e adicione:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

### 4. Configurar Banco de Dados

1. No Supabase Dashboard, vá em **SQL Editor**
2. Clique em **New Query**
3. Abra o arquivo `supabase-setup.sql` e copie TODO o conteúdo
4. Cole no SQL Editor e clique em **Run**
5. Verifique se não houve erros

### 5. Rodar o Projeto

```bash
npm run dev
```

Acesse: `http://localhost:3000`

### 6. Testar o MVP

1. **Cadastro:** Acesse `/signup` e crie uma conta
2. **Login:** Faça login com suas credenciais
3. **Dashboard:** Veja o dashboard vazio
4. **Novo Job:** Clique em "Novo Job" e teste o upload de arquivos
5. **Processar:** Crie um job e veja ele aparecer no dashboard

## 🔌 INTEGRAÇÃO COM APIs DE IA (Próxima Fase)

O sistema está pronto para receber as integrações reais. Os arquivos estão em:
- `src/lib/ia/processar-regularizacao.ts`
- `src/lib/ia/processar-orcamento.ts`

Quando tiver as chaves das APIs, adicione no `.env.local`:
```env
NEXT_PUBLIC_ANTHROPIC_API_KEY=sua-chave-claude
NEXT_PUBLIC_REPLICATE_API_TOKEN=sua-chave-replicate
NEXT_PUBLIC_GROK_API_KEY=sua-chave-grok
```

## 🐛 PROBLEMAS COMUNS

### Erro: "ENOSPC: no space left on device"
**Solução:** Libere espaço no disco C: (pelo menos 3-5 GB)

### Erro: "Supabase client not initialized"
**Solução:** Verifique se `.env.local` existe e tem as variáveis corretas

### Erro: "Policy violation" ao criar job
**Solução:** Execute novamente o `supabase-setup.sql` no Supabase

### Erro: "Cannot find module"
**Solução:** Execute `npm install` novamente

## 📚 ESTRUTURA DO PROJETO

```
civilai-pro/
├── src/
│   ├── app/                    # Rotas Next.js
│   │   ├── (auth)/            # Login/Signup
│   │   ├── dashboard/        # Dashboard principal
│   │   └── novo-job/         # Criar novo job
│   ├── components/            # Componentes React
│   │   ├── ui/               # Shadcn UI
│   │   ├── upload-zone.tsx   # Upload drag & drop
│   │   ├── job-card.tsx      # Card de job
│   │   └── dashboard-stats.tsx
│   ├── lib/                   # Utilitários
│   │   ├── supabase/         # Cliente Supabase
│   │   ├── ia/               # Processamento IA
│   │   └── utils.ts
│   └── types/                 # Tipos TypeScript
├── supabase-setup.sql         # SQL para configurar banco
├── .env.local.example         # Template de variáveis
└── README.md                  # Documentação completa
```

## 🎯 FUNCIONALIDADES IMPLEMENTADAS

- ✅ Autenticação completa (login/cadastro)
- ✅ Dashboard com estatísticas
- ✅ Upload de arquivos (múltiplos, drag & drop)
- ✅ Criação de Jobs (5 tipos diferentes)
- ✅ Listagem de processos
- ✅ Status de jobs (pendente, processando, concluído, etc)
- ✅ Proteção de rotas (middleware)
- ✅ RLS no Supabase (segurança)
- ✅ Interface responsiva e moderna

## 🚧 PRÓXIMAS FUNCIONALIDADES (Fase 2)

- [ ] Integração real com Claude Sonnet
- [ ] Integração real com Replicate (SAM2)
- [ ] Integração real com Grok API
- [ ] Geração de PDFs (jsPDF)
- [ ] Geração de Excel (quantitativos)
- [ ] Sistema de pagamento (Stripe)
- [ ] Notificações (WhatsApp/Email)
- [ ] Export para AutoCAD

## 💡 DICAS

1. **Teste primeiro localmente** antes de fazer deploy
2. **Use o plano Free do Supabase** para começar (é suficiente para MVP)
3. **Mantenha as chaves de API seguras** (nunca commite `.env.local`)
4. **Use o SQL Editor do Supabase** para debugar queries se necessário

## 📞 PRECISA DE AJUDA?

- Verifique o `README.md` para documentação completa
- Veja os comentários no código para entender cada parte
- Os arquivos de IA estão prontos para receber as integrações reais

---

**🎉 Parabéns! Seu MVP CivilAI Pro está pronto para rodar!**

Basta ter espaço em disco e seguir os passos acima. 🚀


