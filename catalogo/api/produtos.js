import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  try {
    // Busca a variável de conexão entre as possíveis opções geradas pela Vercel/Neon
    const databaseUrl = 
      process.env.POSTGRES_URL || 
      process.env.DATABASE_URL || 
      process.env.NEON_DATABASE_URL ||
      process.env.ARMAZENAR_URL;

    if (!databaseUrl) {
      return res.status(500).json({ 
        erro: "Variável de ambiente ausente", 
        solucao: "Verifique se o banco de dados Neon está conectado na aba Storage do projeto na Vercel." 
      });
    }

    const sql = neon(databaseUrl);
    const produtos = await sql`SELECT id, nome, preco, foto FROM produtos ORDER BY id ASC`;

    return res.status(200).json(produtos);
  } catch (error) {
    // Retorna a mensagem de erro exata do PostgreSQL/Neon para o navegador
    return res.status(500).json({ 
      erro: "Falha na consulta ao banco de dados", 
      detalhe: error.message 
    });
  }
}