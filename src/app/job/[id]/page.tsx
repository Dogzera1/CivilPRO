"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Processo, Job } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, FileText, Image as ImageIcon, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

const tipoLabels: Record<string, string> = {
  regularizacao: "Regularização",
  orcamento: "Orçamento",
  planta_complementar: "Planta Complementar",
  laudo: "Laudo Técnico",
  conformidade: "Conformidade Urbanística",
};

export default function ProcessoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const processoId = params.id as string;
  const supabase = createClient();
  
  const [processo, setProcesso] = useState<Processo | null>(null);
  const [loading, setLoading] = useState(true);
  const [dadosProcessados, setDadosProcessados] = useState<any>(null);

  useEffect(() => {
    const loadJob = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", processoId)
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        console.error("Erro ao carregar processo:", error);
        router.push("/dashboard");
        return;
      }

      setProcesso(data);

      // Parse dos dados processados (estão em observacoes como JSON)
      if (data.observacoes) {
        try {
          const parsed = JSON.parse(data.observacoes);
          setDadosProcessados(parsed);
        } catch (e) {
          // Se não for JSON válido, pode ser apenas texto
          console.warn("Observações não são JSON válido:", e);
        }
      }

      setLoading(false);
    };

    loadJob();
  }, [processoId, router, supabase]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando detalhes do processo...</p>
      </div>
    );
  }

  if (!processo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">Processo não encontrado</p>
          <Link href="/dashboard">
            <Button>Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-xl font-bold">CivilAI Pro</h1>
          <div></div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold">{tipoLabels[processo.tipo]}</h2>
            <Badge variant={processo.status === "concluido" ? "default" : "secondary"}>
              {processo.status === "concluido" ? (
                <>
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Concluído
                </>
              ) : (
                <>
                  <AlertCircle className="mr-1 h-3 w-3" />
                  {processo.status}
                </>
              )}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Criado em {formatDate(processo.created_at)}
          </p>
        </div>

        <div className="space-y-6">
          {/* Informações do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {processo.cliente_nome && (
                <p><strong>Nome:</strong> {processo.cliente_nome}</p>
              )}
              {processo.cliente_email && (
                <p><strong>Email:</strong> {processo.cliente_email}</p>
              )}
              {processo.cliente_telefone && (
                <p><strong>Telefone:</strong> {processo.cliente_telefone}</p>
              )}
              {processo.endereco_obra && (
                <p><strong>Endereço da Obra:</strong> {processo.endereco_obra}</p>
              )}
              {processo.cidade && (
                <p><strong>Cidade:</strong> {processo.cidade}</p>
              )}
            </CardContent>
          </Card>

          {/* Arquivos Enviados */}
          {processo.arquivos_upload && processo.arquivos_upload.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Arquivos Enviados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {processo.arquivos_upload.map((url, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex-1 truncate"
                      >
                        {url.split("/").pop()}
                      </a>
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resultados do Processamento */}
          {processo.status === "concluido" && dadosProcessados && (
            <Card>
              <CardHeader>
                <CardTitle>Resultados do Processamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {processo.tipo === "regularizacao" && (
                  <>
                    {dadosProcessados.area_total && (
                      <div>
                        <p className="text-sm text-muted-foreground">Área Total</p>
                        <p className="text-lg font-semibold">{dadosProcessados.area_total} m²</p>
                      </div>
                    )}
                    {dadosProcessados.area_construida && (
                      <div>
                        <p className="text-sm text-muted-foreground">Área Construída</p>
                        <p className="text-lg font-semibold">{dadosProcessados.area_construida} m²</p>
                      </div>
                    )}
                    {dadosProcessados.recuos && Object.keys(dadosProcessados.recuos).length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Recuos</p>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(dadosProcessados.recuos).map(([key, value]) => (
                            <div key={key} className="p-2 bg-muted rounded">
                              <p className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, " ")}</p>
                              <p className="font-semibold">{value as number} m</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {dadosProcessados.memorial && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Memorial Descritivo</p>
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm whitespace-pre-wrap">{dadosProcessados.memorial}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {processo.tipo === "orcamento" && (
                  <>
                    {dadosProcessados.quantidade_aco && (
                      <div>
                        <p className="text-sm text-muted-foreground">Quantidade de Aço</p>
                        <p className="text-lg font-semibold">{dadosProcessados.quantidade_aco} kg</p>
                      </div>
                    )}
                    {dadosProcessados.quantidade_concreto && (
                      <div>
                        <p className="text-sm text-muted-foreground">Quantidade de Concreto</p>
                        <p className="text-lg font-semibold">{dadosProcessados.quantidade_concreto} m³</p>
                      </div>
                    )}
                    {dadosProcessados.valor_total && (
                      <div>
                        <p className="text-sm text-muted-foreground">Valor Total Estimado</p>
                        <p className="text-2xl font-bold text-primary">
                          R$ {dadosProcessados.valor_total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    )}
                    {dadosProcessados.detalhamento && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Detalhamento</p>
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm whitespace-pre-wrap">{dadosProcessados.detalhamento}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Botões para gerar PDF e Excel */}
                <div className="pt-4 border-t space-y-2">
                  {/* PDF */}
                  {processo.resultado_pdf ? (
                    <a href={processo.resultado_pdf} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full">
                        <FileText className="mr-2 h-4 w-4" />
                        Baixar PDF
                      </Button>
                    </a>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={async () => {
                        setLoading(true);
                        try {
                          const response = await fetch(`/api/processo/${processoId}/gerar-pdf`, {
                            method: "POST",
                          });
                          const data = await response.json();
                          if (data.sucesso) {
                            window.location.reload();
                          } else {
                            alert(`Erro ao gerar PDF: ${data.erro}`);
                            setLoading(false);
                          }
                        } catch (error: any) {
                          alert(`Erro ao gerar PDF: ${error.message}`);
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Gerando PDF...
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          Gerar PDF
                        </>
                      )}
                    </Button>
                  )}

                  {/* Excel (apenas para orçamento) */}
                  {processo.tipo === "orcamento" && (
                    processo.resultado_excel ? (
                      <a href={processo.resultado_excel} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Baixar Excel
                        </Button>
                      </a>
                    ) : (
                      <Button 
                        variant="outline"
                        className="w-full" 
                        onClick={async () => {
                          setLoading(true);
                          try {
                            const response = await fetch(`/api/processo/${processoId}/gerar-excel`, {
                              method: "POST",
                            });
                            const data = await response.json();
                            if (data.sucesso) {
                              window.location.reload();
                            } else {
                              alert(`Erro ao gerar Excel: ${data.erro}`);
                              setLoading(false);
                            }
                          } catch (error: any) {
                            alert(`Erro ao gerar Excel: ${error.message}`);
                            setLoading(false);
                          }
                        }}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Gerando Excel...
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Gerar Excel
                          </>
                        )}
                      </Button>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status de Erro */}
          {processo.status === "erro" && (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Erro no Processamento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{processo.observacoes || "Erro desconhecido"}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
