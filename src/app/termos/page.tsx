export const metadata = {
  title: "Termos de Uso",
};

export default function TermosPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Termos de Uso</h1>
      <p className="mt-4 text-muted-foreground">
        Ao utilizar o EngenhaAI, você concorda com estes termos.
      </p>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Uso da plataforma</h2>
        <p>
          A plataforma auxilia na elaboração de documentos e análises, mas não substitui a responsabilidade técnica do
          profissional. Todo material deve ser revisado antes de protocolo/uso.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Conta e pagamentos</h2>
        <p>
          O acesso pode depender do plano contratado. Pagamentos e assinaturas são processados pela Cakto. O plano pode
          ser atualizado automaticamente via webhook após confirmação.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Limitações</h2>
        <p>
          Não garantimos aprovação em órgãos públicos, pois isso depende de normas locais e análise do órgão competente.
          A plataforma pode evoluir e alterar funcionalidades ao longo do tempo.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Contato</h2>
        <p>
          Para suporte e solicitações, utilize o canal de contato informado no site.
        </p>
      </section>
    </main>
  );
}

