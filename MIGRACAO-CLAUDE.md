# 🔄 Migração: Perplexity → Claude Anthropic

## ✅ Status: CONCLUÍDO

A API da Perplexity foi substituída pela API do Claude (Anthropic).

## 📋 O Que Foi Alterado

### 1. Novo Cliente Claude (`src/lib/ia/claude-client.ts`)
- ✅ Cliente completo para API do Claude
- ✅ Suporte a todos os tipos de processamento
- ✅ Modelo padrão: `claude-3-5-sonnet-latest` (com fallback automático)
- ✅ Mesma interface das funções (compatibilidade mantida)

### 2. Arquivo Perplexity (`src/lib/ia/perplexity-client.ts`)
- ✅ Mantido para compatibilidade
- ✅ Agora apenas re-exporta funções do Claude
- ✅ Código antigo removido

### 3. API Route (`src/app/api/ia/processar/route.ts`)
- ✅ Atualizado para usar Claude
- ✅ Verificação de `CLAUDE_API_KEY` em vez de `PERPLEXITY_API_KEY`

## 🔑 Configuração Necessária

### Variável de Ambiente

**No Vercel:**
1. Acesse: https://vercel.com > Seu Projeto > Settings > Environment Variables
2. Adicione/Atualize:
   - **Nome:** `CLAUDE_API_KEY`
   - **Valor:** Sua chave Claude (fornecida separadamente)
   - **Ambiente:** Production, Preview, Development

**No `.env.local` (desenvolvimento local):**
```env
CLAUDE_API_KEY=sua-chave-claude-aqui
```

## 🎯 Diferenças Técnicas

### API do Claude vs Perplexity

| Aspecto | Perplexity | Claude |
|---------|-----------|--------|
| URL | `https://api.perplexity.ai/chat/completions` | `https://api.anthropic.com/v1/messages` |
| Header Auth | `Authorization: Bearer {key}` | `x-api-key: {key}` |
| Header Version | Não necessário | `anthropic-version: 2023-06-01` |
| System Message | Dentro de `messages` | Parâmetro separado `system` |
| Resposta | `data.choices[0].message.content` | `data.content[0].text` |
| Modelo | `sonar` | `claude-3-5-sonnet-latest` (fallback: `claude-3-5-sonnet-20240620`, `claude-3-sonnet-20240229`) |

## ✅ Funcionalidades Mantidas

Todas as funções continuam funcionando da mesma forma:
- ✅ `analisarPlantaRegularizacao()`
- ✅ `gerarOrcamento()`
- ✅ `gerarPlantaEletrica()`
- ✅ `gerarPlantaHidraulica()`
- ✅ `gerarLaudo()`
- ✅ `verificarConformidade()`

## 🚀 Próximos Passos

1. **Configure a chave no Vercel** (veja seção acima)
2. **Aguarde o deploy** automático após o push
3. **Teste criando um novo processo** para validar a integração

## 📝 Notas

- A chave da API foi removida do `env.example` por segurança
- O código mantém compatibilidade com imports antigos
- Logs agora mostram `[Claude]` em vez de `[Perplexity]`
