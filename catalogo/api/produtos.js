import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  try {
    // Procura a URL do banco criada pela integração da Vercel/Neon
    const databaseUrl = 
      process.env.POSTGRES_URL || 
      process.env.DATABASE_URL || 
      process.env.NEON_DATABASE_URL ||
      process.env.ARMAZENAR_URL; // Caso tenha criado com o prefixo ARMAZENAR no passo anterior

    if (!databaseUrl) {
      return res.status(500).json({ 
        error: "Erro de Configuração: Nenhuma variável de ambiente de banco de dados foi encontrada na Vercel." 
      });
    }

    const sql = neon(databaseUrl);
    
    // Consulta a tabela de produtos
    const produtos = await sql`SELECT id, nome, preco, foto FROM produtos ORDER BY id ASC`;

    return res.status(200).json(produtos);
  } catch (error) {
    return res.status(500).json({ 
      error: "Erro na consulta ao banco", 
      details: error.message 
    });
  }
}