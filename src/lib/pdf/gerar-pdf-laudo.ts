/**
 * Geração de PDF para Laudos Técnicos
 */

import jsPDF from "jspdf";
import { limparMarkdown } from "./limpar-markdown";

export interface DadosLaudo {
  cliente_nome?: string;
  endereco_obra?: string;
  cidade?: string;
  objetivo?: string;
  metodologia?: string;
  analise?: string;
  conclusoes?: string;
  recomendacoes?: string;
  laudo_completo?: string;
}

export function gerarPDFLaudo(dados: DadosLaudo): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = margin;

  // Cabeçalho
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("LAUDO TÉCNICO", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 10;

  // Linha divisória
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Informações do Projeto
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("INFORMAÇÕES DO PROJETO", margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  if (dados.cliente_nome) {
    doc.text(`Cliente: ${dados.cliente_nome}`, margin, yPosition);
    yPosition += 6;
  }
  
  if (dados.endereco_obra) {
    doc.text(`Endereço: ${dados.endereco_obra}`, margin, yPosition);
    yPosition += 6;
  }
  
  if (dados.cidade) {
    doc.text(`Cidade: ${dados.cidade}`, margin, yPosition);
    yPosition += 6;
  }

  yPosition += 5;

  // Objetivo
  if (dados.objetivo) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("OBJETIVO", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const objetivoLimpo = limparMarkdown(dados.objetivo);
    const objetivoLines = doc.splitTextToSize(objetivoLimpo, pageWidth - 2 * margin);
    doc.text(objetivoLines, margin, yPosition);
    yPosition += objetivoLines.length * 6 + 5;
  }

  // Metodologia
  if (dados.metodologia) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("METODOLOGIA", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const metodologiaLimpa = limparMarkdown(dados.metodologia);
    const metodologiaLines = doc.splitTextToSize(metodologiaLimpa, pageWidth - 2 * margin);
    doc.text(metodologiaLines, margin, yPosition);
    yPosition += metodologiaLines.length * 6 + 5;
  }

  // Análise Técnica
  if (dados.analise) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("ANÁLISE TÉCNICA", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const analiseLimpa = limparMarkdown(dados.analise);
    const analiseLines = doc.splitTextToSize(analiseLimpa, pageWidth - 2 * margin);
    doc.text(analiseLines, margin, yPosition);
    yPosition += analiseLines.length * 6 + 5;
  }

  // Conclusões
  if (dados.conclusoes) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("CONCLUSÕES", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const conclusoesLimpas = limparMarkdown(dados.conclusoes);
    const conclusoesLines = doc.splitTextToSize(conclusoesLimpas, pageWidth - 2 * margin);
    doc.text(conclusoesLines, margin, yPosition);
    yPosition += conclusoesLines.length * 6 + 5;
  }

  // Recomendações
  if (dados.recomendacoes) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("RECOMENDAÇÕES", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const recomendacoesLimpas = limparMarkdown(dados.recomendacoes);
    const recomendacoesLines = doc.splitTextToSize(recomendacoesLimpas, pageWidth - 2 * margin);
    doc.text(recomendacoesLines, margin, yPosition);
    yPosition += recomendacoesLines.length * 6 + 5;
  }

  // Laudo Completo (se fornecido e diferente dos campos individuais)
  if (dados.laudo_completo && !dados.analise) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("LAUDO COMPLETO", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const laudoLimpo = limparMarkdown(dados.laudo_completo);
    const laudoLines = doc.splitTextToSize(laudoLimpo, pageWidth - 2 * margin);
    doc.text(laudoLines, margin, yPosition);
  }

  // Rodapé
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
    doc.text(
      `CivilAI Pro - Laudo Técnico`,
      pageWidth - margin,
      doc.internal.pageSize.getHeight() - 10,
      { align: "right" }
    );
  }

  return doc;
}
