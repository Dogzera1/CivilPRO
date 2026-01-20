-- ============================================
-- TABELA DE PAGAMENTOS (OPCIONAL)
-- ============================================
-- Execute este SQL no SQL Editor do Supabase se quiser rastrear histórico de pagamentos

-- Tabela de pagamentos
CREATE TABLE IF NOT EXISTS pagamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plano TEXT NOT NULL CHECK (plano IN ('free', 'pro', 'enterprise')),
  valor DECIMAL(10, 2) NOT NULL,
  transaction_id TEXT UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('pendente', 'aprovado', 'cancelado', 'falhado')),
  provider TEXT DEFAULT 'cakto',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_pagamentos_user_id ON pagamentos(user_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_status ON pagamentos(status);
CREATE INDEX IF NOT EXISTS idx_pagamentos_transaction_id ON pagamentos(transaction_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_created_at ON pagamentos(created_at);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_pagamentos_updated_at BEFORE UPDATE ON pagamentos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;

-- Usuários só veem seus próprios pagamentos
CREATE POLICY "Users can view own payments" 
  ON pagamentos FOR SELECT 
  USING (auth.uid() = user_id);

-- Apenas o sistema pode inserir pagamentos (via webhook)
CREATE POLICY "System can insert payments" 
  ON pagamentos FOR INSERT 
  WITH CHECK (true); -- Webhook usa service role key, então passa

-- Comentários
COMMENT ON TABLE pagamentos IS 'Histórico de pagamentos e assinaturas';
COMMENT ON COLUMN pagamentos.transaction_id IS 'ID da transação na Cakto';
COMMENT ON COLUMN pagamentos.metadata IS 'Dados adicionais do pagamento (JSON)';
