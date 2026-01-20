-- ============================================
-- FUNÇÕES ADICIONAIS PARA CIVILAI PRO
-- ============================================
-- Execute este SQL no SQL Editor do Supabase

-- Função para incrementar contador de jobs do mês
CREATE OR REPLACE FUNCTION increment_jobs_count(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE users
  SET jobs_mes_atual = jobs_mes_atual + 1
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para resetar contador no início do mês (pode ser chamada por cron job)
CREATE OR REPLACE FUNCTION reset_monthly_jobs_count()
RETURNS void AS $$
BEGIN
  UPDATE users
  SET jobs_mes_atual = 0
  WHERE DATE_TRUNC('month', updated_at) < DATE_TRUNC('month', NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar limite do plano antes de criar job
CREATE OR REPLACE FUNCTION can_create_job(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_plano TEXT;
  jobs_count INTEGER;
  limite INTEGER;
BEGIN
  SELECT plano, jobs_mes_atual INTO user_plano, jobs_count
  FROM users
  WHERE id = user_id;
  
  -- Definir limite baseado no plano
  CASE user_plano
    WHEN 'free' THEN limite := 5;
    WHEN 'pro' THEN limite := 999999; -- Ilimitado
    WHEN 'enterprise' THEN limite := 999999; -- Ilimitado
    ELSE limite := 5; -- Default free
  END CASE;
  
  RETURN jobs_count < limite;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
