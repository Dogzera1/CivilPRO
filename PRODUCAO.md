# 🚀 Guia de Produção - CivilAI Pro

Este documento contém todas as informações necessárias para colocar o CivilAI Pro em produção.

## 📋 Checklist Pré-Deploy

### 1. Variáveis de Ambiente

Crie um arquivo `.env.production` com as seguintes variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
PERPLEXITY_API_KEY=sua-chave-perplexity-aqui
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://seu-dominio.com
```

### 2. Configuração do Supabase

#### 2.1. RLS Policies
Certifique-se de que todas as políticas RLS estão configuradas corretamente:

```sql
-- Verificar políticas existentes
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

#### 2.2. Storage Bucket
Configure o bucket `uploads` como público ou com políticas adequadas:

```sql
-- Verificar configuração do bucket
SELECT * FROM storage.buckets WHERE id = 'uploads';
```

#### 2.3. Triggers
Verifique se o trigger `handle_new_user` está ativo:

```sql
SELECT * FROM pg_trigger WHERE tgname = 'handle_new_user';
```

### 3. Build e Testes

```bash
# Instalar dependências
npm install

# Executar lint
npm run lint

# Build de produção
npm run build

# Testar build localmente
npm start
```

### 4. Segurança

#### 4.1. Rate Limiting
- Configure rate limiting no Supabase (Dashboard > Settings > API)
- Considere adicionar rate limiting no middleware para rotas sensíveis

#### 4.2. CORS
- Configure CORS no Supabase para seu domínio de produção
- Adicione seu domínio nas configurações de autenticação

#### 4.3. Variáveis Sensíveis
- **NUNCA** commite arquivos `.env.production` ou `.env.local`
- Use variáveis de ambiente do seu provedor de hospedagem
- Rotacione chaves regularmente

### 5. Monitoramento

#### 5.1. Logs
- Configure logs no Supabase (Dashboard > Logs)
- Configure logs no seu provedor de hospedagem
- Monitore erros da API Perplexity

#### 5.2. Analytics (Opcional)
- Integre Google Analytics ou similar
- Configure eventos de conversão
- Monitore métricas de uso

## 🌐 Deploy

### Opção 1: Vercel (Recomendado)

1. **Conectar Repositório**
   ```bash
   # Instalar Vercel CLI
   npm i -g vercel
   
   # Fazer deploy
   vercel
   ```

2. **Configurar Variáveis de Ambiente**
   - Vá em Settings > Environment Variables
   - Adicione todas as variáveis do `.env.production`

3. **Configurar Domínio**
   - Settings > Domains
   - Adicione seu domínio personalizado

### Opção 2: Netlify

1. **Conectar Repositório**
   - Conecte seu repositório GitHub/GitLab
   - Configure build command: `npm run build`
   - Configure publish directory: `.next`

2. **Variáveis de Ambiente**
   - Site settings > Environment variables
   - Adicione todas as variáveis

### Opção 3: Self-Hosted (VPS/Docker)

1. **Build da Aplicação**
   ```bash
   npm run build
   ```

2. **Configurar PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "civilai-pro" -- start
   pm2 save
   pm2 startup
   ```

3. **Configurar Nginx**
   ```nginx
   server {
       listen 80;
       server_name seu-dominio.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔧 Pós-Deploy

### 1. Verificações

- [ ] Teste de login/cadastro
- [ ] Teste de criação de job
- [ ] Teste de processamento com IA
- [ ] Teste de geração de PDF
- [ ] Teste de download de arquivos
- [ ] Verificar logs de erro

### 2. Performance

- [ ] Verificar tempo de carregamento
- [ ] Otimizar imagens (se houver)
- [ ] Habilitar cache do Next.js
- [ ] Configurar CDN (se aplicável)

### 3. Backup

- [ ] Configurar backup automático do Supabase
- [ ] Documentar processo de restore
- [ ] Testar restore de backup

## 📊 Monitoramento Contínuo

### Métricas Importantes

1. **Uptime**: Disponibilidade do serviço
2. **Tempo de Resposta**: API e páginas
3. **Taxa de Erro**: Erros 4xx e 5xx
4. **Uso de API**: Requisições Perplexity
5. **Uso de Storage**: Espaço usado no Supabase

### Alertas Recomendados

- Erro 500 em qualquer endpoint
- Taxa de erro > 5%
- Tempo de resposta > 5s
- Uso de API próximo ao limite
- Storage próximo ao limite

## 🐛 Troubleshooting

### Erro: "Chave da API não configurada"
- Verifique se `PERPLEXITY_API_KEY` está configurada
- Verifique se o servidor foi reiniciado após adicionar a variável

### Erro: "RLS policy violation"
- Verifique as políticas RLS no Supabase
- Certifique-se de que o usuário está autenticado

### Erro: "Storage bucket não encontrado"
- Verifique se o bucket `uploads` existe
- Verifique as políticas do bucket

### Performance Lenta
- Verifique logs do servidor
- Monitore uso de recursos
- Considere otimizar queries do banco

## 📝 Manutenção

### Atualizações Regulares

1. **Dependências**
   ```bash
   npm audit
   npm update
   ```

2. **Next.js**
   ```bash
   npm install next@latest
   ```

3. **Supabase**
   - Monitore atualizações no dashboard
   - Teste em ambiente de staging primeiro

### Backup Regular

- Backup do banco de dados: Semanal
- Backup de arquivos: Diário
- Backup de configurações: Mensal

## 🔐 Segurança

### Boas Práticas

1. **Senhas**
   - Exigir senhas fortes (mínimo 8 caracteres)
   - Implementar 2FA (futuro)

2. **API Keys**
   - Rotacionar chaves regularmente
   - Usar diferentes chaves para dev/prod

3. **Dados Sensíveis**
   - Nunca logar dados sensíveis
   - Criptografar dados em trânsito (HTTPS)
   - Criptografar dados em repouso (Supabase)

4. **Rate Limiting**
   - Implementar rate limiting por usuário
   - Monitorar tentativas de abuso

## 📞 Suporte

Para problemas ou dúvidas:
- Verifique os logs do servidor
- Consulte a documentação do Supabase
- Consulte a documentação do Next.js
- Abra uma issue no repositório

---

**Última atualização:** $(date)
