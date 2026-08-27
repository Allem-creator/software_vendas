import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ mensagem: 'Método não permitido' });
  }

  const { email, senha } = req.body || {};

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@sualoja.com';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
  const AUTH_SECRET = process.env.AUTH_SECRET || 'sua-chave-secreta-super-segura';

  if (email === ADMIN_EMAIL && senha === ADMIN_PASSWORD) {
    const exp = Date.now() + 24 * 60 * 60 * 1000;
    
    // Assinatura usando o pacote nativo 'crypto' do Node.js
    const hmac = crypto.createHmac('sha256', AUTH_SECRET).update(exp.toString()).digest('hex');
    const token = `${exp}.${hmac}`;

    // Configura o Cookie de Sessão
    res.setHeader(
      'Set-Cookie',
      `session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`
    );

    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
}