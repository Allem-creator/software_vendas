export const config = {
  matcher: ['/admin.html', '/api/produtos/:path*'],
};

async function verificarToken(token, secret) {
  try {
    if (!token) return false;
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
  const url = new URL(request.url);

  // Permite acesso público para consultar produtos no catálogo
  if (url.pathname.startsWith('/api/produtos') && request.method === 'GET') {
    return new Response(null, { headers: { 'x-middleware-next': '1' } });
  }

  const secret = (process.env.AUTH_SECRET || 'sua-chave-secreta-super-segura').trim();

  // Leitura robusta do Cookie session
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|;\s*)session=([^;]*)/);
  const token = match ? decodeURIComponent(match[1]) : null;

  const valido = await verificarToken(token, secret);

  if (valido) {
    // Permite prosseguir para /admin.html
    return new Response(null, { headers: { 'x-middleware-next': '1' } });
  }

  // Redireciona se não estiver validado
  if (url.pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({ mensagem: 'Não autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return Response.redirect(new URL('/login.html', request.url), 302);
}