# 🧪 Guia de Teste da API de IA

## ✅ Status Atual

O endpoint de teste `/api/ia/test` está funcionando:
- ✅ Chave da API configurada
- ✅ API Route acessível
- ✅ Ambiente de desenvolvimento ativo

## 🔍 Próximos Passos para Testar

### 1. Teste o Processamento Real

Crie um novo job no sistema:
1. Acesse `/novo-job`
2. Selecione um tipo (Regularização ou Orçamento)
3. Faça upload de pelo menos 1 arquivo
4. Preencha os dados do cliente
5. Clique em "Criar e Processar"

### 2. Verifique os Logs

**No Terminal do Servidor** (onde `npm run dev` está rodando):
- Procure por `[API IA]` - logs do processamento
- Procure por `[Perplexity]` - logs da chamada à API externa
- Se houver erro, verá a mensagem completa

**No Console do Navegador** (F12):
- Procure por `[Job]` - logs do cliente
- Se houver erro, verá a mensagem retornada pela API

### 3. Possíveis Erros e Soluções

#### Erro 500 - "Chave da API não configurada"
- ✅ **Já resolvido** - O teste confirmou que está configurada

#### Erro 500 - "Erro ao processar: ..."
- Verifique os logs do servidor para ver o erro específico
- Pode ser:
  - Problema de conexão com a API Perplexity
  - Modelo inválido (já ajustado para `sonar`)
  - Formato de resposta inesperado

#### Erro 401 - "Unauthorized"
- A chave da API pode estar inválida ou expirada
- Verifique se a chave está correta no `.env.local`

#### Erro 429 - "Too Many Requests"
- Limite de requisições da API atingido
- Aguarde alguns minutos e tente novamente

### 4. Teste Manual da API

Você pode testar diretamente via curl ou Postman:

```bash
curl -X POST http://localhost:3000/api/ia/processar \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "regularizacao",
    "fileUrls": ["teste.pdf"],
    "dadosCliente": {
      "endereco": "Rua Teste, 123",
      "cidade": "Belo Horizonte"
    }
  }'
```

### 5. Modelos Disponíveis

O sistema está usando o modelo `sonar` da Perplexity, que é:
- ✅ Modelo padrão e estável
- ✅ Suporta até 32k tokens
- ✅ Bom para tarefas gerais de engenharia

Outros modelos disponíveis (se necessário):
- `sonar-pro` - Mais avançado
- `sonar-reasoning` - Para raciocínio complexo

---

**Status:** ✅ API configurada e pronta para testes!
