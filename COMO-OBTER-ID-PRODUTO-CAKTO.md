# 🔍 Como Obter o ID do Produto na Cakto

## 📋 Passo a Passo

### Opção 1: Pela Lista de Produtos

1. **Na página que você está vendo:**
   - Clique no ícone de **três pontos (⋮)** no final da linha do produto "CivilAI Pro-Plano Pro"
   - Ou clique diretamente no **nome do produto**

2. **Na página de detalhes do produto:**
   - Procure por um campo chamado **"ID"** ou **"Product ID"**
   - Ou olhe na **URL do navegador** - geralmente aparece algo como:
     ```
     https://dashboard.cakto.com.br/products/prod_abc123...
     ```
   - O ID geralmente começa com `prod_` seguido de letras e números

### Opção 2: Pela API ou Configurações

1. **Dashboard Cakto > Produtos > [Seu Produto]**
2. **Procure em:**
   - Configurações do produto
   - Detalhes técnicos
   - API/Integração

### Opção 3: Inspecionar Elemento (Avançado)

1. **Clique com botão direito** no produto
2. **Selecione "Inspecionar"** ou "Inspecionar Elemento"
3. **Procure por** `data-product-id` ou `product-id` no HTML

## 📝 Formato do ID

O ID geralmente tem um destes formatos:
- `prod_abc123def456...`
- `prod_xyz789...`
- Ou apenas uma string alfanumérica

## ✅ Depois de Obter o ID

1. **Anote o ID** do produto Pro
2. **Se criou o Enterprise também**, anote esse ID também
3. **Envie para mim** ou configure diretamente no Vercel:
   - Vercel > Settings > Environment Variables
   - Adicione:
     ```
     NEXT_PUBLIC_CAKTO_PRODUCT_PRO=id-aqui
     NEXT_PUBLIC_CAKTO_PRODUCT_ENTERPRISE=id-aqui
     ```

## 🆘 Não Encontrou o ID?

- Tente clicar no nome do produto para ver os detalhes
- Verifique se há uma aba "Configurações" ou "Detalhes"
- Procure por "Código do Produto" ou "Identificador"

---

**💡 Dica:** O ID geralmente está visível quando você clica para editar o produto!
