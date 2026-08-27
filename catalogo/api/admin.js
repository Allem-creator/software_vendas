// Adicione no topo do admin.js
const token = localStorage.getItem('tokenAdmin');

if (!token) {
  // Se não estiver logado, redireciona para a tela de login
  window.location.href = '/login.html';
}

// Em todas as requisições (POST, DELETE), envie o token no Header:
async function deletarProduto(id) {
  if (!confirm('Tem certeza?')) return;

  const res = await fetch(`/api/produtos/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}` // Envia o token para validação
    }
  });

  if (res.status === 401 || res.status === 403) {
    alert('Sessão expirada. Faça login novamente.');
    localStorage.removeItem('tokenAdmin');
    window.location.href = '/login.html';
    return;
  }

  carregarProdutosAdmin();
}

document.addEventListener('DOMContentLoaded', () => {
  carregarProdutosAdmin();

  document.getElementById('form-cadastro').addEventListener('submit', async (e) => {
    e.preventDefault();

    const novoProduto = {
      nome: document.getElementById('nome').value,
      preco: parseFloat(document.getElementById('preco').value),
      foto: document.getElementById('foto').value,
      tamanhos: document.getElementById('tamanhos').value,
      descricao: document.getElementById('descricao').value
    };

    try {
      const res = await fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProduto)
      });

      if (res.ok) {
        alert('Produto cadastrado com sucesso!');
        document.getElementById('form-cadastro').reset();
        carregarProdutosAdmin();
      } else {
        alert('Erro ao salvar o produto no servidor.');
      }
    } catch (erro) {
      console.error('Erro de conexão:', erro);
    }
  });
});

async function carregarProdutosAdmin() {
  try {
    const res = await fetch('/api/produtos');
    const produtos = await res.json();
    const tbody = document.getElementById('tabela-admin-produtos');
    tbody.innerHTML = '';

    produtos.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img src="${p.foto}" alt="${p.nome}"></td>
        <td>${p.nome}</td>
        <td>R$ ${Number(p.preco).toFixed(2)}</td>
        <td>${p.tamanhos || 'Único'}</td>
        <td><button class="btn-deletar" onclick="deletarProduto(${p.id})">Excluir</button></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (erro) {
    console.error('Erro ao listar produtos:', erro);
  }
}

async function deletarProduto(id) {
  if (!confirm('Tem certeza que deseja excluir este produto?')) return;

  try {
    const res = await fetch(`/api/produtos/${id}`, { method: 'DELETE' });
    if (res.ok) {
      carregarProdutosAdmin();
    } else {
      alert('Não foi possível excluir o produto.');
    }
  } catch (erro) {
    console.error('Erro ao deletar:', erro);
  }
}