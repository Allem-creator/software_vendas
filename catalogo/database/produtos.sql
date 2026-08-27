-- Active: 1787834023730@@ep-flat-bird-awl5z2vh-pooler.c-12.us-east-1.aws.neon.tech@5432@neondb
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    foto TEXT NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO produtos (nome, preco, foto) VALUES
  ('Camiseta Branca Básica', 79.90, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=70&auto=format'),
  ('Calça Jeans Reta', 189.90, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=70&auto=format'),
  ('Jaqueta Jeans Oversized', 249.00, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=70&auto=format'),
  ('Vestido Midi Floral', 219.90, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=70&auto=format');

-- Adiciona as novas colunas na tabela existente
ALTER TABLE produtos 
ADD COLUMN IF NOT EXISTS descricao TEXT,
ADD COLUMN IF NOT EXISTS tamanhos VARCHAR(100);
-- Atualiza os produtos existentes com dados de exemplo
UPDATE produtos 
SET 
  descricao = 'Camiseta 100% algodão penteado, toque macio, modelagem tradicional e costura reforçada.',
  tamanhos = 'P, M, G, GG'
WHERE id = 1;

UPDATE produtos 
SET 
  descricao = 'Calça jeans masculina/feminina com corte reto, lavagem clássica e elastano para maior conforto.',
  tamanhos = '38, 40, 42, 44'
WHERE id = 2;

UPDATE produtos 
SET 
  descricao = 'Jaqueta jeans oversized moderna, com bolsos frontais funcionais e acabamento despojado.',
  tamanhos = 'P, M, G'
WHERE id = 3;

UPDATE produtos 
SET 
  descricao = 'Vestido midi em tecido leve, estampa floral exclusiva, decote em V e elástico na cintura.',
  tamanhos = 'PP, P, M, G'
WHERE id = 4;