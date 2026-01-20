import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/dashboard");
    } else {
      // Redirecionar para página de vendas se não estiver logado
      redirect("/vendas");
    }
  } catch {
    // Se não houver configuração do Supabase, redireciona para vendas
    redirect("/vendas");
  }
}
