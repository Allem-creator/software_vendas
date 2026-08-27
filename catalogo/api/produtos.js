import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return res.status(500).json({ erro: "DATABASE_URL ausente nas variáveis de ambiente." });
  }
  const sql = neon(databaseUrl);

  if (req.method === 'GET') {
    try {
      const produtos = await sql`SELECT id, nome, preco, foto, descricao, tamanhos FROM produtos ORDER BY id ASC`;
      return res.status(200).json(produtos);
    } catch (error) {
      return res.status(500).json({ erro: "Erro de execução SQL", mensagem: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { nome, preco, foto, tamanhos, descricao } = req.body || {};

      if (!nome || !preco || !foto) {
        return res.status(400).json({ erro: "Campos obrigatórios: nome, preco, foto." });
      }

      const [novo] = await sql`
        INSERT INTO produtos (nome, preco, foto, tamanhos, descricao)
        VALUES (${nome}, ${preco}, ${foto}, ${tamanhos || null}, ${descricao || null})
        RETURNING id, nome, preco, foto, tamanhos, descricao
      `;

      return res.status(201).json(novo);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao cadastrar produto", mensagem: error.message });
    }
  }

  return res.status(405).json({ erro: 'Método não permitido' });
}