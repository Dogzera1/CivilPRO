import jsPDF from "jspdf";

interface DadosOrcamento {
  quantidade_aco: number;
  quantidade_concreto: number;
  valor_total: number;
  detalhamento: string;
  cliente_nome?: string;
  cidade?: string;
  created_at: string;
}

export function gerarPDFOrcamento(dados: DadosOrcamento): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = margin;

  // Cabeçalho
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("ORÇAMENTO DE OBRA", pageWidth / 2, yPos, { align: "center" });
  yPos += 15;

  // Linha divisória
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Informações do Cliente
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("INFORMAÇÕES DO CLIENTE", margin, yPos);
  yPos += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  if (dados.cliente_nome) {
    doc.text(`Nome: ${dados.cliente_nome}`, margin, yPos);
    yPos += 6;
  }
  if (dados.cidade) {
    doc.text(`Cidade: ${dados.cidade}`, margin, yPos);
    yPos += 6;
  }
  doc.text(`Data: ${new Date(dados.created_at).toLocaleDateString("pt-BR")}`, margin, yPos);
  yPos += 10;

  // Quantitativos
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("QUANTITATIVOS", margin, yPos);
  yPos += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  // Tabela de quantitativos
  const tableData = [
    ["Item", "Quantidade", "Unidade"],
    ["Aço", dados.quantidade_aco.toFixed(2), "kg"],
    ["Concreto", dados.quantidade_concreto.toFixed(2), "m³"],
  ];

  tableData.forEach((row, index) => {
    const isHeader = index === 0;
    doc.setFont("helvetica", isHeader ? "bold" : "normal");
    
    if (isHeader) {
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 8, "F");
    }
    
    doc.text(row[0], margin + 5, yPos);
    doc.text(row[1], margin + 100, yPos, { align: "right" });
    doc.text(row[2], margin + 140, yPos);
    yPos += isHeader ? 8 : 7;
  });

  yPos += 10;

  // Valor Total
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setFillColor(230, 240, 255);
  doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 10, "F");
  doc.text(
    `VALOR TOTAL ESTIMADO: R$ ${dados.valor_total.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    margin + 5,
    yPos + 2
  );
  yPos += 15;

  // Detalhamento
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("DETALHAMENTO", margin, yPos);
  yPos += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  // Quebrar texto em múltiplas linhas
  const maxWidth = pageWidth - 2 * margin;
  const lines = doc.splitTextToSize(dados.detalhamento || "Detalhamento gerado pela IA.", maxWidth);
  
  lines.forEach((line: string) => {
    if (yPos > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage();
      yPos = margin;
    }
    doc.text(line, margin, yPos);
    yPos += 6;
  });

  // Rodapé
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text(
      `Página ${i} de ${totalPages} - CivilAI Pro`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  return doc;
}
