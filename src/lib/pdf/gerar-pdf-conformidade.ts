/**
 * Geração de PDF para Conformidade Urbanística
 */

import jsPDF from "jspdf";
import { limparMarkdown } from "./limpar-markdown";

export interface DadosConformidade {
  cliente_nome?: string;
  endereco_obra?: string;
  cidade?: string;
  taxa_ocupacao?: {
    calculada: number;
    permitida: number;
    conforme: boolean;
  };
  recuos?: Record<string, {
    conforme: boolean;
    valor?: number;
  }>;
  gabarito?: {
    numero_pavimentos: number;
    maximo_permitido: number;
    conforme: boolean;
  };
  coeficiente_aproveitamento?: {
    calculado: number;
    maximo_permitido: number;
    conforme: boolean;
  };
  uso_solo?: {
    uso_atual: string;
    uso_permitido: string;
    conforme: boolean;
  };
  area_permeavel?: {
    calculada: number;
    minima_obrigatoria: number;
    conforme: boolean;
  };
  vagas_estacionamento?: {
    calculadas: number;
    obrigatorias: number;
    conforme: boolean;
  };
  conformidade_geral?: boolean;
  observacoes?: string;
  relatorio_completo?: string;
}

export function gerarPDFConformidade(dados: DadosConformidade): jsPDF {
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
  doc.text("VERIFICAÇÃO DE CONFORMIDADE URBANÍSTICA", pageWidth / 2, yPosition, { align: "center" });
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

  // Conformidade Geral
  if (dados.conformidade_geral !== undefined) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("RESULTADO DA VERIFICAÇÃO", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    if (dados.conformidade_geral) {
      doc.setTextColor(0, 128, 0); // Verde
      doc.text("✓ CONFORME", margin, yPosition);
    } else {
      doc.setTextColor(255, 0, 0); // Vermelho
      doc.text("✗ NÃO CONFORME", margin, yPosition);
    }
    doc.setTextColor(0, 0, 0); // Resetar cor
    yPosition += 10;
  }

  // Taxa de Ocupação
  if (dados.taxa_ocupacao) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("TAXA DE OCUPAÇÃO", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Calculada: ${dados.taxa_ocupacao.calculada}%`, margin, yPosition);
    yPosition += 6;
    doc.text(`Permitida: ${dados.taxa_ocupacao.permitida}%`, margin, yPosition);
    yPosition += 6;
    
    doc.setFont("helvetica", "bold");
    if (dados.taxa_ocupacao.conforme) {
      doc.setTextColor(0, 128, 0);
      doc.text("Status: CONFORME", margin, yPosition);
    } else {
      doc.setTextColor(255, 0, 0);
      doc.text("Status: NÃO CONFORME", margin, yPosition);
    }
    doc.setTextColor(0, 0, 0);
    yPosition += 10;
  }

  // Recuos
  if (dados.recuos && Object.keys(dados.recuos).length > 0) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("RECUOS", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    Object.entries(dados.recuos).forEach(([key, value]) => {
      const label = key.replace(/_/g, " ").toUpperCase();
      doc.text(`${label}:`, margin, yPosition);
      
      if (value.valor !== undefined) {
        doc.text(`${value.valor}m`, margin + 50, yPosition);
      }
      
      doc.setFont("helvetica", "bold");
      if (value.conforme) {
        doc.setTextColor(0, 128, 0);
        doc.text("CONFORME", margin + 80, yPosition);
      } else {
        doc.setTextColor(255, 0, 0);
        doc.text("NÃO CONFORME", margin + 80, yPosition);
      }
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      
      yPosition += 6;
    });
    
    yPosition += 5;
  }

  // Gabarito
  if (dados.gabarito) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("GABARITO", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Número de Pavimentos: ${dados.gabarito.numero_pavimentos}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Máximo Permitido: ${dados.gabarito.maximo_permitido}`, margin, yPosition);
    yPosition += 6;
    
    doc.setFont("helvetica", "bold");
    if (dados.gabarito.conforme) {
      doc.setTextColor(0, 128, 0);
      doc.text("Status: CONFORME", margin, yPosition);
    } else {
      doc.setTextColor(255, 0, 0);
      doc.text("Status: NÃO CONFORME", margin, yPosition);
    }
    doc.setTextColor(0, 0, 0);
    yPosition += 10;
  }

  // Coeficiente de Aproveitamento
  if (dados.coeficiente_aproveitamento) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("COEFICIENTE DE APROVEITAMENTO", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Calculado: ${dados.coeficiente_aproveitamento.calculado}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Máximo Permitido: ${dados.coeficiente_aproveitamento.maximo_permitido}`, margin, yPosition);
    yPosition += 6;
    
    doc.setFont("helvetica", "bold");
    if (dados.coeficiente_aproveitamento.conforme) {
      doc.setTextColor(0, 128, 0);
      doc.text("Status: CONFORME", margin, yPosition);
    } else {
      doc.setTextColor(255, 0, 0);
      doc.text("Status: NÃO CONFORME", margin, yPosition);
    }
    doc.setTextColor(0, 0, 0);
    yPosition += 10;
  }

  // Uso do Solo
  if (dados.uso_solo) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("USO DO SOLO", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Uso Atual: ${dados.uso_solo.uso_atual}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Uso Permitido: ${dados.uso_solo.uso_permitido}`, margin, yPosition);
    yPosition += 6;
    
    doc.setFont("helvetica", "bold");
    if (dados.uso_solo.conforme) {
      doc.setTextColor(0, 128, 0);
      doc.text("Status: CONFORME", margin, yPosition);
    } else {
      doc.setTextColor(255, 0, 0);
      doc.text("Status: NÃO CONFORME", margin, yPosition);
    }
    doc.setTextColor(0, 0, 0);
    yPosition += 10;
  }

  // Área Permeável
  if (dados.area_permeavel) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("ÁREA PERMEÁVEL", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Calculada: ${dados.area_permeavel.calculada} m²`, margin, yPosition);
    yPosition += 6;
    doc.text(`Mínima Obrigatória: ${dados.area_permeavel.minima_obrigatoria} m²`, margin, yPosition);
    yPosition += 6;
    
    doc.setFont("helvetica", "bold");
    if (dados.area_permeavel.conforme) {
      doc.setTextColor(0, 128, 0);
      doc.text("Status: CONFORME", margin, yPosition);
    } else {
      doc.setTextColor(255, 0, 0);
      doc.text("Status: NÃO CONFORME", margin, yPosition);
    }
    doc.setTextColor(0, 0, 0);
    yPosition += 10;
  }

  // Vagas de Estacionamento
  if (dados.vagas_estacionamento) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("VAGAS DE ESTACIONAMENTO", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Calculadas: ${dados.vagas_estacionamento.calculadas}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Obrigatórias: ${dados.vagas_estacionamento.obrigatorias}`, margin, yPosition);
    yPosition += 6;
    
    doc.setFont("helvetica", "bold");
    if (dados.vagas_estacionamento.conforme) {
      doc.setTextColor(0, 128, 0);
      doc.text("Status: CONFORME", margin, yPosition);
    } else {
      doc.setTextColor(255, 0, 0);
      doc.text("Status: NÃO CONFORME", margin, yPosition);
    }
    doc.setTextColor(0, 0, 0);
    yPosition += 10;
  }

  // Observações
  if (dados.observacoes) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("OBSERVAÇÕES", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const observacoesLimpas = limparMarkdown(dados.observacoes);
    const observacoesLines = doc.splitTextToSize(observacoesLimpas, pageWidth - 2 * margin);
    doc.text(observacoesLines, margin, yPosition);
    yPosition += observacoesLines.length * 6 + 5;
  }

  // Relatório Completo
  if (dados.relatorio_completo) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("RELATÓRIO COMPLETO", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const relatorioLimpo = limparMarkdown(dados.relatorio_completo);
    const relatorioLines = doc.splitTextToSize(relatorioLimpo, pageWidth - 2 * margin);
    doc.text(relatorioLines, margin, yPosition);
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
      `EngenhaAI - Conformidade Urbanística`,
      pageWidth - margin,
      doc.internal.pageSize.getHeight() - 10,
      { align: "right" }
    );
  }

  return doc;
}
