import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // Permite que o frontend acesse a API sem bloqueios
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    // Procura qualquer uma das variáveis de conexão
    const databaseUrl = 
      process.env.DATABASE_URL || 
      process.env.POSTGRES_URL || 
      process.env.NEON_DATABASE_URL;

    if (!databaseUrl) {
      return res.status(500).json({ 
        sucesso: false,
        erro: "DATABASE_URL ausente nas variáveis de ambiente da Vercel." 
      });
    }

    // Inicializa a conexão com o Neon
    const sql = neon(databaseUrl);

    // Consulta SQL direta
    const produtos = await sql`SELECT id, nome, preco, foto FROM produtos ORDER BY id ASC`;

    return res.status(200).json(produtos);
  } catch (error) {
    // Captura a mensagem real de erro do Postgres sem dar crash na função
    return res.status(500).json({ 
      sucesso: false,
      erro: "Erro de execução SQL",
      mensagem: error.message 
    });
  }
}