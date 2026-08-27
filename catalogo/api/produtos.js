import { pg } from '@vercel/postgres'; // ou crie a conexão usando a lib 'pg'

export default async function handler(req, res) {
  try {
    // Busca os produtos direto do PostgreSQL (Neon)
    const { rows } = await pg`SELECT id, nome, preco, foto FROM produtos ORDER BY id ASC`;
    
    // Retorna a lista formatada para o seu JS
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}