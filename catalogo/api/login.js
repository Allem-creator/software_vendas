// Arquivo: api/login.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ mensagem: 'Método não permitido' });
  }

  const { email, senha } = req.body;

  // Credenciais salvas nas Variáveis de Ambiente da Vercel (ou valores padrão)
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@sualoja.com';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
  const AUTH_SECRET = process.env.AUTH_SECRET || 'sua-chave-secreta-super-segura';

  if (email === ADMIN_EMAIL && senha === ADMIN_PASSWORD) {
    // Validade de 24 horas
    const expStr = (Date.now() + 24 * 60 * 60 * 1000).toString();

    // Gera a assinatura HMAC compatível com o middleware
    const encoder = new TextEncoder();
    const chave = await crypto.subtle.importKey(
      'raw',
      encoder.encode(AUTH_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const buffer = await crypto.subtle.sign('HMAC', chave, encoder.encode(expStr));
    const assinatura = Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const token = `${expStr}.${assinatura}`;

    // Grava o Cookie de Sessão no navegador
    res.setHeader(
      'Set-Cookie',
      `session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
    );

    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
}