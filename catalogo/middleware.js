// middleware.js (Na raiz do projeto)
export const config = {
  matcher: ['/admin.html', '/api/produtos/:path*'],
};

async function verificarToken(token, secret) {
  try {
    if (!token || !secret) return false;
    const [expStr, assinatura] = token.split('.');
    if (!expStr || !assinatura) return false;

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
    const buffer = await crypto.subtle.sign('HMAC', chave, encoder.encode(expStr));
    const assinaturaCalculada = Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return assinaturaCalculada === assinatura;
  } catch (err) {
    return false;
  }
}

export default async function middleware(request) {
  try {
    const url = new URL(request.url);

    // Permite leitura pública dos produtos no catálogo
    if (url.pathname.startsWith('/api/produtos') && request.method === 'GET') {
      return new Response(null, { headers: { 'x-middleware-next': '1' } });
    }

    const secret = process.env.AUTH_SECRET || 'sua-chave-secreta-super-segura';

    // Extração segura de cookies via Web Standard Header
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/session=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : null;

    const valido = await verificarToken(token, secret);

    if (valido) {
      // Autorizado: permite que a Vercel sirva a página solicitada
      return new Response(null, { headers: { 'x-middleware-next': '1' } });
    }

    // Não autorizado: API retorna JSON 401; Página HTML redireciona para login
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ mensagem: 'Não autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return Response.redirect(new URL('/login.html', request.url), 302);
  } catch (erro) {
    // Evita Erro 500 direcionando para a tela de login em falhas inesperadas
    return Response.redirect(new URL('/login.html', request.url), 302);
  }
}