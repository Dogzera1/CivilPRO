"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TipoProcesso } from "@/types";
import { Save, X } from "lucide-react";

interface DadosManuais {
  // Regularização
  area_total?: number;
  area_construida?: number;
  recuos?: {
    frontal?: number;
    lateral_esquerda?: number;
    lateral_direita?: number;
    fundos?: number;
  };
  pavimentos?: number;
  tipo_edificacao?: string;
  
  // Orçamento
  quantidade_aco?: number;
  quantidade_concreto?: number;
  quantidade_blocos?: number;
  quantidade_telhas?: number;
  quantidade_portas?: number;
  quantidade_janelas?: number;
  pontos_eletricos?: number;
  pontos_hidraulicos?: number;
  valor_total?: number;
  
  // Plantas Complementares
  cargas_por_ambiente?: Array<{
    ambiente: string;
    iluminacao_va?: number;
    tug_quantidade?: number;
    tue_quantidade?: number;
  }>;
  circuitos?: Array<{
    numero: number;
    tipo: string;
    potencia_va?: number;
    protecao_a?: number;
    condutor_mm2?: number;
  }>;
  demanda_total?: number;
  
  // Laudo
  objetivo?: string;
  metodologia?: string;
  analise?: string;
  conclusoes?: string;
  recomendacoes?: string;
  
  // Conformidade
  taxa_ocupacao?: {
    calculada?: number;
    permitida?: number;
  };
  recuos_conformidade?: {
    frontal?: { valor?: number; conforme?: boolean };
    lateral_esquerda?: { valor?: number; conforme?: boolean };
    lateral_direita?: { valor?: number; conforme?: boolean };
    fundos?: { valor?: number; conforme?: boolean };
  };
  conformidade_geral?: boolean;
}

interface FormularioDadosManuaisProps {
  tipo: TipoProcesso;
  dadosExistentes?: any;
  onSave: (dados: DadosManuais) => Promise<void>;
  onCancel: () => void;
}

export function FormularioDadosManuais({
  tipo,
  dadosExistentes,
  onSave,
  onCancel,
}: FormularioDadosManuaisProps) {
  const [dados, setDados] = useState<DadosManuais>(dadosExistentes || {});
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (dadosExistentes) {
      setDados(dadosExistentes);
    }
  }, [dadosExistentes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    try {
      await onSave(dados);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preencher Dados Manualmente</CardTitle>
        <p className="text-sm text-muted-foreground">
          Complete os dados que a IA não conseguiu extrair com precisão
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {tipo === "regularizacao" && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="area_total">Área Total do Terreno (m²)</Label>
                  <Input
                    id="area_total"
                    type="number"
                    step="0.01"
                    value={dados.area_total || ""}
                    onChange={(e) =>
                      setDados({ ...dados, area_total: parseFloat(e.target.value) || undefined })
                    }
                    placeholder="Ex: 200.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area_construida">Área Construída (m²)</Label>
                  <Input
                    id="area_construida"
                    type="number"
                    step="0.01"
                    value={dados.area_construida || ""}
                    onChange={(e) =>
                      setDados({ ...dados, area_construida: parseFloat(e.target.value) || undefined })
                    }
                    placeholder="Ex: 120.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pavimentos">Número de Pavimentos</Label>
                  <Input
                    id="pavimentos"
                    type="number"
                    value={dados.pavimentos || ""}
                    onChange={(e) =>
                      setDados({ ...dados, pavimentos: parseInt(e.target.value) || undefined })
                    }
                    placeholder="Ex: 1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo_edificacao">Tipo de Edificação</Label>
                  <Input
                    id="tipo_edificacao"
                    value={dados.tipo_edificacao || ""}
                    onChange={(e) =>
                      setDados({ ...dados, tipo_edificacao: e.target.value })
                    }
                    placeholder="Ex: Residencial"
                  />
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Recuos (metros)</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="recuo_frontal" className="text-xs">Frontal</Label>
                    <Input
                      id="recuo_frontal"
                      type="number"
                      step="0.01"
                      value={dados.recuos?.frontal || ""}
                      onChange={(e) =>
                        setDados({
                          ...dados,
                          recuos: {
                            ...dados.recuos,
                            frontal: parseFloat(e.target.value) || undefined,
                          },
                        })
                      }
                      placeholder="Ex: 5.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recuo_lateral_esquerda" className="text-xs">Lateral Esquerda</Label>
                    <Input
                      id="recuo_lateral_esquerda"
                      type="number"
                      step="0.01"
                      value={dados.recuos?.lateral_esquerda || ""}
                      onChange={(e) =>
                        setDados({
                          ...dados,
                          recuos: {
                            ...dados.recuos,
                            lateral_esquerda: parseFloat(e.target.value) || undefined,
                          },
                        })
                      }
                      placeholder="Ex: 3.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recuo_lateral_direita" className="text-xs">Lateral Direita</Label>
                    <Input
                      id="recuo_lateral_direita"
                      type="number"
                      step="0.01"
                      value={dados.recuos?.lateral_direita || ""}
                      onChange={(e) =>
                        setDados({
                          ...dados,
                          recuos: {
                            ...dados.recuos,
                            lateral_direita: parseFloat(e.target.value) || undefined,
                          },
                        })
                      }
                      placeholder="Ex: 3.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recuo_fundos" className="text-xs">Fundos</Label>
                    <Input
                      id="recuo_fundos"
                      type="number"
                      step="0.01"
                      value={dados.recuos?.fundos || ""}
                      onChange={(e) =>
                        setDados({
                          ...dados,
                          recuos: {
                            ...dados.recuos,
                            fundos: parseFloat(e.target.value) || undefined,
                          },
                        })
                      }
                      placeholder="Ex: 5.00"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {tipo === "orcamento" && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="quantidade_aco">Quantidade de Aço (kg)</Label>
                  <Input
                    id="quantidade_aco"
                    type="number"
                    step="0.01"
                    value={dados.quantidade_aco || ""}
                    onChange={(e) =>
                      setDados({ ...dados, quantidade_aco: parseFloat(e.target.value) || undefined })
                    }
                    placeholder="Ex: 500.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantidade_concreto">Quantidade de Concreto (m³)</Label>
                  <Input
                    id="quantidade_concreto"
                    type="number"
                    step="0.01"
                    value={dados.quantidade_concreto || ""}
                    onChange={(e) =>
                      setDados({ ...dados, quantidade_concreto: parseFloat(e.target.value) || undefined })
                    }
                    placeholder="Ex: 15.50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantidade_blocos">Quantidade de Blocos (un)</Label>
                  <Input
                    id="quantidade_blocos"
                    type="number"
                    value={dados.quantidade_blocos || ""}
                    onChange={(e) =>
                      setDados({ ...dados, quantidade_blocos: parseInt(e.target.value) || undefined })
                    }
                    placeholder="Ex: 2000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantidade_telhas">Quantidade de Telhas (un)</Label>
                  <Input
                    id="quantidade_telhas"
                    type="number"
                    value={dados.quantidade_telhas || ""}
                    onChange={(e) =>
                      setDados({ ...dados, quantidade_telhas: parseInt(e.target.value) || undefined })
                    }
                    placeholder="Ex: 500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantidade_portas">Quantidade de Portas (un)</Label>
                  <Input
                    id="quantidade_portas"
                    type="number"
                    value={dados.quantidade_portas || ""}
                    onChange={(e) =>
                      setDados({ ...dados, quantidade_portas: parseInt(e.target.value) || undefined })
                    }
                    placeholder="Ex: 8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantidade_janelas">Quantidade de Janelas (un)</Label>
                  <Input
                    id="quantidade_janelas"
                    type="number"
                    value={dados.quantidade_janelas || ""}
                    onChange={(e) =>
                      setDados({ ...dados, quantidade_janelas: parseInt(e.target.value) || undefined })
                    }
                    placeholder="Ex: 12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pontos_eletricos">Pontos Elétricos (un)</Label>
                  <Input
                    id="pontos_eletricos"
                    type="number"
                    value={dados.pontos_eletricos || ""}
                    onChange={(e) =>
                      setDados({ ...dados, pontos_eletricos: parseInt(e.target.value) || undefined })
                    }
                    placeholder="Ex: 50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pontos_hidraulicos">Pontos Hidráulicos (un)</Label>
                  <Input
                    id="pontos_hidraulicos"
                    type="number"
                    value={dados.pontos_hidraulicos || ""}
                    onChange={(e) =>
                      setDados({ ...dados, pontos_hidraulicos: parseInt(e.target.value) || undefined })
                    }
                    placeholder="Ex: 30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor_total">Valor Total Estimado (R$)</Label>
                  <Input
                    id="valor_total"
                    type="number"
                    step="0.01"
                    value={dados.valor_total || ""}
                    onChange={(e) =>
                      setDados({ ...dados, valor_total: parseFloat(e.target.value) || undefined })
                    }
                    placeholder="Ex: 150000.00"
                  />
                </div>
              </div>
            </>
          )}

          {tipo === "laudo" && (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="objetivo">Objetivo do Laudo</Label>
                  <Textarea
                    id="objetivo"
                    value={dados.objetivo || ""}
                    onChange={(e) => setDados({ ...dados, objetivo: e.target.value })}
                    placeholder="Descreva o objetivo do laudo técnico..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metodologia">Metodologia</Label>
                  <Textarea
                    id="metodologia"
                    value={dados.metodologia || ""}
                    onChange={(e) => setDados({ ...dados, metodologia: e.target.value })}
                    placeholder="Descreva a metodologia utilizada..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="analise">Análise Técnica</Label>
                  <Textarea
                    id="analise"
                    value={dados.analise || ""}
                    onChange={(e) => setDados({ ...dados, analise: e.target.value })}
                    placeholder="Descreva a análise técnica realizada..."
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conclusoes">Conclusões</Label>
                  <Textarea
                    id="conclusoes"
                    value={dados.conclusoes || ""}
                    onChange={(e) => setDados({ ...dados, conclusoes: e.target.value })}
                    placeholder="Descreva as conclusões..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recomendacoes">Recomendações</Label>
                  <Textarea
                    id="recomendacoes"
                    value={dados.recomendacoes || ""}
                    onChange={(e) => setDados({ ...dados, recomendacoes: e.target.value })}
                    placeholder="Descreva as recomendações..."
                    rows={4}
                  />
                </div>
              </div>
            </>
          )}

          {tipo === "conformidade" && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="taxa_ocupacao_calculada">Taxa de Ocupação Calculada (%)</Label>
                  <Input
                    id="taxa_ocupacao_calculada"
                    type="number"
                    step="0.01"
                    value={dados.taxa_ocupacao?.calculada || ""}
                    onChange={(e) =>
                      setDados({
                        ...dados,
                        taxa_ocupacao: {
                          ...dados.taxa_ocupacao,
                          calculada: parseFloat(e.target.value) || undefined,
                        },
                      })
                    }
                    placeholder="Ex: 60.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxa_ocupacao_permitida">Taxa de Ocupação Permitida (%)</Label>
                  <Input
                    id="taxa_ocupacao_permitida"
                    type="number"
                    step="0.01"
                    value={dados.taxa_ocupacao?.permitida || ""}
                    onChange={(e) =>
                      setDados({
                        ...dados,
                        taxa_ocupacao: {
                          ...dados.taxa_ocupacao,
                          permitida: parseFloat(e.target.value) || undefined,
                        },
                      })
                    }
                    placeholder="Ex: 70.00"
                  />
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Recuos e Conformidade</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="recuo_frontal_valor" className="text-xs">Recuo Frontal (m)</Label>
                    <Input
                      id="recuo_frontal_valor"
                      type="number"
                      step="0.01"
                      value={dados.recuos_conformidade?.frontal?.valor || ""}
                      onChange={(e) =>
                        setDados({
                          ...dados,
                          recuos_conformidade: {
                            ...dados.recuos_conformidade,
                            frontal: {
                              ...dados.recuos_conformidade?.frontal,
                              valor: parseFloat(e.target.value) || undefined,
                            },
                          },
                        })
                      }
                      placeholder="Ex: 5.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recuo_lateral_esquerda_valor" className="text-xs">Recuo Lateral Esquerda (m)</Label>
                    <Input
                      id="recuo_lateral_esquerda_valor"
                      type="number"
                      step="0.01"
                      value={dados.recuos_conformidade?.lateral_esquerda?.valor || ""}
                      onChange={(e) =>
                        setDados({
                          ...dados,
                          recuos_conformidade: {
                            ...dados.recuos_conformidade,
                            lateral_esquerda: {
                              ...dados.recuos_conformidade?.lateral_esquerda,
                              valor: parseFloat(e.target.value) || undefined,
                            },
                          },
                        })
                      }
                      placeholder="Ex: 3.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recuo_lateral_direita_valor" className="text-xs">Recuo Lateral Direita (m)</Label>
                    <Input
                      id="recuo_lateral_direita_valor"
                      type="number"
                      step="0.01"
                      value={dados.recuos_conformidade?.lateral_direita?.valor || ""}
                      onChange={(e) =>
                        setDados({
                          ...dados,
                          recuos_conformidade: {
                            ...dados.recuos_conformidade,
                            lateral_direita: {
                              ...dados.recuos_conformidade?.lateral_direita,
                              valor: parseFloat(e.target.value) || undefined,
                            },
                          },
                        })
                      }
                      placeholder="Ex: 3.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recuo_fundos_valor" className="text-xs">Recuo Fundos (m)</Label>
                    <Input
                      id="recuo_fundos_valor"
                      type="number"
                      step="0.01"
                      value={dados.recuos_conformidade?.fundos?.valor || ""}
                      onChange={(e) =>
                        setDados({
                          ...dados,
                          recuos_conformidade: {
                            ...dados.recuos_conformidade,
                            fundos: {
                              ...dados.recuos_conformidade?.fundos,
                              valor: parseFloat(e.target.value) || undefined,
                            },
                          },
                        })
                      }
                      placeholder="Ex: 5.00"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando}>
              <Save className="mr-2 h-4 w-4" />
              {salvando ? "Salvando..." : "Salvar Dados"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
