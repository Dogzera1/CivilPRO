import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Verificar sessão primeiro
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Se não tiver sessão, verificar usuário
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  const isAuthenticated = !!(session || user);

  // Debug logs (apenas em desenvolvimento)
  if (process.env.NODE_ENV === 'development') {
    const cookies = request.cookies.getAll();
    console.log('[Middleware] Path:', request.nextUrl.pathname);
    console.log('[Middleware] Cookies count:', cookies.length);
    console.log('[Middleware] Session:', session ? 'Presente' : 'Ausente');
    console.log('[Middleware] User:', user ? user.email : 'Não encontrado');
    console.log('[Middleware] AuthError:', authError?.message || 'Nenhum');
    console.log('[Middleware] IsAuthenticated:', isAuthenticated);
  }

  // Permitir rotas de API sem autenticação (elas verificam internamente se necessário)
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return response;
  }

  // Proteger rotas que precisam de autenticação
  // MAS permitir dashboard para que o cliente verifique a autenticação
  if (
    !isAuthenticated &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/signup") &&
    !request.nextUrl.pathname.startsWith("/confirm-email") &&
    !request.nextUrl.pathname.startsWith("/test-auth") &&
    !request.nextUrl.pathname.startsWith("/dashboard") &&
    !request.nextUrl.pathname.startsWith("/novo-processo") &&
    !request.nextUrl.pathname.startsWith("/processo/") &&
    !request.nextUrl.pathname.startsWith("/novo-job") && // Compatibilidade
    !request.nextUrl.pathname.startsWith("/job/") && // Compatibilidade
    !request.nextUrl.pathname.startsWith("/configuracoes") &&
    !request.nextUrl.pathname.startsWith("/checkout/") &&
    !request.nextUrl.pathname.startsWith("/vendas")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirecionar usuários autenticados que tentam acessar login/signup
  if (
    isAuthenticated &&
    !authError &&
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/signup"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

