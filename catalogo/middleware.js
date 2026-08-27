export const config = {
  matcher: ['/admin.html', '/api/produtos/:path*'],
};

async function verificarToken(token, secret) {
  if (!token) return false;
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
}

export default async function middleware(request) {
  const url = new URL(request.url);

  // Permite GET público para ver produtos na loja
  if (url.pathname.startsWith('/api/produtos') && request.method === 'GET') {
    return;
  }

  const secret = process.env.AUTH_SECRET || 'sua-chave-secreta-super-segura';

  // Leitura nativa de Cookies da Vercel Edge
  const cookieObj = request.cookies.get('session');
  const token = typeof cookieObj === 'object' ? cookieObj?.value : cookieObj;

  const valido = await verificarToken(token, secret);

  if (!valido) {
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ mensagem: 'Não autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return Response.redirect(new URL('/login.html', request.url), 302);
  }
}