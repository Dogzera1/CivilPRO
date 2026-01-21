"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ProcessoDetailRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const processoId = params.id as string;

  useEffect(() => {
    if (processoId) {
      router.replace(`/job/${processoId}`);
    }
  }, [router, processoId]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecionando...</p>
      </div>
    </div>
  );
}
