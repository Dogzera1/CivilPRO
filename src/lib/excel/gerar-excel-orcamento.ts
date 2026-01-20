import * as XLSX from "xlsx";

interface DadosOrcamento {
  quantidade_aco: number;
  quantidade_concreto: number;
  valor_total: number;
  detalhamento: string;
  cliente_nome?: string;
  cidade?: string;
  created_at: string;
}

export function gerarExcelOrcamento(dados: DadosOrcamento): XLSX.WorkBook {
  const workbook = XLSX.utils.book_new();

  // Planilha 1: Resumo
  const resumoData = [
    ["ORÇAMENTO DE OBRA"],
    [],
    ["Cliente:", dados.cliente_nome || "Não informado"],
    ["Cidade:", dados.cidade || "Não informada"],
    ["Data:", new Date(dados.created_at).toLocaleDateString("pt-BR")],
    [],
    ["QUANTITATIVOS"],
    ["Item", "Quantidade", "Unidade"],
    ["Aço", dados.quantidade_aco, "kg"],
    ["Concreto", dados.quantidade_concreto, "m³"],
    [],
    ["VALOR TOTAL ESTIMADO", `R$ ${dados.valor_total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`],
  ];

  const resumoSheet = XLSX.utils.aoa_to_sheet(resumoData);
  
  // Formatação da planilha
  resumoSheet["!cols"] = [
    { wch: 25 }, // Coluna A
    { wch: 15 }, // Coluna B
    { wch: 10 }, // Coluna C
  ];

  XLSX.utils.book_append_sheet(workbook, resumoSheet, "Resumo");

  // Planilha 2: Detalhamento
  const detalhamentoData = [
    ["DETALHAMENTO DO ORÇAMENTO"],
    [],
    [dados.detalhamento || "Detalhamento gerado pela IA."],
  ];

  const detalhamentoSheet = XLSX.utils.aoa_to_sheet(detalhamentoData);
  detalhamentoSheet["!cols"] = [{ wch: 80 }];
  XLSX.utils.book_append_sheet(workbook, detalhamentoSheet, "Detalhamento");

  return workbook;
}

export function excelToBuffer(workbook: XLSX.WorkBook): Buffer {
  return Buffer.from(XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }));
}
