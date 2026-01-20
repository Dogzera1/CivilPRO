# 📁 Especificações de Arquivos por Tipo de Processo

Este documento detalha quais arquivos são necessários para cada tipo de processo no CivilAI Pro.

## 📋 Resumo Geral

- **Formatos Aceitos:** PDF, JPG, PNG
- **Máximo de Arquivos:** 5 por job
- **Tamanho Máximo:** 10MB por arquivo
- **Total Máximo:** 50MB por job

---

## 🏠 1. Regularização

### Arquivos Obrigatórios:
- ✅ **Planta Baixa** (PDF, JPG ou PNG)
  - Deve conter área total, área construída e recuos
  - Preferência por PDF com escala definida

### Arquivos Recomendados:
- 📸 **Fotos da Obra** (JPG ou PNG)
  - Mínimo: 2 fotos
  - Mostrar fachada frontal e lateral
  - Fotos em boa qualidade e iluminação

### Arquivos Opcionais:
- 📄 **Documentos Legais** (PDF)
  - Matrícula do imóvel
  - Escritura
  - Certidão de IPTU
  - Outros documentos relevantes

### O que a IA Processa:
- Cálculo de área total e construída
- Medição de recuos (frontal, laterais, fundos)
- Geração de memorial descritivo
- Verificação de conformidade urbanística

---

## 💰 2. Orçamento

### Arquivos Obrigatórios:
- ✅ **Plantas Arquitetônicas** (PDF, JPG ou PNG)
  - Planta baixa com dimensões
  - Cortes e fachadas (se disponível)
  - Escala definida

### Arquivos Recomendados:
- 🏗️ **Plantas Estruturais** (PDF, JPG ou PNG)
  - Detalhamento de estrutura
  - Quantitativos de aço e concreto

### Arquivos Opcionais:
- 🔌 **Plantas de Instalações** (PDF, JPG ou PNG)
  - Elétrica, hidráulica, sanitária
- 📝 **Memorial Descritivo** (PDF)
  - Especificações técnicas
  - Materiais e acabamentos

### O que a IA Processa:
- Quantitativos de materiais (aço, concreto, etc.)
- Cálculo de áreas e volumes
- Estimativa de custos
- Geração de planilha de orçamento

---

## 📐 3. Planta Complementar

### Arquivos Obrigatórios:
- ✅ **Planta Base** (PDF, JPG ou PNG)
  - Planta arquitetônica existente
  - Com dimensões e escala

### Arquivos Recomendados:
- 📋 **Especificações Técnicas** (PDF)
  - Normas técnicas aplicáveis
  - Requisitos do projeto

### Arquivos Opcionais:
- 📚 **Plantas de Referência** (PDF, JPG ou PNG)
  - Plantas similares
  - Exemplos de projetos

### O que a IA Processa:
- Geração de plantas complementares
- Aplicação de normas técnicas
- Detalhamento conforme especificações

---

## 🔍 4. Laudo Técnico

### Arquivos Obrigatórios:
- ✅ **Fotos da Inspeção** (JPG ou PNG)
  - Mínimo: 5 fotos
  - Diferentes ângulos e detalhes
  - Boa qualidade e iluminação

### Arquivos Recomendados:
- 📐 **Plantas Existentes** (PDF, JPG ou PNG)
  - Se disponível
  - Para referência de dimensões

### Arquivos Opcionais:
- 📄 **Documentos Legais** (PDF)
  - Matrícula
  - Escritura
  - Certidões
- 📊 **Relatórios Anteriores** (PDF)
  - Laudos anteriores
  - Inspeções passadas

### O que a IA Processa:
- Análise das condições da obra
- Identificação de patologias
- Geração de laudo técnico completo
- Recomendações técnicas

---

## ✅ 5. Conformidade Urbanística

### Arquivos Obrigatórios:
- ✅ **Planta de Localização** (PDF, JPG ou PNG)
  - Localização no lote
  - Confrontações
  - Orientação solar
- ✅ **Planta Baixa** (PDF, JPG ou PNG)
  - Com dimensões e recuos

### Arquivos Recomendados:
- 📸 **Fotos da Obra** (JPG ou PNG)
  - Estado atual da construção
  - Verificação visual

### Arquivos Opcionais:
- 📜 **Código de Obras Local** (PDF)
  - Legislação municipal
  - Normas específicas

### O que a IA Processa:
- Verificação de recuos legais
- Conformidade com código de obras
- Análise de áreas e índices
- Parecer de conformidade

---

## ⚠️ Dicas Importantes

### Qualidade dos Arquivos:
- ✅ Use arquivos em boa resolução (mínimo 300 DPI para imagens)
- ✅ Certifique-se de que as plantas têm escala definida
- ✅ Fotos devem estar bem iluminadas e nítidas
- ✅ PDFs devem ser legíveis (não escaneados muito escuros)

### Organização:
- 📁 Nomeie os arquivos de forma descritiva:
  - `planta-baixa.pdf`
  - `foto-fachada-frontal.jpg`
  - `matricula-imovel.pdf`

### Tamanhos Recomendados:
- **PDFs:** 2-5MB (ideal)
- **Imagens:** 1-3MB (ideal)
- **Máximo:** 10MB por arquivo

---

## 🔄 Processamento

Após o upload:
1. ✅ Arquivos são validados (tipo e tamanho)
2. ✅ Upload para Supabase Storage
3. ✅ Processamento com IA (10-30 segundos)
4. ✅ Resultados salvos no banco
5. ✅ Job atualizado com status "concluído"

---

**Última atualização:** Integração com Perplexity AI ativa ✅
