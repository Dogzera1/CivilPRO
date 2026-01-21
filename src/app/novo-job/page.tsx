"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { UploadZone } from "@/components/upload-zone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TipoProcesso, JobType } from "@/types";
import { ArrowLeft, Loader2, FileText, Image, FileCheck, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function NovoProcessoPage() {
  const [tipo, setTipo] = useState<TipoProcesso>("regularizacao");
  const [subtipoPlanta, setSubtipoPlanta] = useState<"eletrica" | "hidraulica">("eletrica");
  const [subtipoLaudo, setSubtipoLaudo] = useState<
    | "reurb"
    | "memorial_nbr_13153"
    | "habitabilidade_habite_se"
    | "parecer_estrutura_conformidade"
    | "vistoria_levantamento_predial"
    | "avaliacao_imovel_nbr_14653"
    | "levantamento_topografico_georreferenciamento"
    | "art_suporte"
    | "projeto_residencial_nbr_12721"
  >("vistoria_levantamento_predial");
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    cliente_nome: "",
    cliente_email: "",
    cliente_telefone: "",
    endereco_obra: "",
    cidade: "",
    observacoes: "",
  });
  const [processing, setProcessing] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    // Verificar limite do plano e buscar dados do usuário
    const { data: userData } = await supabase
      .from("users")
      .select("plano, jobs_mes_atual, updated_at")
      .eq("id", user.id)
      .single();

    if (userData) {
      const plano = userData.plano || "free";
      const usado = userData.jobs_mes_atual || 0;
      const limite = plano === "free" ? 5 : Infinity;

      if (usado >= limite && limite !== Infinity) {
        alert(`Você atingiu o limite do plano ${plano} (${limite} processos/mês). Faça upgrade para criar mais processos.`);
        setProcessing(false);
        return;
      }
    }

    // Upload dos arquivos para Supabase Storage
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from("uploads")
        .upload(fileName, file);

      if (error) {
        console.error("Erro no upload:", error);
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("uploads").getPublicUrl(fileName);
      uploadedUrls.push(publicUrl);
    }

    // Criar processo no banco
    const { data: processo, error } = await supabase
      .from("jobs")
      .insert({
        user_id: user.id,
        tipo,
        status: "pendente",
        cliente_nome: formData.cliente_nome || null,
        cliente_email: formData.cliente_email || null,
        cliente_telefone: formData.cliente_telefone || null,
        endereco_obra: formData.endereco_obra || null,
        cidade: formData.cidade || null,
        arquivos_upload: uploadedUrls,
        observacoes: formData.observacoes || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar processo:", error);
      setProcessing(false);
      return;
    }

    // Incrementar contador de processos do mês
    if (userData) {
      const agora = new Date();
      const ultimaAtualizacao = new Date(userData.updated_at);
      const mesAtual = agora.getMonth();
      const anoAtual = agora.getFullYear();
      const ultimoMes = ultimaAtualizacao.getMonth();
      const ultimoAno = ultimaAtualizacao.getFullYear();

      if (mesAtual !== ultimoMes || anoAtual !== ultimoAno) {
        // Resetar contador se mudou o mês
        await supabase
          .from("users")
          .update({ jobs_mes_atual: 1 })
          .eq("id", user.id);
      } else {
        // Incrementar contador
        await supabase
          .from("users")
          .update({ jobs_mes_atual: (userData.jobs_mes_atual || 0) + 1 })
          .eq("id", user.id);
      }
    }

    // Processar com IA
    await processarComIA(processo.id, uploadedUrls, tipo);

    router.push("/dashboard");
  };

  const processarComIA = async (
    processoId: string,
    fileUrls: string[],
    tipo: TipoProcesso
  ) => {
    try {
      // Atualizar status para processando
      await supabase
        .from("jobs")
        .update({ status: "processando" })
        .eq("id", processoId);

      console.log("[Job] Chamando API de IA...");

      // Chamar API route do servidor
      const response = await fetch("/api/ia/processar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo,
          fileUrls,
          subtipo:
            tipo === "planta_complementar"
              ? subtipoPlanta
              : tipo === "laudo"
              ? subtipoLaudo
              : undefined,
          dadosCliente: {
            cliente_nome: formData.cliente_nome,
            endereco: formData.endereco_obra,
            cidade: formData.cidade,
            observacoes: formData.observacoes,
          },
        }),
      });

      if (!response.ok) {
        // Tentar ler a mensagem de erro da resposta
        let errorMessage = `Erro na API: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.erro || errorData.error || errorMessage;
          console.error("[Job] Erro da API:", errorData);
        } catch (e) {
          const errorText = await response.text();
          console.error("[Job] Erro da API (texto):", errorText);
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const { dados, erro } = await response.json();

      if (erro) {
        console.error("[Job] Erro retornado pela API:", erro);
        throw new Error(erro);
      }

      console.log("[Job] Resultado da IA:", dados);

      // Preparar dados para salvar
      const dadosExtrados: any = {};
      
      if (tipo === "regularizacao") {
        dadosExtrados.area_total = dados.area_total || 0;
        dadosExtrados.area_construida = dados.area_construida || 0;
        dadosExtrados.recuos = dados.recuos || {};
        dadosExtrados.memorial = dados.memorial || "";
        dadosExtrados.taxa_ocupacao = dados.taxa_ocupacao;
        dadosExtrados.pavimentos = dados.pavimentos;
        dadosExtrados.tipo_edificacao = dados.tipo_edificacao;
        dadosExtrados.conformidade = dados.conformidade;
      } else if (tipo === "orcamento") {
        dadosExtrados.quantidade_aco = dados.quantidade_aco || 0;
        dadosExtrados.quantidade_concreto = dados.quantidade_concreto || 0;
        dadosExtrados.quantidade_blocos = dados.quantidade_blocos;
        dadosExtrados.quantidade_telhas = dados.quantidade_telhas;
        dadosExtrados.quantidade_portas = dados.quantidade_portas;
        dadosExtrados.quantidade_janelas = dados.quantidade_janelas;
        dadosExtrados.pontos_eletricos = dados.pontos_eletricos;
        dadosExtrados.pontos_hidraulicos = dados.pontos_hidraulicos;
        dadosExtrados.area_construida = dados.area_construida;
        dadosExtrados.valor_total = dados.valor_total || 0;
        dadosExtrados.detalhamento = dados.detalhamento || "";
        dadosExtrados.quantitativos = dados.quantitativos;
        dadosExtrados.cronograma = dados.cronograma;
      } else {
        // Para outros tipos, salvar todos os dados retornados
        Object.assign(dadosExtrados, dados);
      }

      // Atualizar processo com resultado
      await supabase
        .from("jobs")
        .update({
          status: "concluido",
          resultado_pdf: null, // Será gerado depois
          resultado_excel: null, // Será gerado depois
          observacoes: JSON.stringify(dadosExtrados), // Salvar dados da IA
        })
        .eq("id", processoId);

      console.log("[Job] Processamento concluído com sucesso!");
    } catch (error: any) {
      console.error("[Job] Erro no processamento:", error);
      await supabase
        .from("jobs")
        .update({
          status: "erro",
          observacoes: `Erro: ${error.message}`,
        })
        .eq("id", processoId);
    }
  };

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
          <h2 className="text-3xl font-bold">Novo Processo</h2>
          <p className="text-muted-foreground">
            Crie um novo processo de engenharia
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tipo de Processo</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={tipo} onValueChange={(v) => setTipo(v as JobType)}>
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
                  <TabsTrigger value="regularizacao">Regularização</TabsTrigger>
                  <TabsTrigger value="orcamento">Orçamento</TabsTrigger>
                  <TabsTrigger value="planta_complementar">
                    Planta Complementar
                  </TabsTrigger>
                  <TabsTrigger value="laudo">Laudo</TabsTrigger>
                  <TabsTrigger value="conformidade">Conformidade</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {/* Seleção de subtipo para plantas complementares */}
              {tipo === "planta_complementar" && (
                <div className="mt-4 space-y-2">
                  <Label htmlFor="subtipo">Tipo de Planta Complementar</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="subtipo"
                        value="eletrica"
                        checked={subtipoPlanta === "eletrica"}
                        onChange={(e) => setSubtipoPlanta(e.target.value as "eletrica" | "hidraulica")}
                        className="w-4 h-4"
                      />
                      <span>Elétrica</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="subtipo"
                        value="hidraulica"
                        checked={subtipoPlanta === "hidraulica"}
                        onChange={(e) => setSubtipoPlanta(e.target.value as "eletrica" | "hidraulica")}
                        className="w-4 h-4"
                      />
                      <span>Hidráulica</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Seleção de subtipo para laudos */}
              {tipo === "laudo" && (
                <div className="mt-4 space-y-2">
                  <Label>Subtipo do Laudo</Label>
                  <select
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    value={subtipoLaudo}
                    onChange={(e) => setSubtipoLaudo(e.target.value as any)}
                  >
                    <option value="reurb">Laudo REURB (Regularização Fundiária)</option>
                    <option value="memorial_nbr_13153">Memorial Descritivo (NBR 13153)</option>
                    <option value="habitabilidade_habite_se">Habitabilidade / Habite-se</option>
                    <option value="parecer_estrutura_conformidade">Parecer Estrutural e Conformidade</option>
                    <option value="vistoria_levantamento_predial">Vistoria e Levantamento Predial</option>
                    <option value="avaliacao_imovel_nbr_14653">Avaliação de Imóvel (NBR 14653)</option>
                    <option value="levantamento_topografico_georreferenciamento">Topografia e Georreferenciamento</option>
                    <option value="art_suporte">ART (Guia de preenchimento)</option>
                    <option value="projeto_residencial_nbr_12721">Projeto Residencial (NBR 12721)</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    A IA vai usar um prompt específico do subtipo escolhido. A saída é sempre texto puro (sem markdown).
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload de Arquivos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Informações sobre arquivos necessários */}
              <Alert>
                <FileCheck className="h-4 w-4" />
                <AlertTitle>Arquivos Necessários</AlertTitle>
                <AlertDescription className="mt-2 space-y-2">
                  {tipo === "regularizacao" && (
                    <>
                      <p className="font-semibold">Para Regularização, você precisa:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><strong>Planta Baixa</strong> (PDF, JPG ou PNG) - Obrigatório</li>
                        <li><strong>Fotos da Obra</strong> (JPG ou PNG) - Recomendado (mínimo 2 fotos)</li>
                        <li><strong>Documentos</strong> (PDF) - Opcional (matrícula, escritura, etc.)</li>
                      </ul>
                      <p className="text-xs text-muted-foreground mt-2">
                        📋 Formatos aceitos: PDF, JPG, PNG | Máximo: 5 arquivos | Tamanho máximo: 10MB por arquivo
                      </p>
                    </>
                  )}
                  {tipo === "orcamento" && (
                    <>
                      <p className="font-semibold">Para Orçamento, você precisa:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><strong>Plantas Arquitetônicas</strong> (PDF, JPG ou PNG) - Obrigatório</li>
                        <li><strong>Plantas Estruturais</strong> (PDF, JPG ou PNG) - Recomendado</li>
                        <li><strong>Plantas de Instalações</strong> (PDF, JPG ou PNG) - Opcional</li>
                        <li><strong>Memorial Descritivo</strong> (PDF) - Opcional</li>
                      </ul>
                      <p className="text-xs text-muted-foreground mt-2">
                        📋 Formatos aceitos: PDF, JPG, PNG | Máximo: 5 arquivos | Tamanho máximo: 10MB por arquivo
                      </p>
                    </>
                  )}
                  {tipo === "planta_complementar" && (
                    <>
                      <p className="font-semibold">
                        Para Planta Complementar {subtipoPlanta === "eletrica" ? "Elétrica" : "Hidráulica"}, você precisa:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><strong>Planta Arquitetônica Base</strong> (PDF, JPG ou PNG) - Obrigatório</li>
                        {subtipoPlanta === "eletrica" && (
                          <>
                            <li><strong>Especificações de Cargas</strong> (PDF, TXT) - Recomendado</li>
                            <li><strong>Plantas de Instalações Existentes</strong> (PDF, JPG ou PNG) - Opcional</li>
                          </>
                        )}
                        {subtipoPlanta === "hidraulica" && (
                          <>
                            <li><strong>Especificações de Pontos</strong> (PDF, TXT) - Recomendado</li>
                            <li><strong>Plantas Hidráulicas Existentes</strong> (PDF, JPG ou PNG) - Opcional</li>
                          </>
                        )}
                      </ul>
                      <p className="text-xs text-muted-foreground mt-2">
                        📋 Formatos aceitos: PDF, JPG, PNG | Máximo: 5 arquivos | Tamanho máximo: 10MB por arquivo
                      </p>
                    </>
                  )}
                  {tipo === "laudo" && (
                    <>
                      <p className="font-semibold">Para Laudo Técnico, você precisa:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><strong>Fotos da Inspeção</strong> (JPG ou PNG) - Obrigatório (mínimo 5 fotos)</li>
                        <li><strong>Plantas Existentes</strong> (PDF, JPG ou PNG) - Recomendado</li>
                        <li><strong>Documentos Legais</strong> (PDF) - Opcional (matrícula, escritura, etc.)</li>
                        <li><strong>Relatórios Anteriores</strong> (PDF) - Opcional</li>
                      </ul>
                      <p className="text-xs text-muted-foreground mt-2">
                        📋 Formatos aceitos: PDF, JPG, PNG | Máximo: 5 arquivos | Tamanho máximo: 10MB por arquivo
                      </p>
                    </>
                  )}
                  {tipo === "conformidade" && (
                    <>
                      <p className="font-semibold">Para Conformidade Urbanística, você precisa:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><strong>Planta de Localização</strong> (PDF, JPG ou PNG) - Obrigatório</li>
                        <li><strong>Planta Baixa</strong> (PDF, JPG ou PNG) - Obrigatório</li>
                        <li><strong>Fotos da Obra</strong> (JPG ou PNG) - Recomendado</li>
                        <li><strong>Código de Obras Local</strong> (PDF) - Opcional</li>
                      </ul>
                      <p className="text-xs text-muted-foreground mt-2">
                        📋 Formatos aceitos: PDF, JPG, PNG | Máximo: 5 arquivos | Tamanho máximo: 10MB por arquivo
                      </p>
                    </>
                  )}
                </AlertDescription>
              </Alert>

              {/* Zona de Upload */}
              <UploadZone
                onFilesSelected={setFiles}
                acceptedTypes={["image/*", "application/pdf"]}
                maxFiles={5}
                maxSizeMB={10}
              />

              {/* Aviso se não houver arquivos */}
              {files.length === 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Atenção</AlertTitle>
                  <AlertDescription>
                    É necessário fazer upload de pelo menos 1 arquivo para criar o processo.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cliente_nome">Nome do Cliente</Label>
                  <Input
                    id="cliente_nome"
                    value={formData.cliente_nome}
                    onChange={(e) =>
                      setFormData({ ...formData, cliente_nome: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cliente_email">Email</Label>
                  <Input
                    id="cliente_email"
                    type="email"
                    value={formData.cliente_email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cliente_email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cliente_telefone">Telefone</Label>
                  <Input
                    id="cliente_telefone"
                    value={formData.cliente_telefone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cliente_telefone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) =>
                      setFormData({ ...formData, cidade: e.target.value })
                    }
                    placeholder="Ex: Perdizes-MG"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco_obra">Endereço da Obra</Label>
                <Input
                  id="endereco_obra"
                  value={formData.endereco_obra}
                  onChange={(e) =>
                    setFormData({ ...formData, endereco_obra: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <textarea
                  id="observacoes"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.observacoes}
                  onChange={(e) =>
                    setFormData({ ...formData, observacoes: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/dashboard">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={processing || files.length === 0}>
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Criar e Processar"
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}


