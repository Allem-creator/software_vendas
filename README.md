# 👗 Catálogo de Vendas | Loja de Roupas Online

Sistema de catálogo online com painel administrativo, criado para uma loja de roupas. O projeto roda **100% na nuvem**: front-end e API na **Vercel** e banco de dados **PostgreSQL no Neon**.

🔗 **Demo:** https://software-vendas.vercel.app/

<img width="2430" height="1385" alt="image" src="https://github.com/user-attachments/assets/f8fa1aaa-1736-4158-bfde-4ccb59b47e7c" />


## ✨ Funcionalidades

**Vitrine (cliente)**
- Grade responsiva de produtos (de 2 a 5 colunas conforme a tela)
- Modal de detalhes com foto, preço, descrição e seleção de tamanho
- Sacola de compras salva no navegador (`localStorage`), somando a quantidade quando o mesmo produto e tamanho são adicionados de novo
- Preços formatados em reais (R$) e carregamento de imagens sob demanda

**Painel administrativo**
- Login com e-mail e senha
- Cadastro de produtos (nome, preço, foto, tamanhos e descrição)
- Listagem e exclusão de produtos
- Sessão com expiração de 24 horas e botão de sair

## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| Front-end | HTML, CSS e JavaScript puro |
| API | Funções serverless (Node.js) na Vercel |
| Banco de dados | PostgreSQL no Neon (`@neondatabase/serverless`) |
| Autenticação | Token assinado com HMAC-SHA256 (Web Crypto API) em cookie `HttpOnly` |
| Hospedagem | Vercel |

## 📁 Estrutura do projeto

```
catalogo/
├── api/
│   ├── produtos/
│   │   └── [id].js        # Rota dinâmica por produto (ex.: exclusão)
│   ├── produtos.js        # Listar (GET) e cadastrar (POST) produtos
│   ├── login.js           # Autenticação do administrador
│   └── logout.js          # Encerra a sessão
├── admin.html             # Painel de gerenciamento
├── admin.js               # Lógica do painel
├── index.html             # Vitrine de produtos
├── login.html             # Tela de login
├── middleware.js          # Proteção das rotas administrativas
└── package.json
database/
└── produtos.sql           # Criação da tabela de produtos
```

## 🗄️ Banco de dados

Tabela `produtos`, com os campos:

| Campo | Descrição |
|---|---|
| `id` | Identificador do produto |
| `nome` | Nome do produto |
| `preco` | Preço em reais |
| `foto` | URL da imagem |
| `descricao` | Descrição detalhada (opcional) |
| `tamanhos` | Tamanhos separados por vírgula, ex.: `P, M, G` (opcional) |

O script de criação está em [`database/produtos.sql`](database/produtos.sql).

## 🔌 Endpoints da API

| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| `GET` | `/api/produtos` | Lista todos os produtos | Público |
| `POST` | `/api/produtos` | Cadastra um produto | Administrador |
| `DELETE` | `/api/produtos/:id` | Exclui um produto | Administrador |
| `POST` | `/api/login` | Autentica e cria a sessão | Público |
| `POST` | `/api/logout` | Encerra a sessão | Público |

## 🔐 Autenticação e segurança

- Ao fazer login, o servidor gera um token com a data de expiração assinado com **HMAC-SHA256** e o grava em um cookie com as flags `HttpOnly`, `Secure` e `SameSite=Lax`.
- O `middleware.js` valida o token antes de liberar as rotas administrativas.
- Credenciais e chaves **não ficam no código**: são configuradas como variáveis de ambiente na Vercel.
- As consultas ao banco usam *tagged templates* do driver do Neon, que enviam os valores como parâmetros e evitam SQL injection.

## ⚙️ Variáveis de ambiente

Configure em **Vercel > Settings > Environment Variables**:

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | String de conexão do Neon (PostgreSQL) |
| `ADMIN_EMAIL` | E-mail do administrador |
| `ADMIN_PASSWORD` | Senha do administrador |
| `AUTH_SECRET` | Chave secreta longa e aleatória para assinar a sessão |

## 🚀 Como publicar

1. Crie um projeto no [Neon](https://neon.tech) e rode `database/produtos.sql` no SQL Editor.
2. Suba este repositório no GitHub.
3. Na [Vercel](https://vercel.com), importe o repositório e defina o **Root Directory** como `catalogo`.
4. Cadastre as variáveis de ambiente acima.
5. Faça o deploy. A vitrine fica em `/` e o painel em `/login.html`.

## 📈 Próximos passos

- Edição de produtos no painel
- Finalização de pedido (checkout)
- Upload de imagens em vez de URL
- Categorias e busca na vitrine

## 👤 Autor

**Gabriel** | Analista de Dados e Desenvolvedor
