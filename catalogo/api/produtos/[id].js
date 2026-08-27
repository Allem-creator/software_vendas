import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const { id } = req.query;

  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return res.status(500).json({ erro: "DATABASE_URL ausente nas variáveis de ambiente." });
  }
  const sql = neon(databaseUrl);

  if (req.method === 'DELETE') {
    try {
      await sql`DELETE FROM produtos WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao excluir produto", mensagem: error.message });
    }
  }

  return res.status(405).json({ erro: 'Método não permitido' });
}