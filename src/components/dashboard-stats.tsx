"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, CheckCircle2, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  totalJobs: number;
  jobsPendentes: number;
  jobsConcluidos: number;
  jobsMesAtual: number;
}

export function DashboardStats({
  totalJobs,
  jobsPendentes,
  jobsConcluidos,
  jobsMesAtual,
}: DashboardStatsProps) {
  const stats = [
    {
      title: "Total de Jobs",
      value: totalJobs,
      icon: FileText,
      description: "Todos os processos",
    },
    {
      title: "Pendentes",
      value: jobsPendentes,
      icon: Clock,
      description: "Aguardando processamento",
    },
    {
      title: "Concluídos",
      value: jobsConcluidos,
      icon: CheckCircle2,
      description: "Processos finalizados",
    },
    {
      title: "Este Mês",
      value: jobsMesAtual,
      icon: TrendingUp,
      description: "Jobs criados em janeiro",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}


