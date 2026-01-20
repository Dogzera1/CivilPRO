"use client";

import { Processo, StatusProcesso, Job, JobStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ProcessoCardProps {
  processo: Processo;
  onClick?: () => void;
}

const statusConfig: Record<
  StatusProcesso,
  { label: string; variant: "default" | "secondary" | "destructive"; icon: any }
> = {
  pendente: {
    label: "Pendente",
    variant: "secondary",
    icon: Clock,
  },
  processando: {
    label: "Processando",
    variant: "default",
    icon: AlertCircle,
  },
  concluido: {
    label: "Concluído",
    variant: "default",
    icon: CheckCircle2,
  },
  erro: {
    label: "Erro",
    variant: "destructive",
    icon: XCircle,
  },
  protocolado: {
    label: "Protocolado",
    variant: "default",
    icon: FileText,
  },
  aprovado: {
    label: "Aprovado",
    variant: "default",
    icon: CheckCircle2,
  },
};

const tipoLabels: Record<string, string> = {
  regularizacao: "Regularização",
  orcamento: "Orçamento",
  planta_complementar: "Planta Complementar",
  laudo: "Laudo Técnico",
  conformidade: "Conformidade Urbanística",
};

export function ProcessoCard({ processo, onClick }: ProcessoCardProps) {
  const router = useRouter();
  const status = statusConfig[processo.status];
  const StatusIcon = status.icon;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/processo/${processo.id}`);
    }
  };

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md"
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{tipoLabels[processo.tipo]}</CardTitle>
            {processo.cliente_nome && (
              <p className="mt-1 text-sm text-muted-foreground">
                Cliente: {processo.cliente_nome}
              </p>
            )}
          </div>
          <Badge variant={status.variant} className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          {processo.endereco_obra && (
            <p className="text-muted-foreground">
              📍 {processo.endereco_obra}
              {processo.cidade && `, ${processo.cidade}`}
            </p>
          )}
          <p className="text-muted-foreground">
            Criado em {formatDate(processo.created_at)}
          </p>
          {processo.resultado_pdf && (
            <p className="text-xs text-primary">✓ PDF disponível</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Alias para compatibilidade
export const JobCard = ProcessoCard;


