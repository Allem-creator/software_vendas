// Middleware da Vercel: intercepta requisições antes de carregar a página
export const config = {
  // Define quais rotas devem passar pela validação do admin
  matcher: [
    '/admin.html',
    '/api/produtos/:path*' // Se quiser proteger mutating endpoints na API
  ],
};

async function verificarToken(token, secret) {
  if (!token || !secret) return false;
  const partes = token.split('.');
  if (partes.length !== 2) return false;
  const [expStr, assinatura] = partes;

  const exp = parseInt(expStr, 10);
  if (isNaN(exp) || Date.now() > exp) return false;

  const encoder = new TextEncoder();
  const chave = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const bufferAssinatura = await crypto.subtle.sign('HMAC', chave, encoder.encode(expStr));
  const assinaturaCalculada = Array.from(new Uint8Array(bufferAssinatura))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return assinaturaCalculada === assinatura;
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const metodo = request.method;

  // Permite que clientes façam GET para listar os produtos normalmente no catálogo
  if (url.pathname.startsWith('/api/produtos') && metodo === 'GET') {
    return;
  }

  const secret = process.env.AUTH_SECRET;
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/session=([^;]+)/);
  const token = match ? decodeURIComponent(match[1]) : null;

  const valido = await verificarToken(token, secret);

  if (!valido) {
    // Se for uma chamada de API (POST/DELETE), retorna erro 401 JSON em vez de redirecionar página
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ mensagem: 'Não autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Se estiver tentando acessar o admin.html sem login, redireciona para o login
    const loginUrl = new URL('/login.html', request.url);
    return Response.redirect(loginUrl, 302);
  }
}