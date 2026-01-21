export const metadata = {
  title: "Política de Privacidade",
};

export default function PrivacidadePage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Política de Privacidade</h1>
      <p className="mt-4 text-muted-foreground">
        Esta política descreve como o EngenhaAI coleta e utiliza informações para operar a plataforma.
      </p>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Dados que podemos coletar</h2>
        <p>
          Dados de conta (nome, e-mail), dados de cobrança (processados pela Cakto), e dados enviados por você para
          geração de documentos (arquivos, descrições e observações).
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Como usamos os dados</h2>
        <p>
          Usamos os dados para autenticação, geração de documentos, suporte, melhoria do produto e métricas de uso.
          Eventos de marketing (ex.: cliques em CTA) podem ser registrados quando configurado.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Armazenamento e segurança</h2>
        <p>
          Utilizamos Supabase para autenticação, banco e armazenamento. Adotamos boas práticas de segurança e
          minimização de acesso. Recomendamos não enviar informações desnecessárias.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Contato</h2>
        <p>
          Para dúvidas, solicitação de remoção de dados ou suporte, entre em contato pelo e-mail informado no site.
        </p>
      </section>
    </main>
  );
}

