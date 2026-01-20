# 🤖 Integração com API de IA - Perplexity

## ✅ Status: IMPLEMENTADO

O sistema agora está usando a **API da Perplexity** para processamento real de IA!

## 🔧 O Que Foi Implementado

### 1. Cliente Perplexity (`src/lib/ia/perplexity-client.ts`)
- ✅ Função `callPerplexity()` - Chamada genérica à API
- ✅ Função `analisarPlantaRegularizacao()` - Análise de plantas para regularização
- ✅ Função `gerarOrcamento()` - Geração de orçamentos

### 2. API Route (`src/app/api/ia/processar/route.ts`)
- ✅ Endpoint seguro no servidor
- ✅ Processa requisições de IA
- ✅ Protege a chave da API (não exposta no cliente)

### 3. Integração no Fluxo de Jobs
- ✅ Processamento automático ao criar job
- ✅ Suporte para Regularização e Orçamento
- ✅ Salvamento dos resultados no banco

## 📋 Como Funciona

### Fluxo de Processamento:

1. **Usuário cria um job** → Upload de arquivos
2. **Sistema chama API Route** → `/api/ia/processar`
3. **API Route chama Perplexity** → Processa com IA
4. **Resultado é salvo** → No banco de dados
5. **Job atualizado** → Status muda para "concluído"

### Tipos de Processamento:

#### Regularização
- **Entrada:** URLs dos arquivos, endereço, cidade
- **Saída:**
  - `area_total` (m²)
  - `area_construida` (m²)
  - `recuos` (objeto com recuos)
  - `memorial` (texto completo)

#### Orçamento
- **Entrada:** URLs dos arquivos, cidade
- **Saída:**
  - `quantidade_aco` (kg)
  - `quantidade_concreto` (m³)
  - `valor_total` (R$)
  - `detalhamento` (texto completo)

## 🔑 Configuração

A chave da API está configurada no `.env.local`:

```env
PERPLEXITY_API_KEY=sua-chave-perplexity-aqui
```

**⚠️ IMPORTANTE:** 
- Nunca commite chaves de API no Git
- Use variáveis de ambiente sempre
- Configure no Vercel em Settings > Environment Variables

⚠️ **IMPORTANTE:** Esta chave está no servidor (não exposta no cliente).

## 🧪 Como Testar

1. **Acesse o Dashboard**
2. **Clique em "Novo Job"**
3. **Selecione tipo:** Regularização ou Orçamento
4. **Faça upload de arquivos** (fotos/plantas)
5. **Preencha dados do cliente**
6. **Clique em "Criar e Processar"**
7. **Aguarde processamento** (pode levar 10-30 segundos)
8. **Veja o resultado** no dashboard

## 📊 Onde Ver os Resultados

Os resultados da IA são salvos no campo `observacoes` do job em formato JSON:

```json
{
  "area_total": 150,
  "area_construida": 120,
  "recuos": {
    "frontal": 5,
    "lateral_esquerda": 3,
    "lateral_direita": 3,
    "fundos": 5
  },
  "memorial": "Memorial descritivo completo..."
}
```

## 🔍 Logs e Debug

Os logs aparecem no:
- **Console do navegador** (F12) - Logs do cliente
- **Terminal do servidor** - Logs da API

Procure por:
- `[IA]` - Logs de processamento
- `[API IA]` - Logs da API route
- `[Job]` - Logs do job

## 🚀 Próximos Passos

- [ ] Gerar PDFs com os resultados (jsPDF)
- [ ] Gerar Excel com quantitativos (xlsx)
- [ ] Melhorar prompts para maior precisão
- [ ] Adicionar cache de resultados
- [ ] Implementar processamento em background (queue)

## 📝 Notas Técnicas

- **Modelo usado:** `llama-3.1-sonar-large-128k-online`
- **Temperatura:** 0.2 (mais determinístico)
- **Max tokens:** 4000
- **Timeout:** Sem limite (pode levar alguns segundos)

---

**✅ Integração funcionando! Teste criando um novo job!**
