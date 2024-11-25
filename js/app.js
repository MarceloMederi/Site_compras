// Exibe a página de login
function showLogin() {
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('login-form').style.display = 'block';
}

// Exibe a página de cadastro de usuários
function showCadastroUsuario() {
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('cadastro-usuario').style.display = 'block';
}

// Exibe a página de cadastro de produtos
function showCadastroProduto() {
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('cadastro-produto').style.display = 'block';
}

// Volta para a página inicial
function backToHome() {
  document.getElementById('login-page').style.display = 'block';
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('cadastro-usuario').style.display = 'none';
  document.getElementById('cadastro-produto').style.display = 'none';
  document.getElementById('loja').style.display = 'none';
  document.getElementById('carrinho').style.display = 'none';
  document.getElementById('produtos').innerHTML = ''; // Limpa os produtos
}

// Exibe a loja
function showLoja() {
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('loja').style.display = 'block';
  carregarProdutos(); // Carrega os produtos ao mostrar a loja
}

// Exibe o carrinho
function showCarrinho() {
  document.getElementById('loja').style.display = 'none';
  document.getElementById('carrinho').style.display = 'block';
}

// Função para cadastrar usuário
function salvarUsuario() {
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const cpf = document.getElementById('cpf').value;
  const telefone = document.getElementById('telefone').value;
  const dataNascimento = document.getElementById('data-nascimento').value;
  const senha = document.getElementById('senha').value;

  const usuario = { nome, email, cpf, telefone, dataNascimento, senha };

  // Requisição para cadastrar o usuário no backend
  fetch('http://localhost:3000/cadastrarUsuario', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario),
  })
  .then(response => response.json())
  .then(data => {
      alert(data.message || 'Usuário cadastrado com sucesso!');
  })
  .catch(error => {
      console.error('Erro ao cadastrar usuário:', error);
  });
}

// Função de login
function login() {
  const nome = document.getElementById('login-nome').value;
  const senha = document.getElementById('login-senha').value;

  fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome, senha }),
  })
  .then(response => response.json())
  .then(data => {
      if (data.message === 'Login bem-sucedido!') {
          // Armazena o usuário no localStorage
          localStorage.setItem('usuarioLogado', JSON.stringify({ nome }));

          alert('Login bem-sucedido!');
          showLoja(); // Redireciona para a loja
      } else {
          alert(data.message || 'Erro no login');
      }
  })
  .catch(error => {
      console.error('Erro no login:', error);
  });
}

// Chama a verificação de login quando o aplicativo carregar
window.onload = verificarLogin;

// Verifica se o usuário está logado e exibe o botão de logout
function verificarLogin() {
  const usuarioLogado = localStorage.getItem('usuarioLogado');
  if (usuarioLogado) {
      showLoja(); // Exibe a loja e carrega os produtos
  } else {
      backToHome(); // Volta à página inicial
  }
}

// Função de logout
function logout() {
  // Limpa os dados de login
  localStorage.removeItem('usuarioLogado'); // Remover usuário do localStorage

  // Esconde os produtos e volta para a página inicial
  backToHome();

  alert('Você foi desconectado!');
}

// Função para cadastrar produtos (somente admin)
function salvarProduto() {
  const nomeProduto = document.getElementById('produto-nome').value;
  const descricaoProduto = document.getElementById('produto-descricao').value;
  const valorProduto = document.getElementById('produto-valor').value;

  const produto = { nome: nomeProduto, descricao: descricaoProduto, valor: valorProduto };

  const userRole = localStorage.getItem('role'); // Recuperar o role do usuário logado

  // Requisição para cadastrar o produto no backend
  fetch('http://localhost:3000/cadastrarProduto', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'user-role': userRole // Enviar o role no header
      },
      body: JSON.stringify(produto),
  })
  .then(response => response.json())
  .then(data => {
      alert(data.message || 'Produto cadastrado com sucesso!');
  })
  .catch(error => {
      console.error('Erro ao cadastrar produto:', error);
  });
}

// Função para carregar os produtos
function carregarProdutos() {
  fetch('produtos') // Caminho do arquivo produtos
  .then(response => response.json())
  .then(produtos => {
      const produtosContainer = document.getElementById('produtos');
      produtosContainer.innerHTML = ''; // Limpa os produtos antes de adicionar novos

      produtos.forEach(produto => {
          const produtoDiv = document.createElement('div');
          produtoDiv.classList.add('produto');
          produtoDiv.innerHTML = `
              <h3>${produto.nome}</h3>
              <p>${produto.descricao}</p>
              <p>R$ ${produto.valor}</p>
              <button onclick="adicionarCarrinho('${produto.nome}')">Adicionar ao Carrinho</button>
          `;
          produtosContainer.appendChild(produtoDiv);
      });
  })
  .catch(error => {
      console.error('Erro ao carregar os produtos:', error);
  });
}

// Função para adicionar ao carrinho
function adicionarCarrinho(nomeProduto) {
  // Adiciona o produto ao carrinho (localStorage ou backend, dependendo do caso)
  alert(`Produto ${nomeProduto} adicionado ao carrinho!`);
}
