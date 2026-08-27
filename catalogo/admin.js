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

      if (res.status === 401) {
        alert('Sessão expirada. Faça login novamente.');
        window.location.href = '/login.html';
        return;
      }

      if (res.ok) {
        alert('Produto cadastrado com sucesso!');
        document.getElementById('form-cadastro').reset();
        carregarProdutosAdmin();
      } else {
        const dados = await res.json().catch(() => ({}));
        alert(dados.erro || 'Erro ao salvar o produto no servidor.');
      }
    } catch (erro) {
      console.error('Erro de conexão:', erro);
      alert('Erro de conexão com o servidor.');
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

    if (res.status === 401) {
      alert('Sessão expirada. Faça login novamente.');
      window.location.href = '/login.html';
      return;
    }

    if (res.ok) {
      carregarProdutosAdmin();
    } else {
      alert('Não foi possível excluir o produto.');
    }
  } catch (erro) {
    console.error('Erro ao deletar:', erro);
  }
}

async function sair() {
  await fetch('/api/logout', { method: 'POST' });
  window.location.href = '/login.html';
}