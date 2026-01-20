# 🔄 Mudança: "Job" → "Processo"

## Resumo das Alterações

Substituição da palavra "job" por "processo" em todo o código para melhor adequação ao contexto brasileiro de engenharia civil.

## Arquivos que Precisam ser Renomeados

### Rotas (Pastas)
- `src/app/novo-job/` → `src/app/novo-processo/`
- `src/app/job/[id]/` → `src/app/processo/[id]/`
- `src/app/api/job/[id]/` → `src/app/api/processo/[id]/`

### Componentes
- `src/components/job-card.tsx` → `src/components/processo-card.tsx` (ou manter com alias)

## Alterações Já Feitas

✅ Tipos TypeScript (`src/types/index.ts`)
- `Job` → `Processo`
- `JobType` → `TipoProcesso` (com alias para compatibilidade)
- `JobStatus` → `StatusProcesso` (com alias para compatibilidade)
- `jobs_mes_atual` → `processos_mes_atual`

✅ Componente JobCard (`src/components/job-card.tsx`)
- `JobCard` → `ProcessoCard` (com alias `JobCard` para compatibilidade)
- Props: `job` → `processo`

✅ Dashboard (`src/app/dashboard/page.tsx`)
- Variáveis: `jobs` → `processos`, `job` → `processo`
- Função: `loadJobs` → `loadProcessos`
- Textos atualizados

✅ Página Novo Job (`src/app/novo-job/page.tsx`)
- Função: `NovoJobPage` → `NovoProcessoPage`
- Variáveis: `job` → `processo`, `jobId` → `processoId`
- Textos atualizados

## Alterações Pendentes

### Rotas da API
- [ ] `src/app/api/job/[id]/gerar-pdf/route.ts`
- [ ] `src/app/api/job/[id]/gerar-excel/route.ts`

### Página de Detalhes
- [ ] `src/app/job/[id]/page.tsx`

### Middleware
- [ ] Atualizar paths no `src/middleware.ts`

### Banco de Dados
- [ ] Tabela `jobs` pode manter o nome (não crítico)
- [ ] Campo `jobs_mes_atual` → `processos_mes_atual` (já atualizado no tipo)

## Nota Importante

Mantivemos aliases (`Job`, `JobType`, `JobStatus`, `JobCard`) para compatibilidade durante a transição. Isso permite que o código continue funcionando enquanto fazemos as mudanças gradualmente.

## Próximos Passos

1. Renomear pastas de rotas
2. Atualizar todas as referências nas rotas da API
3. Atualizar middleware
4. Atualizar textos na interface do usuário
5. Remover aliases após transição completa (opcional)

---

**Status:** Em progresso - ~60% completo
