-- Adicionar plano 'admin' à constraint da tabela users
-- Execute este SQL no Supabase SQL Editor

-- 1. Remover constraint antiga
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_plano_check;

-- 2. Criar nova constraint incluindo 'admin'
ALTER TABLE users 
ADD CONSTRAINT users_plano_check 
CHECK (plano IN ('free', 'pro', 'enterprise', 'admin'));

-- 3. Atualizar sua conta para admin e zerar contador
-- Substitua 'vict_13@outlook.com' pelo seu email se necessário
UPDATE users 
SET plano = 'admin', 
    jobs_mes_atual = 0
WHERE email = 'vict_13@outlook.com';

-- Verificar se funcionou
SELECT id, email, plano, jobs_mes_atual 
FROM users 
WHERE email = 'vict_13@outlook.com';
