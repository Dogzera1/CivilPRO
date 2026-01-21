import jsPDF from "jspdf";
import { limparMarkdown } from "./limpar-markdown";

interface DadosRegularizacao {
  area_total: number;
  area_construida: number;
  recuos: Record<string, number>;
  memorial: string;
  cliente_nome?: string;
  endereco_obra?: string;
  cidade?: string;
  created_at: string;
}

export function gerarPDFRegularizacao(dados: DadosRegularizacao): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = margin;

  // Cabeçalho
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("MEMORIAL DESCRITIVO - REGULARIZAÇÃO", pageWidth / 2, yPos, { align: "center" });
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
  if (dados.endereco_obra) {
    doc.text(`Endereço: ${dados.endereco_obra}`, margin, yPos);
    yPos += 6;
  }
  if (dados.cidade) {
    doc.text(`Cidade: ${dados.cidade}`, margin, yPos);
    yPos += 6;
  }
  doc.text(`Data: ${new Date(dados.created_at).toLocaleDateString("pt-BR")}`, margin, yPos);
  yPos += 10;

  // Dados Técnicos
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("DADOS TÉCNICOS", margin, yPos);
  yPos += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Área Total do Terreno: ${dados.area_total.toFixed(2)} m²`, margin, yPos);
  yPos += 6;
  doc.text(`Área Construída: ${dados.area_construida.toFixed(2)} m²`, margin, yPos);
  yPos += 6;
  
  // Taxa de Ocupação
  const taxaOcupacao = dados.area_total > 0 
    ? ((dados.area_construida / dados.area_total) * 100).toFixed(2)
    : "0.00";
  doc.text(`Taxa de Ocupação: ${taxaOcupacao}%`, margin, yPos);
  yPos += 10;

  // Recuos
  if (dados.recuos && Object.keys(dados.recuos).length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("RECUOS", margin, yPos);
    yPos += 8;

    doc.setFont("helvetica", "normal");
    Object.entries(dados.recuos).forEach(([tipo, valor]) => {
      const tipoFormatado = tipo
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      doc.text(`${tipoFormatado}: ${valor} m`, margin, yPos);
      yPos += 6;
    });
    yPos += 5;
  }

  // Memorial Descritivo
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("MEMORIAL DESCRITIVO", margin, yPos);
  yPos += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  const memorialLimpo = limparMarkdown(dados.memorial || "Memorial descritivo gerado pela IA.");
  
  // Quebrar texto em múltiplas linhas
  const maxWidth = pageWidth - 2 * margin;
  const lines = doc.splitTextToSize(memorialLimpo, maxWidth);
  
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
