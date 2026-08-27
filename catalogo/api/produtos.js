import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;

    if (!databaseUrl) {
      return res.status(500).json({ erro: "DATABASE_URL ausente nas variáveis de ambiente." });
    }

    const sql = neon(databaseUrl);

    // Agora buscando descricao e tamanhos do banco
    const produtos = await sql`SELECT id, nome, preco, foto, descricao, tamanhos FROM produtos ORDER BY id ASC`;

    return res.status(200).json(produtos);
  } catch (error) {
    return res.status(500).json({ erro: "Erro de execução SQL", mensagem: error.message });
  }
}